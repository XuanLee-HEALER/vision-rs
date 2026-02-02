// 留言板 API - 使用 Vercel Edge Config 存储
import { NextRequest, NextResponse } from 'next/server';
import { getRecentMessages, checkRateLimit, addMessage, deleteMessage } from '@/lib/messages';

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

export async function GET() {
  try {
    const messages = await getRecentMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: '获取留言失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    // 验证内容
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: '留言内容不能为空' }, { status: 400 });
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length === 0) {
      return NextResponse.json({ error: '留言内容不能为空' }, { status: 400 });
    }

    if (trimmedContent.length > 150) {
      return NextResponse.json({ error: '留言内容不能超过150字' }, { status: 400 });
    }

    // 获取客户端IP
    const clientIP = getClientIP(request);

    // 检查频率限制
    const rateLimitCheck = await checkRateLimit(clientIP);

    if (!rateLimitCheck.allowed) {
      const hoursRemaining = Math.ceil((rateLimitCheck.remainingTime || 0) / (60 * 60 * 1000));
      return NextResponse.json(
        {
          error: `请等待 ${hoursRemaining} 小时后再发送留言`,
          remainingTime: rateLimitCheck.remainingTime,
        },
        { status: 429 }
      );
    }

    // 添加新留言
    const newMessage = await addMessage(trimmedContent, clientIP);

    // 返回不含IP的留言数据
    return NextResponse.json({
      message: {
        id: newMessage.id,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
      },
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: '服务器错误,请稍后再试' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, adminKey } = await request.json();

    // 验证管理员密钥
    const ADMIN_KEY = process.env.ADMIN_KEY;

    if (!ADMIN_KEY || adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    await deleteMessage(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
