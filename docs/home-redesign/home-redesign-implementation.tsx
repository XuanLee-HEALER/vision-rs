'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

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
  rust: '#f5a97f',
  green: '#a6da95',
  yellow: '#eed49f',
  peach: '#f5a97f',
  mauve: '#c6a0f6',
  red: '#ed8796',
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
  const [bioExpanded, setBioExpanded] = useState(false);

  // 加载数据
  useEffect(() => {
    // 记录访问
    fetch('/api/visitors', { method: 'POST' }).catch((err) =>
      console.error('Failed to record visit:', err)
    );

    // 加载统计
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

  // 计算总访问量
  const totalVisitors = visitorData.reduce((sum, item) => sum + item.visitors, 0);
  const todayVisitors = visitorData.length > 0 ? visitorData[visitorData.length - 1].visitors : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.base,
        color: colors.text,
        fontFamily: "'Geist', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
      }}
    >
      {/* Bio Card - 右上角悬浮 */}
      <div
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          width: '320px',
          background: 'rgba(30, 32, 48, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: `1px solid transparent`,
          backgroundImage: `linear-gradient(${colors.mantle}, ${colors.mantle}), linear-gradient(135deg, ${colors.rust}, ${colors.lavender})`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          maxHeight: bioExpanded ? '400px' : '180px',
          overflow: 'hidden',
        }}
        onClick={() => setBioExpanded(!bioExpanded)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(245, 169, 127, 0.2)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Avatar Placeholder */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.rust}, ${colors.lavender})`,
            marginBottom: '1rem',
          }}
        />

        {/* Bio Text */}
        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: colors.subtext1,
            margin: 0,
          }}
        >
          已加入 Vibe Coding 阵营，践行无边界开发理念。深耕服务端编程，其他领域仍在探索。
        </p>

        {/* Expand Indicator */}
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: `1px solid ${colors.surface0}`,
            fontSize: '0.85rem',
            color: colors.overlay1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>{bioExpanded ? '收起' : '查看更多'}</span>
          <span
            style={{
              transform: bioExpanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s',
            }}
          >
            ↓
          </span>
        </div>

        {/* Expanded Content */}
        {bioExpanded && (
          <div
            style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: `1px solid ${colors.surface0}`,
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ fontSize: '0.9rem', color: colors.subtext1, lineHeight: '1.8' }}>
              <p style={{ margin: '0.5rem 0' }}>
                <strong style={{ color: colors.text }}>技术栈：</strong>Rust / Go / TypeScript
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong style={{ color: colors.text }}>关注领域：</strong>系统编程 / 后端架构
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong style={{ color: colors.text }}>当前状态：</strong>持续学习中
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <header
        style={{
          padding: '6rem 2rem 4rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontWeight: '700',
            margin: 0,
            background: `linear-gradient(135deg, ${colors.rust} 0%, ${colors.peach} 50%, ${colors.yellow} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
            lineHeight: '1.1',
            animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both',
          }}
        >
          vision-rs
        </h1>

        {/* Divider */}
        <div
          style={{
            width: '200px',
            height: '3px',
            background: `linear-gradient(90deg, ${colors.rust} 0%, transparent 100%)`,
            margin: '2rem 0',
            animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both',
          }}
        />

        {/* Slogan */}
        <p
          style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
            color: colors.subtext1,
            margin: '2rem 0 0 0',
            lineHeight: '1.8',
            maxWidth: '60%',
            animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both',
          }}
        >
          Rust
          以其内存安全和高性能著称，但其所有权系统、生命周期等核心概念对初学者来说往往难以理解。
          <Link
            href="/learn"
            style={{
              color: colors.blue,
              textDecoration: 'none',
              position: 'relative',
              fontWeight: '500',
              fontSize: '1.05em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.lavender;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.blue;
            }}
          >
            vision-rs
          </Link>
          致力于通过交互式图形化界面，将这些抽象概念可视化呈现，让学习者能够直观地看到变量的所有权转移、借用检查的工作机制，以及内存分配的实时状态。
        </p>

        {/* Code Showcase - 倾斜切角 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '2px',
            marginTop: '4rem',
            clipPath:
              'polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)',
            background: `linear-gradient(135deg, ${colors.mantle} 0%, ${colors.crust} 100%)`,
            animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both',
          }}
        >
          {/* Source Code */}
          <div
            style={{
              background: colors.mantle,
              padding: '2rem',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent 0%, ${colors.rust} 50%, transparent 100%)`,
              }}
            />
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

          {/* Compiler Error */}
          <div
            style={{
              background: colors.crust,
              padding: '2rem',
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
              </code>
            </pre>
          </div>
        </div>
      </header>

      {/* Main Content - 不规则网格 */}
      <main
        style={{
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '0.8fr 1.2fr',
          gap: '2rem',
        }}
      >
        {/* Visitor Stats - 简化为卡片 */}
        <section
          style={{
            background: colors.mantle,
            border: `1px solid ${colors.surface0}`,
            borderRadius: '12px',
            padding: '2rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.3)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginTop: 0,
              marginBottom: '2rem',
              color: colors.lavender,
            }}
          >
            访问统计
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {/* Circular Progress Placeholder */}
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: `8px solid ${colors.surface0}`,
                borderTop: `8px solid ${colors.rust}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: colors.text }}>
                {totalVisitors}
              </div>
              <div style={{ fontSize: '0.85rem', color: colors.subtext0 }}>总访问量</div>
            </div>
            <div style={{ fontSize: '1rem', color: colors.subtext1 }}>
              今日访问: {todayVisitors}
            </div>
          </div>
        </section>

        {/* Message Board - 瀑布流 */}
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
                <p style={{ margin: 0, color: colors.red, fontSize: '0.9rem', fontWeight: '500' }}>
                  {error}
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
              <p style={{ margin: 0, fontSize: '0.85rem', color: colors.overlay1 }}>
                每个IP地址6小时内只能发送一条留言 · {newMessage.length}/150
              </p>
            </div>
          </form>

          {/* Messages Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  background: 'rgba(54, 58, 79, 0.5)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'rgba(73, 77, 100, 0.7)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(54, 58, 79, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
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
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: colors.overlay0 }}>
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
                  gridColumn: '1 / -1',
                }}
              >
                暂无留言，来写第一条吧
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* 响应式调整 */
        @media (max-width: 1023px) {
          /* 平板 */
        }

        @media (max-width: 767px) {
          /* 移动端 */
        }
      `}</style>
    </div>
  );
}
