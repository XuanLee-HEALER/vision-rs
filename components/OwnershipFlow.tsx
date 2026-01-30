'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface OwnershipFlowProps {
  autoPlay?: boolean;
}

type Step = {
  id: number;
  title: string;
  code: string;
  owner: string | null;
  moved: boolean;
  description: string;
};

const steps: Step[] = [
  {
    id: 0,
    title: '初始状态',
    code: 'let s1 = String::from("hello");',
    owner: 's1',
    moved: false,
    description: 's1 拥有字符串的所有权',
  },
  {
    id: 1,
    title: '所有权转移',
    code: 'let s2 = s1;',
    owner: 's2',
    moved: true,
    description: '所有权从 s1 移动到 s2，s1 失效',
  },
  {
    id: 2,
    title: '继续使用 s2',
    code: 'println!("{}", s2);',
    owner: 's2',
    moved: true,
    description: 's2 是当前所有者，可以正常使用',
  },
];

export default function OwnershipFlow({ autoPlay = false }: OwnershipFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const step = steps[currentStep];

  return (
    <div className="my-8 p-6 bg-mantle rounded-lg border border-overlay0/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">所有权转移动画</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1 bg-surface0 text-text rounded hover:bg-surface1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 上一步
          </button>
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (currentStep >= steps.length - 1) {
                setCurrentStep(0);
              }
            }}
            className="px-3 py-1 bg-blue text-crust rounded hover:bg-lavender"
          >
            {isPlaying ? '⏸ 暂停' : '▶ 播放'}
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1 bg-surface0 text-text rounded hover:bg-surface1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一步 →
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 步骤指示器 */}
        <div className="flex gap-2">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className={`flex-1 h-2 rounded-full transition-all ${
                idx <= currentStep ? 'bg-blue' : 'bg-surface0'
              }`}
            />
          ))}
        </div>

        {/* 代码显示 */}
        <div className="p-4 bg-crust rounded border border-overlay0/30">
          <code className="text-sm text-green font-mono">{step.code}</code>
        </div>

        {/* 可视化 */}
        <div className="relative h-48 flex items-center justify-center gap-12">
          {/* s1 变量 */}
          <motion.div
            className={`flex flex-col items-center ${step.moved ? 'opacity-50' : ''}`}
            initial={false}
            animate={{
              scale: step.owner === 's1' ? 1.1 : 1,
              opacity: step.moved ? 0.3 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`w-20 h-20 rounded-lg flex items-center justify-center font-mono font-bold ${
                step.moved
                  ? 'bg-surface0 text-overlay0 border-2 border-dashed border-overlay0'
                  : 'bg-blue text-crust border-2 border-blue'
              }`}
            >
              s1
            </div>
            <span className="mt-2 text-sm text-subtext0">
              {step.moved ? '已失效' : '拥有'}
            </span>
          </motion.div>

          {/* 箭头动画 */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="h-0.5 bg-blue relative"
                >
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blue" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* s2 变量 */}
          <motion.div
            className="flex flex-col items-center"
            initial={false}
            animate={{
              scale: step.owner === 's2' ? 1.1 : 1,
              opacity: currentStep >= 1 ? 1 : 0.3,
            }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`w-20 h-20 rounded-lg flex items-center justify-center font-mono font-bold ${
                step.owner === 's2'
                  ? 'bg-blue text-crust border-2 border-blue'
                  : 'bg-surface0 text-overlay0 border-2 border-dashed border-overlay0'
              }`}
            >
              s2
            </div>
            <span className="mt-2 text-sm text-subtext0">
              {step.owner === 's2' ? '拥有' : '待分配'}
            </span>
          </motion.div>

          {/* 堆内存 */}
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="px-6 py-3 bg-surface0 rounded-lg border border-overlay0">
              <div className="text-xs text-subtext0 mb-1">堆内存</div>
              <code className="text-sm text-peach font-mono">"hello"</code>
            </div>
          </motion.div>
        </div>

        {/* 说明文字 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-surface0/50 rounded border border-overlay0/30"
        >
          <h4 className="text-sm font-semibold text-text mb-2">{step.title}</h4>
          <p className="text-sm text-subtext1">{step.description}</p>
        </motion.div>
      </div>
    </div>
  );
}
