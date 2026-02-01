import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LearnLayout from '@/components/LearnLayout';
import TaskScheduling from '@/components/tokio/TaskScheduling';
export const metadata = {
  title: 'Tokio 任务调度',
  description: '工作窃取算法详解',
};
function _createMdxContent(props) {
  const _components = {
    a: 'a',
    code: 'code',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    li: 'li',
    p: 'p',
    pre: 'pre',
    strong: 'strong',
    ul: 'ul',
    ...props.components,
  };
  return _jsxs(LearnLayout, {
    children: [
      _jsx(_components.h1, {
        id: '任务调度',
        children: _jsx(_components.a, {
          href: '#任务调度',
          children: '任务调度',
        }),
      }),
      _jsx(_components.p, {
        children: 'Tokio 使用工作窃取算法实现高效的任务调度。',
      }),
      _jsx(_components.h2, {
        id: '工作窃取算法',
        children: _jsx(_components.a, {
          href: '#工作窃取算法',
          children: '工作窃取算法',
        }),
      }),
      _jsx(TaskScheduling, {}),
      _jsx(_components.h3, {
        id: '原理',
        children: _jsx(_components.a, {
          href: '#原理',
          children: '原理',
        }),
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '本地优先',
              }),
              '：线程优先执行自己的任务',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '队尾窃取',
              }),
              '：空闲线程从繁忙线程队尾窃取',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '减少竞争',
              }),
              '：双端队列，两端操作',
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.h3, {
        id: '优势',
        children: _jsx(_components.a, {
          href: '#优势',
          children: '优势',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '✓ ',
          _jsx(_components.strong, {
            children: '负载均衡',
          }),
          '：自动平衡各线程任务✓ ',
          _jsx(_components.strong, {
            children: '缓存友好',
          }),
          '：优先本地任务✓\n',
          _jsx(_components.strong, {
            children: '低开销',
          }),
          '：减少锁竞争',
        ],
      }),
      _jsx(_components.h2, {
        id: 'spawn-vs-spawn_blocking',
        children: _jsx(_components.a, {
          href: '#spawn-vs-spawn_blocking',
          children: 'spawn vs spawn_blocking',
        }),
      }),
      _jsx(_components.h3, {
        id: 'spawn-异步任务',
        children: _jsx(_components.a, {
          href: '#spawn-异步任务',
          children: 'spawn (异步任务)',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'tokio::spawn(async {\n    // 异步操作，不阻塞线程\n    let data = fetch_from_network().await;\n    println!("Data: {}", data);\n});\n',
        }),
      }),
      _jsx(_components.h3, {
        id: 'spawn_blocking-阻塞任务',
        children: _jsx(_components.a, {
          href: '#spawn_blocking-阻塞任务',
          children: 'spawn_blocking (阻塞任务)',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'tokio::task::spawn_blocking(|| {\n    // CPU 密集或阻塞操作\n    expensive_computation()\n});\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '区别',
          }),
          '：',
        ],
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.code, {
                children: 'spawn',
              }),
              '：运行在 Worker 线程，不应阻塞',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.code, {
                children: 'spawn_blocking',
              }),
              '：运行在独立线程池，可以阻塞',
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.h2, {
        id: 'task优先级',
        children: _jsx(_components.a, {
          href: '#task优先级',
          children: 'Task优先级',
        }),
      }),
      _jsx(_components.p, {
        children: 'Tokio 使用 LIFO 策略处理本地任务：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            '// 新任务被添加到队列头部\ntokio::spawn(async { /* Task 1 */ });\ntokio::spawn(async { /* Task 2 */ });  // 会先执行\n',
        }),
      }),
      _jsx(_components.h2, {
        id: 'yield',
        children: _jsx(_components.a, {
          href: '#yield',
          children: 'Yield',
        }),
      }),
      _jsx(_components.p, {
        children: '主动让出 CPU：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'async fn cooperative_task() {\n    for i in 0..1000 {\n        // 执行工作\n        do_work(i);\n\n        // 每 100 次迭代让出一次\n        if i % 100 == 0 {\n            tokio::task::yield_now().await;\n        }\n    }\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '小结',
        children: _jsx(_components.a, {
          href: '#小结',
          children: '小结',
        }),
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsx(_components.li, {
            children: '✅ 工作窃取实现负载均衡',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 区分异步和阻塞任务',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 高效利用多核 CPU',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 支持主动让出 CPU',
          }),
          '\n',
        ],
      }),
    ],
  });
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout
    ? _jsx(MDXLayout, {
        ...props,
        children: _jsx(_createMdxContent, {
          ...props,
        }),
      })
    : _createMdxContent(props);
}
