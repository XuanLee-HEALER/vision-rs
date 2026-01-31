import { kv } from '@vercel/kv';

interface VerificationData {
  code: string;
  attempts: number;
  createdAt: number;
}

// 开发环境的内存存储 - 使用 global 确保跨模块共享
const globalForDev = global as typeof globalThis & {
  __dev_verification_storage?: Map<string, VerificationData>;
};

if (!globalForDev.__dev_verification_storage) {
  globalForDev.__dev_verification_storage = new Map<string, VerificationData>();
}

const devStorage = globalForDev.__dev_verification_storage;

// 检查是否可以使用 KV
const hasKV = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

/**
 * 生成 6 位数字验证码
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 保存验证码,有效期 5 分钟
 */
export async function saveVerificationCode(email: string, code: string) {
  const key = `auth:code:${email}`;
  const data: VerificationData = {
    code,
    attempts: 0,
    createdAt: Date.now(),
  };

  if (hasKV()) {
    // 使用 Vercel KV
    await kv.setex(key, 300, JSON.stringify(data));
  } else {
    // 使用内存存储（开发环境）
    devStorage.set(key, data);

    // 5 分钟后自动清除
    setTimeout(() => {
      devStorage.delete(key);
    }, 300000);
  }
}

/**
 * 验证验证码
 * @throws Error 如果尝试次数过多
 */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const key = `auth:code:${email}`;
  let data: VerificationData | null = null;

  if (hasKV()) {
    // 使用 Vercel KV
    const dataStr = await kv.get<string>(key);
    if (dataStr) {
      data = JSON.parse(dataStr);
    }
  } else {
    // 使用内存存储（开发环境）
    data = devStorage.get(key) || null;
    console.log('🔍 Verify code debug:', {
      key,
      inputCode: code,
      storedCode: data?.code,
      hasData: !!data,
      storageSize: devStorage.size,
    });
  }

  if (!data) {
    console.log('❌ No verification data found for:', email);
    return false;
  }

  // 检查是否过期（5 分钟）
  if (Date.now() - data.createdAt > 300000) {
    if (hasKV()) {
      await kv.del(key);
    } else {
      devStorage.delete(key);
    }
    return false;
  }

  // 检查尝试次数
  if (data.attempts >= 3) {
    if (hasKV()) {
      await kv.del(key);
    } else {
      devStorage.delete(key);
    }
    throw new Error('Too many attempts');
  }

  // 验证码不匹配
  if (data.code !== code) {
    data.attempts += 1;
    if (hasKV()) {
      await kv.setex(key, 300, JSON.stringify(data));
    } else {
      devStorage.set(key, data);
    }
    return false;
  }

  // 验证成功,删除验证码
  if (hasKV()) {
    await kv.del(key);
  } else {
    devStorage.delete(key);
  }
  return true;
}

/**
 * 检查邮箱是否在管理员白名单中
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}
