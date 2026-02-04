/**
 * 统一存储抽象层
 * - 开发环境：使用内存存储
 * - 生产环境：使用 Vercel Edge Config
 */

import { get as edgeConfigGet } from '@vercel/edge-config';

// 判断是否在生产环境且配置了 Edge Config
const isProduction = process.env.NODE_ENV === 'production';
const hasEdgeConfig = !!process.env.EDGE_CONFIG && !!process.env.VERCEL_API_TOKEN;
const useEdgeConfig = isProduction && hasEdgeConfig;

// 开发环境：内存存储
const globalForStorage = global as typeof globalThis & {
  __memory_storage?: Map<string, unknown>;
};

if (!globalForStorage.__memory_storage) {
  globalForStorage.__memory_storage = new Map<string, unknown>();
}

const memoryStorage = globalForStorage.__memory_storage;

/**
 * 从存储中读取数据
 */
export async function getFromStorage<T>(key: string): Promise<T | null> {
  if (useEdgeConfig) {
    try {
      const result = await edgeConfigGet<T>(key);
      return result ?? null;
    } catch (error) {
      console.error(`Error reading ${key} from Edge Config:`, error);
      return null;
    }
  } else {
    // 开发环境：使用内存
    const result = memoryStorage.get(key);
    return (result as T) ?? null;
  }
}

/**
 * 向存储中写入数据
 */
export async function setToStorage<T>(key: string, value: T): Promise<void> {
  if (useEdgeConfig) {
    // 生产环境：使用 Vercel API 更新 Edge Config
    const edgeConfigId = process.env.EDGE_CONFIG?.match(/ecfg_[a-z0-9]+/)?.[0];
    const token = process.env.VERCEL_API_TOKEN;

    if (!edgeConfigId || !token) {
      throw new Error(
        'Missing EDGE_CONFIG or VERCEL_API_TOKEN. Cannot update Edge Config without these credentials.'
      );
    }

    const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key,
            value,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update Edge Config: ${error}`);
    }
  } else {
    // 开发环境：使用内存
    memoryStorage.set(key, value);
  }
}

/**
 * 从存储中删除数据
 */
export async function deleteFromStorage(key: string): Promise<void> {
  if (useEdgeConfig) {
    const edgeConfigId = process.env.EDGE_CONFIG?.match(/ecfg_[a-z0-9]+/)?.[0];
    const token = process.env.VERCEL_API_TOKEN;

    if (!edgeConfigId || !token) {
      throw new Error(
        'Missing EDGE_CONFIG or VERCEL_API_TOKEN. Cannot update Edge Config without these credentials.'
      );
    }

    const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'delete',
            key,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete from Edge Config: ${error}`);
    }
  } else {
    // 开发环境：使用内存
    memoryStorage.delete(key);
  }
}

/**
 * 带版本控制的数据包装
 */
interface VersionedData<T> {
  data: T;
  version: number;
  updatedAt: number;
}

/**
 * 原子更新操作（使用乐观锁）
 *
 * ⚠️ 已知限制：
 * Edge Config 更新是异步的，存在以下并发风险：
 * 1. 高并发场景下可能出现"丢失更新"（Lost Update）
 * 2. 读后写之间的时间窗口内，其他请求可能已完成写入
 * 3. Edge Config 的读写延迟使得"写入后读回验证"无法保证真正的原子性
 *
 * 风险场景示例：
 * - 请求 A 读取 version=1
 * - 请求 B 读取 version=1
 * - 请求 A 写入 version=2
 * - 请求 B 写入 version=2（覆盖 A 的更新）
 * - 请求 A 验证成功（因延迟读到旧值）
 * - 请求 B 验证成功（读到自己的值）
 * - 结果：请求 A 的更新丢失
 *
 * 缓解措施：
 * 1. 增加重试次数和随机延迟，降低冲突概率
 * 2. 建议为写入热点添加应用层队列或互斥锁
 * 3. 对关键数据考虑迁移到支持真正原子操作的存储（如 Redis）
 * 4. 添加监控告警，检测异常的重试率或数据不一致
 *
 * @param key 存储键
 * @param updateFn 更新函数，接收当前数据并返回新数据
 * @param maxRetries 最大重试次数（默认5次，增加以应对高并发）
 */
export async function atomicUpdate<T>(
  key: string,
  updateFn: (current: T | null) => T,
  maxRetries: number = 5
): Promise<void> {
  let attempts = 0;
  let lastKnownVersion = -1;

  while (attempts < maxRetries) {
    try {
      // 读取当前版本化数据
      const versioned = await getFromStorage<VersionedData<T>>(`versioned:${key}`);
      const currentVersion = versioned?.version || 0;
      const currentData = versioned?.data || null;

      // 检测潜在的更新丢失：如果版本号回退，说明有问题
      if (lastKnownVersion !== -1 && currentVersion < lastKnownVersion) {
        console.error(
          `⚠️ CRITICAL: Version rollback detected for key ${key}! ` +
            `Expected >= ${lastKnownVersion}, got ${currentVersion}. ` +
            `Possible lost update or data corruption.`
        );
      }

      lastKnownVersion = currentVersion;

      // 应用更新函数
      const newData = updateFn(currentData);

      // 准备新的版本化数据
      const newVersioned: VersionedData<T> = {
        data: newData,
        version: currentVersion + 1,
        updatedAt: Date.now(),
      };

      // 尝试写入
      await setToStorage(`versioned:${key}`, newVersioned);

      // 验证写入（读取并检查版本）
      // 注意：在 Edge Config 环境下，这只是"最佳努力"验证
      const written = await getFromStorage<VersionedData<T>>(`versioned:${key}`);

      // 在开发环境（内存存储）中，写入是同步的，可以可靠验证
      // 在生产环境中，由于 Edge Config 延迟，验证结果可能不准确
      if (!useEdgeConfig) {
        // 内存存储：可靠验证
        if (written?.version === newVersioned.version) {
          return; // 成功
        }
      } else {
        // Edge Config：宽松验证（只要写入完成即认为成功）
        // 真正的冲突检测依赖于下次读取时的版本号检查
        if (written?.version === newVersioned.version || written?.version === currentVersion + 1) {
          return; // 成功（或可能成功）
        }
      }

      // 版本冲突或验证失败，重试
      attempts++;
      console.warn(
        `⚠️ Version conflict on key ${key}, attempt ${attempts}/${maxRetries}. ` +
          `Expected version ${newVersioned.version}, got ${written?.version || 'null'}`
      );

      // 指数退避 + 随机抖动，降低多个请求同时重试的概率
      const baseDelay = 100 * Math.pow(2, attempts - 1); // 100, 200, 400, 800, 1600ms
      const jitter = Math.random() * baseDelay * 0.5; // 0-50% 随机抖动
      await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
    } catch (error) {
      console.error(`❌ Error in atomic update for key ${key}:`, error);
      attempts++;

      if (attempts >= maxRetries) {
        // 记录失败告警（建议接入监控系统）
        console.error(
          `🚨 ALERT: Failed to atomically update ${key} after ${maxRetries} attempts. ` +
            `This may indicate high contention or storage issues. Consider adding application-level queueing.`
        );
        throw new Error(`Failed to update ${key} after ${maxRetries} attempts: ${error}`);
      }

      // 等待后重试（指数退避）
      const baseDelay = 100 * Math.pow(2, attempts - 1);
      const jitter = Math.random() * baseDelay * 0.5;
      await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
    }
  }

  throw new Error(`Failed to atomically update ${key} after ${maxRetries} attempts`);
}

/**
 * 从版本化存储中读取数据
 */
export async function getVersionedData<T>(key: string): Promise<T | null> {
  const versioned = await getFromStorage<VersionedData<T>>(`versioned:${key}`);
  return versioned?.data || null;
}

/**
 * 获取当前存储模式
 */
export function getStorageMode(): 'memory' | 'edge-config' {
  return useEdgeConfig ? 'edge-config' : 'memory';
}

/**
 * 清空内存存储（仅用于开发环境测试）
 */
export function clearMemoryStorage(): void {
  if (!useEdgeConfig) {
    memoryStorage.clear();
  }
}
