'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import MermaidDiagram from '../MermaidDiagram';

type EventType = 'read' | 'write' | 'timer' | 'signal';

interface IOEvent {
  id: string;
  type: EventType;
  fd: number;
  status: 'waiting' | 'ready' | 'dispatched';
}

const eventColors: Record<EventType, string> = {
  read: '#8aadf4',
  write: '#a6da95',
  timer: '#eed49f',
  signal: '#f5a97f',
};

const eventIcons: Record<EventType, string> = {
  read: '📖',
  write: '✍️',
  timer: '⏰',
  signal: '📡',
};

export default function ReactorPattern() {
  const [events, setEvents] = useState<IOEvent[]>([
    { id: 'e1', type: 'read', fd: 3, status: 'waiting' },
    { id: 'e2', type: 'write', fd: 4, status: 'waiting' },
    { id: 'e3', type: 'timer', fd: -1, status: 'waiting' },
  ]);

  const [dispatchedEvent, setDispatchedEvent] = useState<IOEvent | null>(null);

  const simulateEventReady = () => {
    const waitingEvents = events.filter((e) => e.status === 'waiting');
    if (waitingEvents.length === 0) return;

    const event = waitingEvents[0];
    setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, status: 'ready' } : e)));

    setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, status: 'dispatched' } : e))
      );
      setDispatchedEvent(event);

      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
        setDispatchedEvent(null);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="my-8 space-y-6">
      <div className="p-6 bg-mantle rounded-lg border border-overlay0/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text">Reactor 模式</h3>
          <button
            onClick={simulateEventReady}
            className="px-4 py-2 bg-blue text-crust rounded hover:bg-lavender text-sm font-medium"
          >
            模拟事件就绪 ⚡
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Event Queue */}
          <div className="p-4 bg-crust rounded-lg border border-overlay0/30">
            <div className="text-sm font-semibold text-subtext1 mb-3">📬 事件队列</div>
            <div className="space-y-2">
              <AnimatePresence>
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded border ${
                      event.status === 'ready'
                        ? 'bg-green/20 border-green'
                        : 'bg-surface0 border-overlay0'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{eventIcons[event.type]}</span>
                      <div className="flex-1">
                        <div
                          className="text-xs font-mono font-semibold"
                          style={{ color: eventColors[event.type] }}
                        >
                          {event.type.toUpperCase()}
                        </div>
                        {event.fd >= 0 && (
                          <div className="text-xs text-subtext0">FD: {event.fd}</div>
                        )}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          event.status === 'ready'
                            ? 'bg-green text-crust'
                            : event.status === 'dispatched'
                              ? 'bg-blue text-crust'
                              : 'bg-overlay0 text-text'
                        }`}
                      >
                        {event.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && (
                <div className="text-xs text-overlay1 italic text-center py-6">队列为空</div>
              )}
            </div>
          </div>

          {/* Reactor Core */}
          <div className="p-4 bg-crust rounded-lg border border-blue/30">
            <div className="text-sm font-semibold text-blue mb-3">⚙️ Reactor 核心</div>
            <div className="space-y-3">
              <div className="p-3 bg-surface0 rounded border border-overlay0">
                <div className="text-xs font-semibold text-text mb-2">Event Loop</div>
                <div className="text-xs text-subtext1">持续监听 I/O 事件，使用 epoll/kqueue</div>
              </div>

              <motion.div
                className="p-3 bg-blue/10 rounded border border-blue/30"
                animate={{
                  scale: dispatchedEvent ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-xs font-semibold text-blue mb-2">Dispatcher</div>
                <div className="text-xs text-subtext1">
                  {dispatchedEvent ? `正在分发 ${dispatchedEvent.type} 事件` : '等待事件...'}
                </div>
              </motion.div>

              <div className="p-3 bg-surface0 rounded border border-overlay0">
                <div className="text-xs font-semibold text-text mb-2">Waker Registry</div>
                <div className="text-xs text-subtext1">管理所有等待唤醒的任务</div>
              </div>
            </div>
          </div>

          {/* Handler */}
          <div className="p-4 bg-crust rounded-lg border border-overlay0/30">
            <div className="text-sm font-semibold text-subtext1 mb-3">🎯 事件处理器</div>
            <div className="space-y-2">
              {dispatchedEvent && (
                <motion.div
                  key={dispatchedEvent.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded border"
                  style={{
                    backgroundColor: `${eventColors[dispatchedEvent.type]}20`,
                    borderColor: eventColors[dispatchedEvent.type],
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{eventIcons[dispatchedEvent.type]}</span>
                    <div
                      className="text-xs font-mono font-semibold"
                      style={{ color: eventColors[dispatchedEvent.type] }}
                    >
                      处理中...
                    </div>
                  </div>
                  <div className="text-xs text-subtext1">唤醒相关的 Future 任务</div>
                </motion.div>
              )}
              {!dispatchedEvent && (
                <div className="text-xs text-overlay1 italic text-center py-6">等待事件分发</div>
              )}
            </div>
          </div>
        </div>

        {/* 流程说明 */}
        <div className="mt-6 p-4 bg-surface0/50 rounded-lg border border-overlay0/30">
          <div className="text-sm font-semibold text-text mb-3">🔄 Reactor 工作流程</div>
          <div className="grid md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-blue font-bold">1</span>
              <span className="text-subtext1">注册 I/O 事件到 Reactor</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue font-bold">2</span>
              <span className="text-subtext1">Event Loop 阻塞等待事件</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue font-bold">3</span>
              <span className="text-subtext1">事件就绪，Dispatcher 分发</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue font-bold">4</span>
              <span className="text-subtext1">Handler 处理并唤醒 Future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mermaid 架构图 */}
      <MermaidDiagram
        chart={`
graph TB
    A[应用程序] -->|注册事件| B[Reactor]
    B -->|监听| C[操作系统<br/>epoll/kqueue]
    C -->|事件就绪| D[Event Loop]
    D -->|分发| E[Dispatcher]
    E -->|唤醒| F[Waker]
    F -->|通知| G[Executor]
    G -->|Poll| H[Future 任务]
    H -->|完成| I[返回结果]

    style B fill:#8aadf4,stroke:#8aadf4,color:#24273a
    style D fill:#a6da95,stroke:#a6da95,color:#24273a
    style G fill:#c6a0f6,stroke:#c6a0f6,color:#24273a
        `}
      />
    </div>
  );
}
