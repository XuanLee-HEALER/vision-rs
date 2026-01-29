'use client';
import { useState } from 'react';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-crust/95 backdrop-blur-xl border border-overlay0 rounded-2xl shadow-2xl z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-overlay0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-mauve flex items-center justify-center text-sm font-bold">
                AI
              </div>
              <div>
                <div className="text-sm font-bold text-text">Rust 助手</div>
                <div className="text-xs text-subtext0">随时为你解答</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-surface0 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-sm text-subtext1 text-center mt-12">
              <div className="mb-4 text-4xl">🤖</div>
              <p className="mb-2">AI 助手功能即将上线</p>
              <p className="text-xs text-subtext0">将集成智能问答，帮助你更好地学习 Rust</p>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-overlay0">
            <div className="flex items-center gap-2 bg-surface0 rounded-lg p-2">
              <input
                type="text"
                placeholder="输入你的问题..."
                className="flex-1 bg-transparent text-sm text-text outline-none placeholder-subtext0"
                disabled
              />
              <button
                className="p-2 bg-blue hover:bg-blue/80 rounded-lg transition-colors disabled:opacity-50"
                disabled
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue to-mauve rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
      >
        <div className="relative">
          <svg
            className={`w-6 h-6 text-base transition-transform duration-300 ${
              isOpen ? 'rotate-180 opacity-0' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <svg
            className={`w-6 h-6 text-base absolute inset-0 transition-transform duration-300 ${
              isOpen ? '' : '-rotate-180 opacity-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue animate-ping opacity-20" />
        )}
      </button>
    </>
  );
}
