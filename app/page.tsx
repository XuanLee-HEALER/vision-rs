'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

// Catppuccin Macchiato Color Palette
const colors = {
  base: '#24273a',
  mantle: '#1e2030',
  crust: '#181926',
  text: '#cad3f5',
  subtext0: '#a5adcb',
  subtext1: '#b8c0e0',
  surface0: '#363a4f',
  surface1: '#494d64',
  surface2: '#5b6078',
  overlay0: '#6e738d',
  overlay1: '#8087a2',
  overlay2: '#939ab7',
  blue: '#8aadf4',
  lavender: '#b7bdf8',
  sapphire: '#7dc4e4',
  sky: '#91d7e3',
  teal: '#8bd5ca',
  green: '#a6da95',
  yellow: '#eed49f',
  peach: '#f5a97f',
  maroon: '#ee99a0',
  red: '#ed8796',
  mauve: '#c6a0f6',
  pink: '#f5bde6',
  flamingo: '#f0c6c6',
  rosewater: '#f4dbd6',
  rust: '#f5a97f',
};

interface Message {
  id: string;
  content: string;
  timestamp: number;
}

interface VisitorData {
  date: string;
  visitors: number;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);

  // 加载访问统计和留言
  useEffect(() => {
    // 记录访问（POST 请求）
    fetch('/api/visitors', { method: 'POST' }).catch((err) =>
      console.error('Failed to record visit:', err)
    );

    // 加载访问统计（GET 请求，只读）
    fetch('/api/visitors')
      .then((res) => res.json())
      .then((data) => setVisitorData(data.data))
      .catch((err) => console.error('Failed to load visitor stats:', err));

    // 加载留言
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data.messages))
      .catch((err) => console.error('Failed to load messages:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '发送失败，请稍后再试');
        return;
      }

      setMessages((prev) => [data.message, ...prev].slice(0, 7));
      setNewMessage('');
    } catch {
      setError('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.base,
        color: colors.text,
        fontFamily: "'Geist', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Hero Section */}
      <header
        style={{
          padding: '4rem 2rem 2rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem',
          }}
        >
          {/* Title */}
          <div>
            <h1
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: '700',
                margin: 0,
                background: `linear-gradient(135deg, ${colors.rust} 0%, ${colors.peach} 50%, ${colors.yellow} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
              }}
            >
              vision-rs
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: colors.subtext1,
                margin: '1.5rem 0 0 0',
                lineHeight: '1.8',
                maxWidth: '900px',
              }}
            >
              Rust
              以其内存安全和高性能著称，但其所有权系统、生命周期等核心概念对初学者来说往往难以理解。
              <Link
                href="/learn"
                style={{
                  color: colors.blue,
                  textDecoration: 'none',
                  borderBottom: `2px solid ${colors.blue}`,
                  fontWeight: '500',
                  fontSize: '1.1em',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.lavender;
                  e.currentTarget.style.borderBottomColor = colors.lavender;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.blue;
                  e.currentTarget.style.borderBottomColor = colors.blue;
                }}
              >
                vision-rs
              </Link>
              致力于通过交互式图形化界面，将这些抽象概念可视化呈现，让学习者能够直观地看到变量的所有权转移、借用检查的工作机制，以及内存分配的实时状态。我相信，通过视觉化的方式，能够大大降低
              Rust 的学习曲线，帮助更多开发者掌握这门强大的系统编程语言。
            </p>
          </div>

          {/* Rust Lifetime Error Showcase */}
          <div
            style={{
              background: colors.mantle,
              border: `1px solid ${colors.surface0}`,
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1px',
            }}
          >
            {/* Source Code (Left) */}
            <div
              style={{
                background: colors.mantle,
                padding: '1.5rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: colors.overlay1,
                  fontWeight: '600',
                }}
              >
                源码 (src/main.rs)
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                  lineHeight: '1.6',
                  overflow: 'auto',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                <code>
                  <span style={{ color: colors.mauve }}>fn</span>{' '}
                  <span style={{ color: colors.blue }}>get_first</span>
                  {'<'}
                  <span style={{ color: colors.yellow }}>&apos;a</span>
                  {'>('}
                  <span style={{ color: colors.text }}>data</span>: &amp;
                  <span style={{ color: colors.yellow }}>&apos;a</span> Vec&lt;i32&gt;)
                  {'\n'}
                  {'    -> &'}
                  <span style={{ color: colors.yellow }}>&apos;a</span> i32 {'{'}
                  {'\n'}
                  {'    &data['}
                  <span style={{ color: colors.peach }}>0</span>
                  {']'}
                  {'\n'}
                  {'}'}
                  {'\n\n'}
                  <span style={{ color: colors.mauve }}>fn</span>{' '}
                  <span style={{ color: colors.blue }}>main</span>() {'{'}
                  {'\n'}
                  {'    '}
                  <span style={{ color: colors.mauve }}>let</span>{' '}
                  <span style={{ color: colors.text }}>result</span>;{'\n'}
                  {'    {'}
                  {'\n'}
                  {'        '}
                  <span style={{ color: colors.mauve }}>let</span>{' '}
                  <span style={{ color: colors.text }}>data</span> ={' '}
                  <span style={{ color: colors.blue }}>vec!</span>[
                  <span style={{ color: colors.peach }}>1</span>,{' '}
                  <span style={{ color: colors.peach }}>2</span>,{' '}
                  <span style={{ color: colors.peach }}>3</span>];
                  {'\n'}
                  {'        '}
                  <span style={{ color: colors.text }}>result</span> ={' '}
                  <span style={{ color: colors.blue }}>get_first</span>(&amp;data);{' '}
                  <span style={{ color: colors.red }}>// ❌</span>
                  {'\n'}
                  {'    }'}
                  {'\n'}
                  {'    '}
                  <span style={{ color: colors.blue }}>println!</span>(
                  <span style={{ color: colors.green }}>&quot;First: {'{}'}&quot;</span>, result);
                  {'\n'}
                  {'}'}
                </code>
              </pre>
            </div>

            {/* Compiler Error (Right) */}
            <div
              style={{
                background: colors.crust,
                padding: '1.5rem',
                borderLeft: `1px solid ${colors.surface0}`,
              }}
            >
              <div
                style={{
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: colors.red,
                  fontWeight: '600',
                }}
              >
                编译错误
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                  lineHeight: '1.6',
                  overflow: 'auto',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  color: colors.text,
                }}
              >
                <code>
                  <span style={{ color: colors.red, fontWeight: '600' }}>error[E0597]</span>
                  <span style={{ color: colors.text }}>: `data` does not</span>
                  {'\n'}
                  <span style={{ color: colors.text }}>live long enough</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> --&gt; src/main.rs:9:30</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}>9 |</span>
                  <span style={{ color: colors.text }}> result = get_first(</span>
                  <span style={{ color: colors.red }}>&amp;data</span>
                  <span style={{ color: colors.text }}>);</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'                              '}
                  <span style={{ color: colors.red }}>^^^^^ borrowed</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'                              '}
                  <span style={{ color: colors.red }}>value does not</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'                              '}
                  <span style={{ color: colors.red }}>live long enough</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}>10 |</span>
                  <span style={{ color: colors.text }}> {'}'}</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'     '}
                  <span style={{ color: colors.red }}>- `data` dropped here</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'       '}
                  <span style={{ color: colors.red }}>while still borrowed</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}>11 |</span>
                  <span style={{ color: colors.text }}> println!(...);</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'     '}
                  <span style={{ color: colors.red }}>------ borrow later</span>
                  {'\n'}
                  <span style={{ color: colors.blue }}> |</span>
                  {'            '}
                  <span style={{ color: colors.red }}>used here</span>
                  {'\n\n'}
                  <span style={{ color: colors.yellow }}>help</span>
                  <span style={{ color: colors.text }}>: consider moving `data`</span>
                  {'\n'}
                  <span style={{ color: colors.text }}>outside the inner scope</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Visitor Chart */}
        <section
          style={{
            background: colors.mantle,
            border: `1px solid ${colors.surface0}`,
            borderRadius: '12px',
            padding: '2rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginTop: 0,
              marginBottom: '1.5rem',
              color: colors.lavender,
            }}
          >
            访问统计
          </h2>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.surface0} />
                <XAxis dataKey="date" stroke={colors.subtext0} style={{ fontSize: '0.85rem' }} />
                <YAxis stroke={colors.subtext0} style={{ fontSize: '0.85rem' }} />
                <Tooltip
                  contentStyle={{
                    background: colors.surface0,
                    border: `1px solid ${colors.surface1}`,
                    borderRadius: '8px',
                    color: colors.text,
                  }}
                  labelStyle={{ color: colors.subtext1 }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke={colors.rust}
                  strokeWidth={3}
                  dot={{ fill: colors.rust, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="访问量"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Message Board */}
        <section
          style={{
            background: colors.mantle,
            border: `1px solid ${colors.surface0}`,
            borderRadius: '12px',
            padding: '2rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginTop: 0,
              marginBottom: '1.5rem',
              color: colors.lavender,
            }}
          >
            留言板
          </h2>

          {/* Message Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="留下你的想法..."
              disabled={loading}
              maxLength={150}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '1rem',
                background: colors.surface0,
                border: `1px solid ${colors.surface1}`,
                borderRadius: '8px',
                color: colors.text,
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = colors.rust)}
              onBlur={(e) => (e.target.style.borderColor = colors.surface1)}
            />
            {error && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: colors.surface0,
                  border: `1px solid ${colors.red}`,
                  borderRadius: '8px',
                  borderLeft: `4px solid ${colors.red}`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: colors.red,
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ⚠️ {error}
                </p>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                style={{
                  padding: '0.75rem 2rem',
                  background: loading ? colors.surface1 : colors.rust,
                  color: colors.crust,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: loading || !newMessage.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading && newMessage.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.rust}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? '发送中...' : '发送留言'}
              </button>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: colors.overlay1,
                }}
              >
                💡 每个IP地址6小时内只能发送一条留言 · {newMessage.length}/150
              </p>
            </div>
          </form>

          {/* Messages List */}
          <div>
            {messages.map((message, index) => (
              <div
                key={message.id}
                style={{
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  borderBottom:
                    index < messages.length - 1 ? `1px solid ${colors.surface0}` : 'none',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: colors.text,
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
                    fontSize: '0.95rem',
                  }}
                >
                  {message.content}
                </p>
                <p
                  style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '0.75rem',
                    color: colors.overlay0,
                  }}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            ))}
            {messages.length === 0 && (
              <p
                style={{
                  textAlign: 'center',
                  color: colors.overlay1,
                  padding: '2rem',
                }}
              >
                暂无留言，来写第一条吧！
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '3rem 2rem 2rem',
          textAlign: 'center',
          color: colors.overlay1,
          fontSize: '0.9rem',
          borderTop: `1px solid ${colors.surface0}`,
          marginTop: '4rem',
        }}
      >
        <p style={{ margin: 0 }}>
          Built with Next.js 16 & React 19 · Styled with Catppuccin Macchiato
        </p>
        <p style={{ margin: '0.5rem 0 0 0', color: colors.overlay0 }}>
          © 2024 vision-rs · 让 Rust 学习更加直观
        </p>
      </footer>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
