import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LearnLayout from '@/components/LearnLayout';
import RuntimeVisualization from '@/components/tokio/RuntimeVisualization';
import FutureStateMachine from '@/components/tokio/FutureStateMachine';
export const metadata = {
  title: 'Tokio - 异步运行时深度解析',
  description: 'Tokio 运行时架构与核心概念',
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
        id: 'tokio---rust-异步运行时',
        children: _jsx(_components.a, {
          href: '#tokio---rust-异步运行时',
          children: 'Tokio - Rust 异步运行时',
        }),
      }),
      _jsx(_components.p, {
        children: 'Tokio 是 Rust 生态中最流行的异步运行时，为编写高性能异步程序提供基础设施。',
      }),
      _jsx(_components.h2, {
        id: '什么是-tokio',
        children: _jsx(_components.a, {
          href: '#什么是-tokio',
          children: '什么是 Tokio？',
        }),
      }),
      _jsx(_components.p, {
        children: 'Tokio 是一个事件驱动的非阻塞 I/O 平台，用于编写异步应用程序。',
      }),
      _jsx(_components.h3, {
        id: '核心组件',
        children: _jsx(_components.a, {
          href: '#核心组件',
          children: '核心组件',
        }),
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'Runtime',
              }),
              '：任务执行器和调度器',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'Reactor',
              }),
              '：I/O 事件监听器（基于 mio）',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'Async I/O',
              }),
              '：异步网络、文件系统操作',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'Synchronization',
              }),
              '：异步同步原语',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'Timers',
              }),
              '：异步定时器',
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.h2, {
        id: 'runtime-架构',
        children: _jsx(_components.a, {
          href: '#runtime-架构',
          children: 'Runtime 架构',
        }),
      }),
      _jsx(RuntimeVisualization, {}),
      _jsx(_components.h3, {
        id: '多线程运行时',
        children: _jsx(_components.a, {
          href: '#多线程运行时',
          children: '多线程运行时',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::runtime::Runtime;\n\nfn main() {\n    // 创建多线程运行时\n    let rt = Runtime::new().unwrap();\n\n    rt.block_on(async {\n        println!("Hello from Tokio!");\n    });\n}\n\n// 使用宏简化\n#[tokio::main]\nasync fn main() {\n    println!("Hello from Tokio!");\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '单线程运行时',
        children: _jsx(_components.a, {
          href: '#单线程运行时',
          children: '单线程运行时',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::runtime::Builder;\n\nfn main() {\n    let rt = Builder::new_current_thread()\n        .enable_all()\n        .build()\n        .unwrap();\n\n    rt.block_on(async {\n        println!("Single-threaded runtime");\n    });\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: 'asyncawait-基础',
        children: _jsx(_components.a, {
          href: '#asyncawait-基础',
          children: 'async/await 基础',
        }),
      }),
      _jsx(_components.h3, {
        id: 'async-函数',
        children: _jsx(_components.a, {
          href: '#async-函数',
          children: 'async 函数',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'async fn fetch_data() -> Result<String, reqwest::Error> {\n    let response = reqwest::get("https://api.example.com/data").await?;\n    let text = response.text().await?;\n    Ok(text)\n}\n\n#[tokio::main]\nasync fn main() {\n    match fetch_data().await {\n        Ok(data) => println!("Data: {}", data),\n        Err(e) => eprintln!("Error: {}", e),\n    }\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: 'async-块',
        children: _jsx(_components.a, {
          href: '#async-块',
          children: 'async 块',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            '#[tokio::main]\nasync fn main() {\n    let future = async {\n        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;\n        println!("1 second passed");\n    };\n\n    future.await;\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: 'future-trait',
        children: _jsx(_components.a, {
          href: '#future-trait',
          children: 'Future Trait',
        }),
      }),
      _jsx(FutureStateMachine, {}),
      _jsx(_components.h3, {
        id: 'future-定义',
        children: _jsx(_components.a, {
          href: '#future-定义',
          children: 'Future 定义',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            "use std::future::Future;\nuse std::pin::Pin;\nuse std::task::{Context, Poll};\n\nstruct MyFuture {\n    value: Option<i32>,\n}\n\nimpl Future for MyFuture {\n    type Output = i32;\n\n    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {\n        if let Some(value) = self.value.take() {\n            Poll::Ready(value)\n        } else {\n            // 注册 Waker，等待唤醒\n            cx.waker().wake_by_ref();\n            Poll::Pending\n        }\n    }\n}\n",
        }),
      }),
      _jsx(_components.h2, {
        id: '并发执行',
        children: _jsx(_components.a, {
          href: '#并发执行',
          children: '并发执行',
        }),
      }),
      _jsx(_components.h3, {
        id: 'spawn-任务',
        children: _jsx(_components.a, {
          href: '#spawn-任务',
          children: 'spawn 任务',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::task;\n\n#[tokio::main]\nasync fn main() {\n    let handle1 = task::spawn(async {\n        println!("Task 1");\n        42\n    });\n\n    let handle2 = task::spawn(async {\n        println!("Task 2");\n        100\n    });\n\n    let result1 = handle1.await.unwrap();\n    let result2 = handle2.await.unwrap();\n\n    println!("Results: {}, {}", result1, result2);\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: 'join-宏',
        children: _jsx(_components.a, {
          href: '#join-宏',
          children: 'join! 宏',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::join;\n\n#[tokio::main]\nasync fn main() {\n    let (res1, res2, res3) = join!(\n        async { 1 + 1 },\n        async { 2 * 2 },\n        async { 3 - 1 }\n    );\n\n    println!("{}, {}, {}", res1, res2, res3);\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: 'select-宏',
        children: _jsx(_components.a, {
          href: '#select-宏',
          children: 'select! 宏',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::select;\nuse tokio::time::{sleep, Duration};\n\n#[tokio::main]\nasync fn main() {\n    let mut interval = tokio::time::interval(Duration::from_secs(1));\n\n    loop {\n        select! {\n            _ = interval.tick() => println!("Tick"),\n            _ = sleep(Duration::from_secs(5)) => {\n                println!("Timeout!");\n                break;\n            }\n        }\n    }\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '异步-io',
        children: _jsx(_components.a, {
          href: '#异步-io',
          children: '异步 I/O',
        }),
      }),
      _jsx(_components.h3, {
        id: 'tcp-server',
        children: _jsx(_components.a, {
          href: '#tcp-server',
          children: 'TCP Server',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::net::TcpListener;\nuse tokio::io::{AsyncReadExt, AsyncWriteExt};\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let listener = TcpListener::bind("127.0.0.1:8080").await?;\n\n    loop {\n        let (mut socket, _) = listener.accept().await?;\n\n        tokio::spawn(async move {\n            let mut buf = [0; 1024];\n\n            match socket.read(&mut buf).await {\n                Ok(n) if n == 0 => return,\n                Ok(n) => {\n                    socket.write_all(&buf[0..n]).await.unwrap();\n                }\n                Err(e) => eprintln!("Error: {}", e),\n            }\n        });\n    }\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: 'channels',
        children: _jsx(_components.a, {
          href: '#channels',
          children: 'Channels',
        }),
      }),
      _jsx(_components.h3, {
        id: 'mpsc-channel',
        children: _jsx(_components.a, {
          href: '#mpsc-channel',
          children: 'mpsc Channel',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::sync::mpsc;\n\n#[tokio::main]\nasync fn main() {\n    let (tx, mut rx) = mpsc::channel(32);\n\n    tokio::spawn(async move {\n        for i in 0..10 {\n            tx.send(i).await.unwrap();\n        }\n    });\n\n    while let Some(msg) = rx.recv().await {\n        println!("Received: {}", msg);\n    }\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: 'oneshot-channel',
        children: _jsx(_components.a, {
          href: '#oneshot-channel',
          children: 'oneshot Channel',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::sync::oneshot;\n\n#[tokio::main]\nasync fn main() {\n    let (tx, rx) = oneshot::channel();\n\n    tokio::spawn(async move {\n        tx.send("Hello from task!").unwrap();\n    });\n\n    let msg = rx.await.unwrap();\n    println!("{}", msg);\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '同步原语',
        children: _jsx(_components.a, {
          href: '#同步原语',
          children: '同步原语',
        }),
      }),
      _jsx(_components.h3, {
        id: 'mutex',
        children: _jsx(_components.a, {
          href: '#mutex',
          children: 'Mutex',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use tokio::sync::Mutex;\nuse std::sync::Arc;\n\n#[tokio::main]\nasync fn main() {\n    let data = Arc::new(Mutex::new(0));\n\n    let mut handles = vec![];\n\n    for _ in 0..10 {\n        let data = Arc::clone(&data);\n        let handle = tokio::spawn(async move {\n            let mut lock = data.lock().await;\n            *lock += 1;\n        });\n        handles.push(handle);\n    }\n\n    for handle in handles {\n        handle.await.unwrap();\n    }\n\n    println!("Result: {}", *data.lock().await);\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '性能对比',
        children: _jsx(_components.a, {
          href: '#性能对比',
          children: '性能对比',
        }),
      }),
      _jsx(_components.h3, {
        id: '异步-vs-同步',
        children: _jsx(_components.a, {
          href: '#异步-vs-同步',
          children: '异步 vs 同步',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            '// 同步版本\nfn sync_download() {\n    let urls = vec!["url1", "url2", "url3"];\n    for url in urls {\n        // 阻塞等待\n        let _ = reqwest::blocking::get(url);\n    }\n}\n\n// 异步版本（更高效）\nasync fn async_download() {\n    let urls = vec!["url1", "url2", "url3"];\n    let futures: Vec<_> = urls.iter()\n        .map(|url| reqwest::get(*url))\n        .collect();\n\n    // 并发执行\n    let results = futures_util::future::join_all(futures).await;\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '优势',
          }),
          '：',
        ],
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsx(_components.li, {
            children: '异步版本可以并发处理多个请求',
          }),
          '\n',
          _jsx(_components.li, {
            children: '不阻塞线程，充分利用资源',
          }),
          '\n',
          _jsx(_components.li, {
            children: '适合 I/O 密集型任务',
          }),
          '\n',
        ],
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
            children: '✅ Tokio 是 Rust 最流行的异步运行时',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 基于 Future + Reactor 模式',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 提供多线程任务调度（工作窃取）',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 丰富的异步 I/O 和同步原语',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 适合高并发 I/O 密集型应用',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 零成本抽象，性能接近手写状态机',
          }),
          '\n',
        ],
      }),
      _jsxs(_components.p, {
        children: [
          '探索更多：',
          _jsx(_components.a, {
            href: './runtime',
            children: 'Runtime 架构',
          }),
          ' | ',
          _jsx(_components.a, {
            href: './scheduling',
            children: '任务调度',
          }),
          ' |\n',
          _jsx(_components.a, {
            href: './reactor',
            children: 'Reactor 模式',
          }),
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
