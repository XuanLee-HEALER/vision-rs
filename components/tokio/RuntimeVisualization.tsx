'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Thread {
  id: number;
  tasks: Task[];
  isIdle: boolean;
}

interface Task {
  id: string;
  name: string;
  duration: number;
}

export default function RuntimeVisualization() {
  const [threads, setThreads] = useState<Thread[]>([
    { id: 0, tasks: [{ id: 't1', name: 'HTTP Request', duration: 3 }], isIdle: false },
    { id: 1, tasks: [{ id: 't2', name: 'DB Query', duration: 2 }], isIdle: false },
    { id: 2, tasks: [], isIdle: true },
    { id: 3, tasks: [], isIdle: true },
  ]);

  const [globalQueue] = useState<Task[]>([
    { id: 't3', name: 'File I/O', duration: 1 },
    { id: 't4', name: 'Network', duration: 2 },
  ]);

  return (
    <div className="my-8 p-6 bg-mantle rounded-lg border border-overlay0/30">
      <h3 className="text-lg font-semibold text-text mb-4">
        Tokio Runtime 架构可视化
      </h3>

      <div className="space-y-6">
        {/* 全局队列 */}
        <div className="p-4 bg-crust rounded-lg border border-overlay0/30">
          <div className="text-sm font-semibold text-subtext1 mb-3">
            📦 全局任务队列（Global Queue）
          </div>
          <div className="flex gap-2">
            {globalQueue.map((task) => (
              <motion.div
                key={task.id}
                className="px-3 py-2 bg-blue/20 border border-blue rounded text-xs font-mono text-blue"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {task.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 工作线程 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {threads.map((thread) => (
            <motion.div
              key={thread.id}
              className={`p-4 rounded-lg border ${
                thread.isIdle
                  ? 'bg-surface0/30 border-overlay0/30'
                  : 'bg-surface0 border-green/30'
              }`}
              animate={{
                borderColor: thread.isIdle ? '#6e738d' : '#a6da95',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-subtext1">
                  线程 {thread.id}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    thread.isIdle
                      ? 'bg-overlay0/30 text-overlay1'
                      : 'bg-green/20 text-green'
                  }`}
                >
                  {thread.isIdle ? '空闲' : '运行中'}
                </span>
              </div>

              {/* 本地队列 */}
              <div className="space-y-2">
                {thread.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className="px-2 py-2 bg-green/10 border border-green/30 rounded text-xs"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <div className="font-mono text-green truncate">
                      {task.name}
                    </div>
                    <div className="text-subtext0 text-xs mt-1">
                      {task.duration}s
                    </div>
                  </motion.div>
                ))}
                {thread.tasks.length === 0 && (
                  <div className="text-xs text-overlay1 italic text-center py-4">
                    本地队列为空
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 工作窃取演示 */}
        <div className="p-4 bg-surface0/50 rounded-lg border border-overlay0/30">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-sm font-semibold text-text mb-1">
                工作窃取（Work Stealing）
              </div>
              <div className="text-xs text-subtext1">
                当线程 2 和 3 空闲时，它们会从线程 0 和 1 的本地队列中
                <strong className="text-blue">窃取</strong>
                任务来执行，实现负载均衡。
              </div>
            </div>
          </div>
        </div>

        {/* 架构说明 */}
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-blue/10 border border-blue/30 rounded">
            <div className="font-semibold text-blue mb-1">🎯 多线程运行时</div>
            <div className="text-subtext1">
              Tokio 默认创建与 CPU 核心数相同的工作线程，每个线程有独立的本地队列。
            </div>
          </div>
          <div className="p-3 bg-green/10 border border-green/30 rounded">
            <div className="font-semibold text-green mb-1">⚖️ 负载均衡</div>
            <div className="text-subtext1">
              通过工作窃取算法，确保所有线程都有任务执行，避免某些线程空闲。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
