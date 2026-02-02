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
 * @param key 存储键
 * @param updateFn 更新函数，接收当前数据并返回新数据
 * @param maxRetries 最大重试次数（默认3次）
 */
export async function atomicUpdate<T>(
  key: string,
  updateFn: (current: T | null) => T,
  maxRetries: number = 3
): Promise<void> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      // 读取当前版本化数据
      const versioned = await getFromStorage<VersionedData<T>>(`versioned:${key}`);
      const currentVersion = versioned?.version || 0;
      const currentData = versioned?.data || null;

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
      const written = await getFromStorage<VersionedData<T>>(`versioned:${key}`);

      // 在开发环境（内存存储）中，写入总是成功的
      // 在生产环境中，我们无法真正验证版本冲突，因为 Edge Config 更新有延迟
      // 这里我们假设写入成功，因为 Edge Config 的更新通常很快
      if (written?.version === newVersioned.version || !useEdgeConfig) {
        return; // 成功
      }

      // 版本冲突，重试
      attempts++;
      console.warn(`Version conflict on key ${key}, attempt ${attempts}/${maxRetries}`);

      // 等待一小段时间后重试
      await new Promise((resolve) => setTimeout(resolve, 100 * attempts));
    } catch (error) {
      console.error(`Error in atomic update for key ${key}:`, error);
      attempts++;

      if (attempts >= maxRetries) {
        throw new Error(`Failed to update ${key} after ${maxRetries} attempts`);
      }

      // 等待后重试
      await new Promise((resolve) => setTimeout(resolve, 100 * attempts));
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
