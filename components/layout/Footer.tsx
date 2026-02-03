'use client';

import Link from 'next/link';
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
    name: 'project-alpha',
    url: 'https://github.com/username/project-alpha',
    description: 'A high-performance data processing pipeline',
  },
  {
    name: 'ui-components',
    url: 'https://github.com/username/ui-components',
    description: 'Reusable React component library',
  },
  {
    name: 'cli-toolkit',
    url: 'https://github.com/username/cli-toolkit',
    description: 'Command-line utilities for developers',
  },
];

export default function Footer() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

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
            Visualizing Rust Concepts
          </p>
          <div
            style={{
              fontSize: '0.85rem',
              color: colors.overlay1,
              lineHeight: '1.8',
            }}
          >
            <p style={{ margin: '0.3rem 0' }}>
              Built with{' '}
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
              &{' '}
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
              </a>
            </p>
            <p style={{ margin: '0.3rem 0' }}>
              Styled with{' '}
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
              </a>
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
            Other Projects
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
                    background:
                      hoveredProject === project.name ? colors.surface0 : 'transparent',
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
            Get in Touch
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <a
              href="/resume.pdf"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.2rem',
                background: colors.surface0,
                color: colors.text,
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                border: `1px solid ${colors.surface1}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.rust;
                e.currentTarget.style.borderColor = colors.rust;
                e.currentTarget.style.color = colors.crust;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.surface0;
                e.currentTarget.style.borderColor = colors.surface1;
                e.currentTarget.style.color = colors.text;
                e.currentTarget.style.transform = 'translateY(0)';
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
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </a>
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              color: colors.subtext1,
              lineHeight: '1.8',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              }}
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
                style={{ color: colors.overlay1 }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Beijing · Chengdu</span>
            </div>
            <p
              style={{
                margin: '1rem 0 0 0',
                padding: '0.8rem',
                background: colors.surface0,
                borderRadius: '6px',
                borderLeft: `3px solid ${colors.green}`,
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              Open to Opportunities
            </p>
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
