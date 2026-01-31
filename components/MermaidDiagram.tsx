'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'strict',
      themeVariables: {
        primaryColor: '#8aadf4',
        primaryTextColor: '#cad3f5',
        primaryBorderColor: '#8aadf4',
        lineColor: '#8087a2',
        secondaryColor: '#b7bdf8',
        tertiaryColor: '#c6a0f6',
        background: '#24273a',
        mainBkg: '#1e2030',
        secondBkg: '#363a4f',
        textColor: '#cad3f5',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      },
      flowchart: {
        curve: 'basis',
        padding: 20,
      },
      sequence: {
        actorMargin: 50,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
      },
    });

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    renderDiagram();
  }, [chart, isClient]);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center p-8 bg-mantle rounded-lg ${className}`}>
        <div className="text-subtext0">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container overflow-x-auto p-6 bg-mantle rounded-lg border border-overlay0/30 my-8 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
