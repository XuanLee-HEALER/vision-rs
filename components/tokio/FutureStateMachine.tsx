'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type FutureState = 'pending' | 'polling' | 'ready' | 'completed';

interface StateInfo {
  state: FutureState;
  description: string;
  color: string;
}

const stateInfoMap: Record<FutureState, StateInfo> = {
  pending: {
    state: 'pending',
    description: '任务创建，等待首次 poll',
    color: '#8087a2',
  },
  polling: {
    state: 'polling',
    description: '执行器正在轮询 Future',
    color: '#8aadf4',
  },
  ready: {
    state: 'ready',
    description: '资源就绪，可以继续执行',
    color: '#a6da95',
  },
  completed: {
    state: 'completed',
    description: 'Future 完成，返回结果',
    color: '#c6a0f6',
  },
};

export default function FutureStateMachine() {
  const [currentState, setCurrentState] = useState<FutureState>('pending');
  const [isAnimating, setIsAnimating] = useState(false);

  const states: FutureState[] = ['pending', 'polling', 'ready', 'completed'];

  const nextState = () => {
    const currentIndex = states.indexOf(currentState);
    if (currentIndex < states.length - 1) {
      setCurrentState(states[currentIndex + 1]);
    } else {
      setCurrentState('pending');
    }
  };

  const autoPlay = () => {
    setIsAnimating(true);
    let index = 0;
    const interval = setInterval(() => {
      setCurrentState(states[index]);
      index++;
      if (index >= states.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 1500);
  };

  const info = stateInfoMap[currentState];

  return (
    <div className="my-8 p-6 bg-mantle rounded-lg border border-overlay0/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">
          Future 状态机
        </h3>
        <div className="flex gap-2">
          <button
            onClick={nextState}
            disabled={isAnimating}
            className="px-3 py-1.5 bg-blue text-crust rounded hover:bg-lavender disabled:opacity-50 text-sm"
          >
            下一步 →
          </button>
          <button
            onClick={autoPlay}
            disabled={isAnimating}
            className="px-3 py-1.5 bg-surface0 text-text rounded hover:bg-surface1 disabled:opacity-50 text-sm"
          >
            {isAnimating ? '▶ 播放中...' : '▶ 自动播放'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 状态流转图 */}
        <div className="flex items-center justify-center gap-4">
          {states.map((state, index) => (
            <div key={state} className="flex items-center">
              <motion.div
                className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 ${
                  currentState === state
                    ? 'border-4 shadow-lg'
                    : 'border-2 opacity-40'
                }`}
                style={{
                  borderColor: stateInfoMap[state].color,
                  backgroundColor:
                    currentState === state
                      ? `${stateInfoMap[state].color}20`
                      : 'transparent',
                }}
                animate={{
                  scale: currentState === state ? 1.1 : 1,
                }}
                transition={{ type: 'spring' }}
              >
                <div
                  className="text-xs font-mono font-bold uppercase"
                  style={{ color: stateInfoMap[state].color }}
                >
                  {state}
                </div>
                <AnimatePresence>
                  {currentState === state && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {index < states.length - 1 && (
                <motion.div
                  className="w-12 h-0.5 mx-2"
                  style={{
                    backgroundColor:
                      states.indexOf(currentState) > index
                        ? stateInfoMap[states[index + 1]].color
                        : '#363a4f',
                  }}
                  animate={{
                    scaleX: states.indexOf(currentState) > index ? 1 : 0.5,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* 当前状态说明 */}
        <motion.div
          key={currentState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: `${info.color}10`,
            borderColor: `${info.color}40`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="text-2xl"
              style={{ color: info.color }}
            >
              {currentState === 'pending' && '⏳'}
              {currentState === 'polling' && '🔄'}
              {currentState === 'ready' && '✅'}
              {currentState === 'completed' && '🎉'}
            </div>
            <div>
              <div
                className="text-sm font-semibold mb-1"
                style={{ color: info.color }}
              >
                {info.state.toUpperCase()}
              </div>
              <div className="text-sm text-subtext1">{info.description}</div>
            </div>
          </div>
        </motion.div>

        {/* 代码示例 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-crust rounded border border-overlay0/30">
            <div className="text-xs font-semibold text-subtext1 mb-2">
              📝 代码示例
            </div>
            <pre className="text-xs text-green font-mono">
              {`async fn fetch_data() {
  let future = reqwest::get(url);

  // Poll 1: Pending
  // Poll 2: Pending
  // Poll 3: Ready!

  let data = future.await;
  data
}`}
            </pre>
          </div>

          <div className="p-4 bg-crust rounded border border-overlay0/30">
            <div className="text-xs font-semibold text-subtext1 mb-2">
              🔍 Poll 机制
            </div>
            <div className="text-xs text-subtext1 space-y-2">
              <div>
                <code className="text-blue">Poll::Pending</code>：资源未就绪，注册 Waker
              </div>
              <div>
                <code className="text-green">Poll::Ready(T)</code>：完成，返回结果
              </div>
              <div className="text-overlay1 italic mt-2">
                Waker 会在资源就绪时唤醒任务
              </div>
            </div>
          </div>
        </div>

        {/* 状态转换规则 */}
        <div className="p-4 bg-surface0/50 rounded-lg border border-overlay0/30">
          <div className="text-sm font-semibold text-text mb-3">
            ⚙️ 状态转换规则
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-overlay2">1. </span>
              <span className="text-subtext1">
                <strong className="text-text">Pending → Polling</strong>:
                执行器开始轮询 Future
              </span>
            </div>
            <div>
              <span className="text-overlay2">2. </span>
              <span className="text-subtext1">
                <strong className="text-text">Polling → Pending</strong>:
                返回 Poll::Pending，等待唤醒
              </span>
            </div>
            <div>
              <span className="text-overlay2">3. </span>
              <span className="text-subtext1">
                <strong className="text-text">Polling → Ready</strong>:
                资源就绪，准备完成
              </span>
            </div>
            <div>
              <span className="text-overlay2">4. </span>
              <span className="text-subtext1">
                <strong className="text-text">Ready → Completed</strong>:
                返回 Poll::Ready(T)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
