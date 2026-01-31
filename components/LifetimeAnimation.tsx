'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface LifetimeAnimationProps {
  code?: string;
}

export default function LifetimeAnimation({ code }: LifetimeAnimationProps) {
  const [hoveredScope, setHoveredScope] = useState<string | null>(null);

  const defaultCode = `fn main() {
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("{}", r);    //          |
}                         // ---------+`;

  const displayCode = code || defaultCode;

  return (
    <div className="my-8 p-6 bg-mantle rounded-lg border border-overlay0/30">
      <h3 className="text-lg font-semibold text-text mb-4">生命周期作用域可视化</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 代码显示 */}
        <div className="relative">
          <pre className="bg-crust p-4 rounded border border-overlay0/30 text-sm font-mono overflow-x-auto">
            <code className="text-subtext1">{displayCode}</code>
          </pre>

          {/* 生命周期标注 */}
          <motion.div
            className="absolute top-4 right-4 px-3 py-2 bg-surface0 rounded border border-blue/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-xs font-semibold text-blue mb-1">'a 生命周期</div>
            <div className="text-xs text-subtext0">整个函数作用域</div>
          </motion.div>

          <motion.div
            className="absolute top-20 right-4 px-3 py-2 bg-surface0 rounded border border-green/50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-xs font-semibold text-green mb-1">'b 生命周期</div>
            <div className="text-xs text-subtext0">内部块作用域</div>
          </motion.div>
        </div>

        {/* 时间线可视化 */}
        <div className="flex flex-col justify-center space-y-4">
          {/* 'a 生命周期 */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredScope('a')}
            onMouseLeave={() => setHoveredScope(null)}
          >
            <div className="text-sm font-semibold text-blue mb-2">生命周期 'a (变量 r)</div>
            <motion.div
              className="h-3 bg-blue/30 rounded-full relative overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-blue/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredScope === 'a' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: 'left' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs text-text">开始</span>
                <span className="text-xs text-text">结束</span>
              </div>
            </motion.div>
            <div className="mt-1 text-xs text-subtext0">
              从第 2 行到函数结束（第 9 行）
            </div>
          </div>

          {/* 'b 生命周期 */}
          <div
            className="relative pl-12"
            onMouseEnter={() => setHoveredScope('b')}
            onMouseLeave={() => setHoveredScope(null)}
          >
            <div className="text-sm font-semibold text-green mb-2">生命周期 'b (变量 x)</div>
            <motion.div
              className="h-3 bg-green/30 rounded-full relative overflow-hidden cursor-pointer w-2/3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-green/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredScope === 'b' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: 'left' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs text-text">开始</span>
                <span className="text-xs text-text">结束</span>
              </div>
            </motion.div>
            <div className="mt-1 text-xs text-subtext0">
              从第 5 行到第 7 行（块结束）
            </div>
          </div>

          {/* 悬垂引用警告 */}
          <motion.div
            className="p-4 bg-red/10 border border-red/30 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-start gap-2">
              <span className="text-red text-xl">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-red mb-1">编译错误！</div>
                <div className="text-xs text-subtext1">
                  变量 <code className="text-red">r</code> 引用了 <code className="text-green">x</code>，
                  但 <code className="text-green">x</code> 的生命周期 'b 比 <code className="text-red">r</code> 的生命周期 'a 短。
                  当执行到第 8 行时，<code className="text-green">x</code> 已被释放，
                  <code className="text-red">r</code> 变成了悬垂引用。
                </div>
              </div>
            </div>
          </motion.div>

          {/* 修复建议 */}
          <motion.div
            className="p-4 bg-teal/10 border border-teal/30 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-start gap-2">
              <span className="text-teal text-xl">💡</span>
              <div>
                <div className="text-sm font-semibold text-teal mb-1">解决方案</div>
                <div className="text-xs text-subtext1">
                  将 <code className="text-green">x</code> 的声明移到外层作用域，
                  确保其生命周期至少和 <code className="text-blue">r</code> 一样长。
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 交互提示 */}
      <div className="mt-4 text-xs text-subtext0 text-center">
        💡 悬停在时间线上查看生命周期范围
      </div>
    </div>
  );
}
