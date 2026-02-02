import { getFromStorage, setToStorage } from '@/lib/storage';

interface VerificationData {
  code: string;
  attempts: number;
  createdAt: number;
}

interface RateLimitData {
  count: number;
  resetAt: number;
}

// 存储键名
const VERIFICATION_STORAGE_KEY = 'auth:verifications';
const RATELIMIT_STORAGE_KEY = 'auth:ratelimits';

/**
 * 生成 6 位数字验证码（使用密码学安全随机数）
 */
export function generateCode(): string {
  // 使用 crypto.randomInt 生成密码学安全的随机数
  const crypto = require('crypto');
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * 获取所有验证码数据
 */
async function getAllVerifications(): Promise<Record<string, VerificationData>> {
  const data = await getFromStorage<Record<string, VerificationData>>(VERIFICATION_STORAGE_KEY);
  return data || {};
}

/**
 * 保存验证码，有效期 5 分钟
 */
export async function saveVerificationCode(email: string, code: string) {
  const key = email;
  const allVerifications = await getAllVerifications();

  allVerifications[key] = {
    code,
    attempts: 0,
    createdAt: Date.now(),
  };

  await setToStorage(VERIFICATION_STORAGE_KEY, allVerifications);

  // 注意：在无状态环境中，setTimeout 不可靠
  // 过期验证会在 verifyCode 时进行检查和清理
}

/**
 * 验证验证码
 * @throws Error 如果尝试次数过多
 */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const key = email;
  const allVerifications = await getAllVerifications();
  const data = allVerifications[key] || null;

  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Verify code debug:', {
      key,
      inputCode: code,
      storedCode: data?.code,
      hasData: !!data,
    });
  }

  if (!data) {
    console.error('❌ No verification data found for:', email);
    return false;
  }

  // 检查是否过期（5 分钟）
  if (Date.now() - data.createdAt > 300000) {
    delete allVerifications[key];
    await setToStorage(VERIFICATION_STORAGE_KEY, allVerifications);
    return false;
  }

  // 检查尝试次数
  if (data.attempts >= 3) {
    delete allVerifications[key];
    await setToStorage(VERIFICATION_STORAGE_KEY, allVerifications);
    throw new Error('Too many attempts');
  }

  // 验证码不匹配
  if (data.code !== code) {
    data.attempts += 1;
    allVerifications[key] = data;
    await setToStorage(VERIFICATION_STORAGE_KEY, allVerifications);
    return false;
  }

  // 验证成功，删除验证码
  delete allVerifications[key];
  await setToStorage(VERIFICATION_STORAGE_KEY, allVerifications);
  return true;
}

/**
 * 检查邮箱是否在管理员白名单中
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}

/**
 * 获取所有频率限制数据
 */
async function getAllRateLimits(): Promise<Record<string, RateLimitData>> {
  const data = await getFromStorage<Record<string, RateLimitData>>(RATELIMIT_STORAGE_KEY);
  return data || {};
}

/**
 * 检查发送验证码的频率限制
 * 限制：每个 IP+email 组合 1 分钟内最多发送 3 次
 * @returns { allowed: boolean, remainingTime?: number }
 */
export async function checkSendCodeRateLimit(
  ip: string,
  email: string
): Promise<{ allowed: boolean; remainingTime?: number }> {
  const key = `${ip}:${email}`;
  const now = Date.now();
  const allRateLimits = await getAllRateLimits();
  const data = allRateLimits[key];

  // 如果没有记录或已过期，允许发送
  if (!data || now >= data.resetAt) {
    allRateLimits[key] = {
      count: 1,
      resetAt: now + 60000, // 1 分钟后重置
    };
    await setToStorage(RATELIMIT_STORAGE_KEY, allRateLimits);
    return { allowed: true };
  }

  // 检查是否超过限制
  if (data.count >= 3) {
    return {
      allowed: false,
      remainingTime: data.resetAt - now,
    };
  }

  // 增加计数
  data.count += 1;
  allRateLimits[key] = data;
  await setToStorage(RATELIMIT_STORAGE_KEY, allRateLimits);
  return { allowed: true };
}
