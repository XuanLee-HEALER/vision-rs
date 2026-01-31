'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type BorrowType = 'none' | 'immutable' | 'mutable';

interface BorrowState {
  line: number;
  code: string;
  borrowType: BorrowType;
  borrowers: string[];
  isValid: boolean;
  explanation: string;
}

const borrowScenarios: BorrowState[] = [
  {
    line: 1,
    code: 'let mut s = String::from("hello");',
    borrowType: 'none',
    borrowers: [],
    isValid: true,
    explanation: '创建可变变量 s，当前无借用',
  },
  {
    line: 2,
    code: 'let r1 = &s;',
    borrowType: 'immutable',
    borrowers: ['r1'],
    isValid: true,
    explanation: '创建不可变引用 r1，可以有多个不可变引用',
  },
  {
    line: 3,
    code: 'let r2 = &s;',
    borrowType: 'immutable',
    borrowers: ['r1', 'r2'],
    isValid: true,
    explanation: '创建另一个不可变引用 r2，允许多个不可变借用同时存在',
  },
  {
    line: 4,
    code: 'let r3 = &mut s; // ❌ 错误',
    borrowType: 'mutable',
    borrowers: ['r1', 'r2', 'r3'],
    isValid: false,
    explanation: '尝试创建可变引用，但已存在不可变引用！违反借用规则',
  },
];

export default function BorrowChecker() {
  const [currentStep, setCurrentStep] = useState(0);
  const state = borrowScenarios[currentStep];

  return (
    <div className="my-8 p-6 bg-mantle rounded-lg border border-overlay0/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">借用检查器可视化</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1 bg-surface0 text-text rounded hover:bg-surface1 disabled:opacity-50"
          >
            ← 上一步
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(borrowScenarios.length - 1, currentStep + 1))}
            disabled={currentStep === borrowScenarios.length - 1}
            className="px-3 py-1 bg-surface0 text-text rounded hover:bg-surface1 disabled:opacity-50"
          >
            下一步 →
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 左侧：代码 */}
        <div className="space-y-4">
          <div className="p-4 bg-crust rounded border border-overlay0/30">
            {borrowScenarios.map((scenario, idx) => (
              <div
                key={idx}
                className={`font-mono text-sm mb-2 transition-all ${
                  idx === currentStep
                    ? 'text-text font-semibold'
                    : idx < currentStep
                      ? 'text-subtext1'
                      : 'text-overlay0'
                }`}
              >
                <span className="text-overlay1 mr-2">{scenario.line}</span>
                {scenario.code}
              </div>
            ))}
          </div>

          {/* 说明 */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded border ${
              state.isValid ? 'bg-teal/10 border-teal/30' : 'bg-red/10 border-red/30'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{state.isValid ? '✅' : '❌'}</span>
              <div>
                <div
                  className={`text-sm font-semibold mb-1 ${
                    state.isValid ? 'text-teal' : 'text-red'
                  }`}
                >
                  {state.isValid ? '合法借用' : '借用冲突！'}
                </div>
                <div className="text-xs text-subtext1">{state.explanation}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 右侧：可视化 */}
        <div className="space-y-6">
          {/* 原始数据 */}
          <div className="flex flex-col items-center">
            <motion.div
              className="relative w-32 h-32 rounded-lg bg-blue/20 border-2 border-blue flex items-center justify-center"
              animate={{
                borderColor: state.isValid ? '#8aadf4' : '#ed8796',
                backgroundColor: state.isValid
                  ? 'rgba(138, 173, 244, 0.2)'
                  : 'rgba(237, 135, 150, 0.2)',
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-text">s</div>
                <div className="text-xs text-subtext0 mt-1">
                  {state.borrowType === 'none'
                    ? '无借用'
                    : state.borrowType === 'immutable'
                      ? '不可变借用中'
                      : '可变借用中'}
                </div>
              </div>

              {/* 锁图标 */}
              <AnimatePresence>
                {state.borrowType !== 'none' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface0 border-2 border-blue flex items-center justify-center"
                  >
                    {state.borrowType === 'immutable' ? '🔒' : '🔐'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* 借用者列表 */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-subtext1">当前借用者：</div>
            <AnimatePresence mode="popLayout">
              {state.borrowers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-overlay1 italic"
                >
                  无
                </motion.div>
              ) : (
                state.borrowers.map((borrower, idx) => {
                  const isConflict = !state.isValid && idx === state.borrowers.length - 1;
                  return (
                    <motion.div
                      key={borrower}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: isConflict ? [1, 1.05, 1] : 1,
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        delay: idx * 0.1,
                        scale: { repeat: isConflict ? Infinity : 0, duration: 0.8 },
                      }}
                      className={`flex items-center gap-3 p-3 rounded border ${
                        isConflict ? 'bg-red/10 border-red/30' : 'bg-surface0 border-overlay0/30'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold ${
                          isConflict ? 'bg-red/20 text-red' : 'bg-blue/20 text-blue'
                        }`}
                      >
                        {borrower}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text">{borrower}</div>
                        <div className="text-xs text-subtext0">
                          {borrower === 'r3' ? '&mut（可变引用）' : '&（不可变引用）'}
                        </div>
                      </div>
                      {isConflict && <span className="text-red">⚠️</span>}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* 借用规则提示 */}
          <div className="p-4 bg-surface0/50 rounded border border-overlay0/30">
            <div className="text-xs font-semibold text-text mb-2">借用规则</div>
            <ul className="text-xs text-subtext1 space-y-1">
              <li className={currentStep >= 2 ? 'text-teal' : ''}>
                ✓ 可以有<strong>多个</strong>不可变引用（&T）
              </li>
              <li className={currentStep === 3 ? 'text-red' : ''}>
                ✗ 不可变引用存在时，不能有可变引用（&mut T）
              </li>
              <li>
                ✓ 只能有<strong>一个</strong>可变引用，且无其他引用
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
