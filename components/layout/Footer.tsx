'use client';

import { useState } from 'react';

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
  overlay0: '#6e738d',
  overlay1: '#8087a2',
  blue: '#8aadf4',
  lavender: '#b7bdf8',
  rust: '#f5a97f',
  green: '#a6da95',
  yellow: '#eed49f',
  mauve: '#c6a0f6',
};

interface Project {
  name: string;
  url: string;
  description: string;
}

const projects: Project[] = [
  {
    name: 'zuo-algo',
    url: 'https://github.com/XuanLee-HEALER/zuo-algo',
    description: '算法学习与实践的 Rust 实现（涵盖排序、树、图等经典算法）',
  },
  {
    name: 'FeedMe',
    url: 'https://github.com/XuanLee-HEALER/FeedMe',
    description: '原生 macOS 菜单栏 RSS 阅读器（SwiftUI + OPML 支持）',
  },
];

export default function Footer() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [pdfHovered, setPdfHovered] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);

  const email = 'your-email@example.com';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <footer
      style={{
        borderTop: `1px solid ${colors.surface0}`,
        marginTop: '4rem',
        background: colors.mantle,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '3rem 2rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* About Section */}
        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: colors.lavender,
              marginTop: 0,
              marginBottom: '1.2rem',
            }}
          >
            vision-rs
          </h3>
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: '1.7',
              color: colors.subtext1,
              margin: '0 0 1rem 0',
            }}
          >
            可视化 Rust 核心概念
          </p>
          <div
            style={{
              fontSize: '0.85rem',
              color: colors.overlay1,
              lineHeight: '1.8',
            }}
          >
            <p style={{ margin: '0.3rem 0' }}>
              基于{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: colors.text,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${colors.surface1}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.blue;
                  e.currentTarget.style.borderBottomColor = colors.blue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text;
                  e.currentTarget.style.borderBottomColor = colors.surface1;
                }}
              >
                Next.js
              </a>{' '}
              与{' '}
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: colors.text,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${colors.surface1}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.blue;
                  e.currentTarget.style.borderBottomColor = colors.blue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text;
                  e.currentTarget.style.borderBottomColor = colors.surface1;
                }}
              >
                React
              </a>{' '}
              构建
            </p>
            <p style={{ margin: '0.3rem 0' }}>
              采用{' '}
              <a
                href="https://github.com/catppuccin/catppuccin"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: colors.text,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${colors.surface1}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.mauve;
                  e.currentTarget.style.borderBottomColor = colors.mauve;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text;
                  e.currentTarget.style.borderBottomColor = colors.surface1;
                }}
              >
                Catppuccin
              </a>{' '}
              配色
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: colors.lavender,
              marginTop: 0,
              marginBottom: '1.2rem',
            }}
          >
            其他项目
          </h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {projects.map((project) => (
              <li key={project.name} style={{ marginBottom: '1rem' }}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredProject(project.name)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    padding: '0.5rem',
                    marginLeft: '-0.5rem',
                    borderRadius: '6px',
                    background: hoveredProject === project.name ? colors.surface0 : 'transparent',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.3rem',
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      style={{
                        color: hoveredProject === project.name ? colors.rust : colors.overlay1,
                        transition: 'color 0.2s',
                      }}
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: hoveredProject === project.name ? colors.blue : colors.text,
                        fontFamily: "'JetBrains Mono', monospace",
                        transition: 'color 0.2s',
                      }}
                    >
                      {project.name}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.85rem',
                      color: colors.subtext0,
                      lineHeight: '1.5',
                    }}
                  >
                    {project.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: colors.lavender,
              marginTop: 0,
              marginBottom: '1.2rem',
            }}
          >
            联系方式
          </h3>
          <div
            style={{
              fontSize: '0.9rem',
              color: colors.subtext1,
              lineHeight: '2',
            }}
          >
            {/* Resume */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.8rem',
              }}
            >
              <span style={{ color: colors.subtext1 }}>简历</span>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setPdfHovered(true)}
                onMouseLeave={() => setPdfHovered(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: pdfHovered ? colors.rust : colors.overlay1,
                    transition: 'color 0.2s',
                  }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </a>
            </div>

            {/* Email */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.8rem',
              }}
            >
              <span style={{ color: colors.subtext1 }}>邮箱</span>
              <span
                style={{
                  color: colors.text,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                }}
              >
                {email}
              </span>
              <button
                onClick={copyEmail}
                onMouseEnter={() => setCopyHovered(true)}
                onMouseLeave={() => setCopyHovered(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                title="复制邮箱"
              >
                {emailCopied ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.green}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={copyHovered ? colors.blue : colors.overlay1}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'stroke 0.2s' }}
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>

            {/* Location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.8rem',
              }}
            >
              <span style={{ color: colors.rust }}>我想待在</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: colors.overlay1 }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>北京 · 成都</span>
            </div>

            {/* RSS Subscribe */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: colors.subtext1 }}>订阅</span>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: colors.text,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.rust;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text;
                }}
                title="RSS 订阅"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '4px' }}
                >
                  <path d="M4 11a9 9 0 0 1 9 9" />
                  <path d="M4 4a16 16 0 0 1 16 16" />
                  <circle cx="5" cy="19" r="1" />
                </svg>
                <span style={{ fontSize: '0.85rem' }}>RSS</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          borderTop: `1px solid ${colors.surface0}`,
          padding: '1.5rem 2rem',
          textAlign: 'center',
          color: colors.overlay0,
          fontSize: '0.85rem',
        }}
      >
        <p style={{ margin: 0 }}>© 2026 vision-rs</p>
      </div>
    </footer>
  );
}
