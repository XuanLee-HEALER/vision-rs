import { kv } from '@vercel/kv';

interface VerificationData {
  code: string;
  attempts: number;
  createdAt: number;
}

/**
 * 生成 6 位数字验证码
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 保存验证码到 KV 存储,有效期 5 分钟
 */
export async function saveVerificationCode(email: string, code: string) {
  const key = `auth:code:${email}`;
  const data: VerificationData = {
    code,
    attempts: 0,
    createdAt: Date.now(),
  };

  // 5 分钟过期
  await kv.setex(key, 300, JSON.stringify(data));
}

/**
 * 验证验证码
 * @throws Error 如果尝试次数过多
 */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const key = `auth:code:${email}`;
  const dataStr = await kv.get<string>(key);

  if (!dataStr) {
    return false;
  }

  const data: VerificationData = JSON.parse(dataStr);

  // 检查尝试次数
  if (data.attempts >= 3) {
    await kv.del(key);
    throw new Error('Too many attempts');
  }

  // 验证码不匹配
  if (data.code !== code) {
    data.attempts += 1;
    await kv.setex(key, 300, JSON.stringify(data));
    return false;
  }

  // 验证成功,删除验证码
  await kv.del(key);
  return true;
}

/**
 * 检查邮箱是否在管理员白名单中
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  return adminEmails.includes(email);
}
