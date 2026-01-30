'use client';
import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface InteractiveCodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
}

interface PlaygroundResponse {
  success: boolean;
  stdout: string;
  stderr: string;
}

export default function InteractiveCodeBlock({
  code,
  language = 'rust',
  showLineNumbers = true,
  fileName,
}: InteractiveCodeBlockProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const runCode = async () => {
    if (language !== 'rust') return;

    setIsRunning(true);
    setOutput('');

    try {
      const response = await fetch('https://play.rust-lang.org/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'stable',
          mode: 'debug',
          edition: '2021',
          crateType: 'bin',
          tests: false,
          code: code,
        }),
      });

      const data = (await response.json()) as PlaygroundResponse;
      setOutput(data.stdout || data.stderr || '运行成功，无输出');
    } catch (error) {
      setOutput(`运行失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="group relative my-8 rounded-xl overflow-hidden bg-mantle border border-surface0 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface0/30 backdrop-blur-sm border-b border-overlay0/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-subtext0">{fileName || language}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-subtext0 transition-colors hover:text-text"
          >
            {isExpanded ? '折叠' : '展开'}
          </button>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={copyCode}
            className="px-3 py-1 text-xs text-text bg-surface1 hover:bg-surface2 rounded transition-colors flex items-center gap-1"
            aria-label="复制代码"
          >
            {isCopied ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                已复制
              </>
            ) : (
              '复制'
            )}
          </button>

          {language === 'rust' && (
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-3 py-1 text-xs text-base bg-blue hover:bg-blue/80 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
              aria-label="运行代码"
            >
              {isRunning ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  运行中
                </>
              ) : (
                <>▶ 运行</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code */}
      {isExpanded && (
        <Highlight theme={themes.nightOwl} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-5 overflow-x-auto text-sm`}
              style={{
                ...style,
                background: 'transparent',
                margin: 0,
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 text-overlay2 select-none">
                      {i + 1}
                    </span>
                  )}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}

      {/* Output */}
      {output && (
        <div className="border-t border-overlay0/30 bg-surface0/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-subtext0">输出：</div>
            <button
              onClick={() => setOutput('')}
              className="text-xs text-subtext0 transition-colors hover:text-text"
              aria-label="清除输出"
            >
              清除
            </button>
          </div>
          <pre className="text-sm text-green font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
