// 访问统计 API - 使用 Vercel Edge Config 存储
import { NextRequest, NextResponse } from 'next/server';
import { recordVisit, getLast7DaysStats } from '@/lib/visitors';

function getClientIP(request: NextRequest): string {
  // 1. Vercel 特定头（最可信，直接来自 Vercel Edge）
  const vercelIP = request.headers.get('x-vercel-forwarded-for');
  if (vercelIP) return vercelIP.split(',')[0].trim();

  // 2. Cloudflare 真实 IP
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  // 3. 标准代理头
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  // 4. 其他
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

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
