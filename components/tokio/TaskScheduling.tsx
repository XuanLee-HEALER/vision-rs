'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Task {
  id: string;
  name: string;
  priority: 'high' | 'normal' | 'low';
}

interface Worker {
  id: number;
  queue: Task[];
  isStealing: boolean;
}

const priorityColors = {
  high: '#ed8796',
  normal: '#8aadf4',
  low: '#a5adcb',
};

export default function TaskScheduling() {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 0,
      queue: [
        { id: 't1', name: 'HTTP', priority: 'high' },
        { id: 't2', name: 'DB', priority: 'normal' },
        { id: 't3', name: 'Log', priority: 'low' },
      ],
      isStealing: false,
    },
    {
      id: 1,
      queue: [{ id: 't4', name: 'Cache', priority: 'normal' }],
      isStealing: false,
    },
    { id: 2, queue: [], isStealing: false },
    { id: 3, queue: [], isStealing: false },
  ]);

  const [stealInfo, setStealInfo] = useState<{
    from: number;
    to: number;
    task: Task;
  } | null>(null);

  const simulateWorkStealing = () => {
    // 找到空闲的工作线程
    const idleWorker = workers.find((w) => w.queue.length === 0);
    // 找到最繁忙的工作线程
    const busiestWorker = workers.reduce((prev, curr) =>
      curr.queue.length > prev.queue.length ? curr : prev
    );

    if (idleWorker && busiestWorker.queue.length > 1) {
      // 从繁忙线程的队尾窃取任务
      const stolenTask = busiestWorker.queue[busiestWorker.queue.length - 1];
      setStealInfo({
        from: busiestWorker.id,
        to: idleWorker.id,
        task: stolenTask,
      });

      // 标记正在窃取
      setWorkers((prev) =>
        prev.map((w) => ({
          ...w,
          isStealing: w.id === idleWorker.id || w.id === busiestWorker.id,
        }))
      );

      setTimeout(() => {
        setWorkers((prev) =>
          prev.map((w) => {
            if (w.id === busiestWorker.id) {
              return {
                ...w,
                queue: w.queue.slice(0, -1),
                isStealing: false,
              };
            }
            if (w.id === idleWorker.id) {
              return { ...w, queue: [...w.queue, stolenTask], isStealing: false };
            }
            return w;
          })
        );
        setStealInfo(null);
      }, 1500);
    }
  };

  const executeTask = (workerId: number) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId && w.queue.length > 0) {
          return { ...w, queue: w.queue.slice(1) };
        }
        return w;
      })
    );
  };

  return (
    <div className="my-8 p-6 bg-mantle rounded-lg border border-overlay0/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">
          任务调度与工作窃取
        </h3>
        <div className="flex gap-2">
          <button
            onClick={simulateWorkStealing}
            className="px-4 py-2 bg-blue text-crust rounded hover:bg-lavender text-sm font-medium"
          >
            🔄 模拟工作窃取
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 工作线程 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {workers.map((worker) => (
            <motion.div
              key={worker.id}
              className={`p-4 rounded-lg border ${
                worker.isStealing
                  ? 'bg-yellow/10 border-yellow/50'
                  : worker.queue.length === 0
                  ? 'bg-surface0/30 border-overlay0/30'
                  : 'bg-surface0 border-overlay0'
              }`}
              animate={{
                scale: worker.isStealing ? 1.05 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-subtext1">
                  Worker {worker.id}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-blue/20 text-blue">
                  {worker.queue.length} 任务
                </span>
              </div>

              {/* 任务队列 */}
              <div className="space-y-2 min-h-[100px]">
                <AnimatePresence>
                  {worker.queue.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="relative p-2 rounded border"
                      style={{
                        backgroundColor: `${priorityColors[task.priority]}15`,
                        borderColor: `${priorityColors[task.priority]}40`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className="text-xs font-mono font-semibold"
                            style={{ color: priorityColors[task.priority] }}
                          >
                            {task.name}
                          </div>
                          <div className="text-xs text-subtext0">
                            {task.priority}
                          </div>
                        </div>
                        {index === 0 && (
                          <button
                            onClick={() => executeTask(worker.id)}
                            className="text-xs px-2 py-1 bg-green/20 text-green rounded hover:bg-green/30"
                          >
                            执行
                          </button>
                        )}
                      </div>

                      {/* 队首标记 */}
                      {index === 0 && (
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-green rounded-full" />
                      )}

                      {/* 队尾标记 */}
                      {index === worker.queue.length - 1 && (
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red rounded-full" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {worker.queue.length === 0 && (
                  <div className="flex items-center justify-center h-full text-xs text-overlay1 italic">
                    空闲
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 窃取动画 */}
        <AnimatePresence>
          {stealInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-yellow/10 border border-yellow/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-yellow mb-1">
                    工作窃取进行中
                  </div>
                  <div className="text-xs text-subtext1">
                    Worker {stealInfo.to} 正在从 Worker {stealInfo.from} 窃取任务{' '}
                    <code className="text-blue">{stealInfo.task.name}</code>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-yellow text-xl"
                >
                  ⚡
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 说明 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface0/50 rounded-lg border border-overlay0/30">
            <div className="text-sm font-semibold text-text mb-3">
              🎯 工作窃取策略
            </div>
            <div className="text-xs text-subtext1 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-blue">•</span>
                <span>
                  <strong className="text-text">队首执行</strong>：线程从自己队列的
                  <strong className="text-green">队首</strong>取任务
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue">•</span>
                <span>
                  <strong className="text-text">队尾窃取</strong>：空闲线程从其他线程
                  <strong className="text-red">队尾</strong>窃取任务
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue">•</span>
                <span>
                  <strong className="text-text">减少竞争</strong>：两端操作，降低锁竞争
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface0/50 rounded-lg border border-overlay0/30">
            <div className="text-sm font-semibold text-text mb-3">
              ⚡ 性能优势
            </div>
            <div className="text-xs text-subtext1 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green">✓</span>
                <span>
                  <strong className="text-text">负载均衡</strong>：自动平衡各线程负载
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green">✓</span>
                <span>
                  <strong className="text-text">缓存友好</strong>：优先执行本地任务
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green">✓</span>
                <span>
                  <strong className="text-text">低竞争</strong>：双端队列减少锁开销
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 算法伪代码 */}
        <div className="p-4 bg-crust rounded-lg border border-overlay0/30">
          <div className="text-xs font-semibold text-subtext1 mb-3">
            📝 算法伪代码
          </div>
          <pre className="text-xs text-green font-mono leading-relaxed">
            {`loop {
    // 1. 尝试从本地队列头部取任务
    if let Some(task) = local_queue.pop_front() {
        task.run();
        continue;
    }

    // 2. 尝试从全局队列取任务
    if let Some(task) = global_queue.pop() {
        task.run();
        continue;
    }

    // 3. 尝试从其他线程队列尾部窃取
    for other_worker in workers {
        if let Some(task) = other_worker.steal_from_back() {
            task.run();
            continue;
        }
    }

    // 4. 没有任务，进入休眠
    park();
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
