'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const sendCode = async () => {
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '发送验证码失败');
      }

      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('请输入 6 位验证码');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '验证失败');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !isLoading) {
      action();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text mb-2">Vision-RS</h1>
          <p className="text-subtext0">管理后台登录</p>
        </div>

        {/* Login Form */}
        <div className="rounded-lg bg-surface0 p-8 shadow-lg border border-overlay0">
          {step === 'email' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                管理员邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, sendCode)}
                placeholder="输入管理员邮箱"
                className="mb-4 w-full rounded bg-surface1 px-4 py-3 text-text placeholder:text-overlay2 focus:outline-none focus:ring-2 focus:ring-blue"
                disabled={isLoading}
              />
              <button
                onClick={sendCode}
                disabled={isLoading}
                className="w-full rounded bg-blue px-4 py-3 text-base font-medium hover:bg-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '发送中...' : '发送验证码'}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-sm text-subtext0 mb-1">验证码已发送至</div>
                <div className="text-text font-medium">{email}</div>
                <button
                  onClick={() => setStep('email')}
                  className="text-xs text-blue hover:text-blue/80 mt-1"
                >
                  更换邮箱
                </button>
              </div>

              <label htmlFor="code" className="block text-sm font-medium text-text mb-2">
                6 位验证码
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={(e) => handleKeyPress(e, verifyCode)}
                placeholder="输入验证码"
                className="mb-4 w-full rounded bg-surface1 px-4 py-3 text-text text-center text-2xl tracking-widest placeholder:text-overlay2 focus:outline-none focus:ring-2 focus:ring-blue"
                disabled={isLoading}
                maxLength={6}
              />
              <button
                onClick={verifyCode}
                disabled={isLoading}
                className="w-full rounded bg-blue px-4 py-3 text-base font-medium hover:bg-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '验证中...' : '登录'}
              </button>

              <button
                onClick={sendCode}
                disabled={isLoading}
                className="w-full mt-3 text-sm text-subtext0 hover:text-text transition-colors"
              >
                没收到验证码？重新发送
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded bg-red/10 border border-red/30 px-4 py-3 text-sm text-red">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-overlay2">
          <p>仅限管理员访问</p>
        </div>
      </div>
    </div>
  );
}
