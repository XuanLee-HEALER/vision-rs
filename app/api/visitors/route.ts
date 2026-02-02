// 访问统计 API - 使用 Vercel Edge Config 存储
import { NextRequest, NextResponse } from 'next/server';
import { recordVisit, getLast7DaysStats } from '@/lib/visitors';

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
    // 只读取数据，不记录访问（避免 GET 请求的副作用）
    // 如需记录访问，前端应调用 POST /api/visitors
    const data = await getLast7DaysStats();

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({ error: '获取访问统计失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 仅用于记录页面访问（不返回数据）
    const clientIP = getClientIP(request);
    await recordVisit(clientIP);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording visit:', error);
    return NextResponse.json({ error: '记录访问失败' }, { status: 500 });
  }
}
