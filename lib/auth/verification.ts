interface VerificationData {
  code: string;
  attempts: number;
  createdAt: number;
}

// 使用 global 确保跨模块共享内存存储
const globalForVerification = global as typeof globalThis & {
  __verification_storage?: Map<string, VerificationData>;
};

if (!globalForVerification.__verification_storage) {
  globalForVerification.__verification_storage = new Map<string, VerificationData>();
}

const storage = globalForVerification.__verification_storage;

/**
 * 生成 6 位数字验证码
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 保存验证码，有效期 5 分钟
 */
export async function saveVerificationCode(email: string, code: string) {
  const key = `auth:code:${email}`;
  const data: VerificationData = {
    code,
    attempts: 0,
    createdAt: Date.now(),
  };

  storage.set(key, data);

  // 5 分钟后自动清除
  setTimeout(() => {
    storage.delete(key);
  }, 300000);
}

/**
 * 验证验证码
 * @throws Error 如果尝试次数过多
 */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const key = `auth:code:${email}`;
  const data = storage.get(key) || null;

  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Verify code debug:', {
      key,
      inputCode: code,
      storedCode: data?.code,
      hasData: !!data,
      storageSize: storage.size,
    });
  }

  if (!data) {
    console.error('❌ No verification data found for:', email);
    return false;
  }

  // 检查是否过期（5 分钟）
  if (Date.now() - data.createdAt > 300000) {
    storage.delete(key);
    return false;
  }

  // 检查尝试次数
  if (data.attempts >= 3) {
    storage.delete(key);
    throw new Error('Too many attempts');
  }

  // 验证码不匹配
  if (data.code !== code) {
    data.attempts += 1;
    storage.set(key, data);
    return false;
  }

  // 验证成功，删除验证码
  storage.delete(key);
  return true;
}

/**
 * 检查邮箱是否在管理员白名单中
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}
