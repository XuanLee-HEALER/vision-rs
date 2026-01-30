import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateCode, saveVerificationCode, isAdminEmail } from '@/lib/auth/verification';

export async function POST(req: NextRequest) {
  // 延迟初始化 Resend,避免构建时报错
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 检查是否是管理员邮箱
    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 });
    }

    // 生成并保存验证码
    const code = generateCode();
    await saveVerificationCode(email, code);

    // 发送邮件
    await resend.emails.send({
      from: 'Vision-RS <noreply@' + (process.env.RESEND_DOMAIN || 'your-domain.com') + '>',
      to: email,
      subject: 'Vision-RS 管理后台登录验证码',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Vision-RS 管理后台</h2>
          <p>您的登录验证码是：</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
            ${code}
          </div>
          <p style="color: #666; margin-top: 20px;">验证码有效期为 5 分钟。</p>
          <p style="color: #666;">如果您没有请求此验证码，请忽略此邮件。</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send verification code:', error);
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 });
  }
}
