import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LearnLayout from '@/components/LearnLayout';
import RuntimeVisualization from '@/components/tokio/RuntimeVisualization';
export const metadata = {
  title: 'Tokio Runtime 架构',
  description: 'Tokio 运行时内部实现详解',
};
function _createMdxContent(props) {
  const _components = {
    a: 'a',
    code: 'code',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    li: 'li',
    ol: 'ol',
    p: 'p',
    pre: 'pre',
    strong: 'strong',
    ul: 'ul',
    ...props.components,
  };
  return _jsxs(LearnLayout, {
    children: [
      _jsx(_components.h1, {
        id: 'runtime-架构',
        children: _jsx(_components.a, {
          href: '#runtime-架构',
          children: 'Runtime 架构',
        }),
      }),
      _jsx(_components.p, {
        children: 'Tokio Runtime 是任务执行的核心，负责调度和执行异步任务。',
      }),
      _jsx(_components.h2, {
        id: 'runtime-类型',
        children: _jsx(_components.a, {
          href: '#runtime-类型',
          children: 'Runtime 类型',
        }),
      }),
      _jsx(_components.h3, {
        id: '多线程-runtime',
        children: _jsx(_components.a, {
          href: '#多线程-runtime',
          children: '多线程 Runtime',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'let rt = tokio::runtime::Builder::new_multi_thread()\n    .worker_threads(4)  // Worker 线程数\n    .thread_name("my-tokio")\n    .enable_all()\n    .build()\n    .unwrap();\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '当前线程-runtime',
        children: _jsx(_components.a, {
          href: '#当前线程-runtime',
          children: '当前线程 Runtime',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'let rt = tokio::runtime::Builder::new_current_thread()\n    .enable_all()\n    .build()\n    .unwrap();\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '工作窃取调度器',
        children: _jsx(_components.a, {
          href: '#工作窃取调度器',
          children: '工作窃取调度器',
        }),
      }),
      _jsx(RuntimeVisualization, {}),
      _jsx(_components.h3, {
        id: '队列层级',
        children: _jsx(_components.a, {
          href: '#队列层级',
          children: '队列层级',
        }),
      }),
      _jsxs(_components.ol, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '本地队列',
              }),
              '：每个线程独享，LIFO',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '全局队列',
              }),
              '：所有线程共享，FIFO',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '窃取',
              }),
              '：从其他线程队尾窃取',
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.h3, {
        id: '调度策略',
        children: _jsx(_components.a, {
          href: '#调度策略',
          children: '调度策略',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            '// 1. 优先本地队列\nif let Some(task) = local_queue.pop() {\n    task.run();\n}\n// 2. 检查全局队列\nelse if let Some(task) = global_queue.pop() {\n    task.run();\n}\n// 3. 窃取其他线程任务\nelse {\n    for other in workers {\n        if let Some(task) = other.steal() {\n            task.run();\n            break;\n        }\n    }\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '配置选项',
        children: _jsx(_components.a, {
          href: '#配置选项',
          children: '配置选项',
        }),
      }),
      _jsx(_components.h3, {
        id: '线程池大小',
        children: _jsx(_components.a, {
          href: '#线程池大小',
          children: '线程池大小',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            '// 默认：CPU 核心数\nRuntime::new()  // 使用所有核心\n\n// 自定义\nBuilder::new_multi_thread()\n    .worker_threads(8)\n    .build()\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '线程命名',
        children: _jsx(_components.a, {
          href: '#线程命名',
          children: '线程命名',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'Builder::new_multi_thread()\n    .thread_name_fn(|| {\n        static ATOMIC_ID: AtomicUsize = AtomicUsize::new(0);\n        let id = ATOMIC_ID.fetch_add(1, Ordering::SeqCst);\n        format!("my-pool-{}", id)\n    })\n    .build()\n',
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
            children: '✅ 多线程 Runtime 使用工作窃取算法',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 单线程 Runtime 适合嵌入式场景',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 支持自定义配置',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 自动负载均衡',
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
