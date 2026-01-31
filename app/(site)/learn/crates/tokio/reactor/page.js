import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
import ReactorPattern from '@/components/tokio/ReactorPattern';
export const metadata = {
  title: 'Reactor 模式',
  description: 'Tokio 的 I/O 事件处理机制'
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return _jsxs(LearnLayout, {
    children: [_jsx(_components.h1, {
      id: "reactor-模式",
      children: _jsx(_components.a, {
        href: "#reactor-模式",
        children: "Reactor 模式"
      })
    }), _jsx(_components.p, {
      children: "Reactor 是 Tokio 处理 I/O 事件的核心组件，基于 mio 库实现。"
    }), _jsx(_components.h2, {
      id: "架构",
      children: _jsx(_components.a, {
        href: "#架构",
        children: "架构"
      })
    }), _jsx(ReactorPattern, {}), _jsx(_components.h3, {
      id: "组件",
      children: _jsx(_components.a, {
        href: "#组件",
        children: "组件"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "Event Loop"
        }), "：持续监听 I/O 事件"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "Reactor"
        }), "：基于 mio，使用 epoll/kqueue/IOCP"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "Waker"
        }), "：唤醒等待的 Future"]
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "io-注册",
      children: _jsx(_components.a, {
        href: "#io-注册",
        children: "I/O 注册"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use tokio::net::TcpStream;\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    // 连接操作\n    let stream = TcpStream::connect(\"127.0.0.1:8080\").await?;\n\n    // 底层流程：\n    // 1. 创建 socket，设置非阻塞\n    // 2. 注册到 Reactor（epoll_ctl）\n    // 3. 返回 Pending，保存 Waker\n    // 4. I/O 就绪时，Reactor 唤醒任务\n    // 5. 再次 poll，返回 Ready\n\n    Ok(())\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "waker-机制",
      children: _jsx(_components.a, {
        href: "#waker-机制",
        children: "Waker 机制"
      })
    }), _jsx(_components.h3, {
      id: "工作流程",
      children: _jsx(_components.a, {
        href: "#工作流程",
        children: "工作流程"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "impl Future for MyFuture {\n    type Output = ();\n\n    fn poll(self: Pin<&mut Self>, cx: &mut Context) -> Poll<()> {\n        if self.is_ready() {\n            Poll::Ready(())\n        } else {\n            // 保存 Waker，等待 I/O 事件唤醒\n            self.waker = Some(cx.waker().clone());\n            Poll::Pending\n        }\n    }\n}\n\n// I/O 就绪时，Reactor 调用\nwaker.wake();  // 唤醒任务，重新 poll\n"
      })
    }), _jsx(_components.h2, {
      id: "mio-集成",
      children: _jsx(_components.a, {
        href: "#mio-集成",
        children: "mio 集成"
      })
    }), _jsx(_components.h3, {
      id: "平台差异",
      children: _jsx(_components.a, {
        href: "#平台差异",
        children: "平台差异"
      })
    }), _jsxs(_components.table, {
      children: [_jsx(_components.thead, {
        children: _jsxs(_components.tr, {
          children: [_jsx(_components.th, {
            children: "平台"
          }), _jsx(_components.th, {
            children: "I/O 多路复用"
          })]
        })
      }), _jsxs(_components.tbody, {
        children: [_jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "Linux"
          }), _jsx(_components.td, {
            children: _jsx(_components.strong, {
              children: "epoll"
            })
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "macOS/BSD"
          }), _jsx(_components.td, {
            children: _jsx(_components.strong, {
              children: "kqueue"
            })
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "Windows"
          }), _jsx(_components.td, {
            children: _jsx(_components.strong, {
              children: "IOCP"
            })
          })]
        })]
      })]
    }), _jsx(_components.h3, {
      id: "mio-示例",
      children: _jsx(_components.a, {
        href: "#mio-示例",
        children: "mio 示例"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use mio::{Events, Interest, Poll, Token};\nuse mio::net::TcpListener;\n\nfn main() -> std::io::Result<()> {\n    let mut poll = Poll::new()?;\n    let mut events = Events::with_capacity(128);\n\n    let mut listener = TcpListener::bind(\"127.0.0.1:9000\".parse().unwrap())?;\n\n    poll.registry().register(\n        &mut listener,\n        Token(0),\n        Interest::READABLE,\n    )?;\n\n    loop {\n        poll.poll(&mut events, None)?;\n\n        for event in events.iter() {\n            match event.token() {\n                Token(0) => {\n                    // Accept connections\n                    let (connection, address) = listener.accept()?;\n                    println!(\"New connection from {:?}\", address);\n                }\n                _ => {}\n            }\n        }\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "性能特性",
      children: _jsx(_components.a, {
        href: "#性能特性",
        children: "性能特性"
      })
    }), _jsx(_components.h3, {
      id: "零拷贝",
      children: _jsx(_components.a, {
        href: "#零拷贝",
        children: "零拷贝"
      })
    }), _jsx(_components.p, {
      children: "Tokio 支持零拷贝 I/O："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use tokio::fs::File;\nuse tokio::net::TcpStream;\n\nasync fn send_file(socket: &mut TcpStream) -> io::Result<()> {\n    let file = File::open(\"large_file.dat\").await?;\n\n    // 零拷贝传输（使用 sendfile 系统调用）\n    tokio::io::copy(&mut file, socket).await?;\n    Ok(())\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "批量处理",
      children: _jsx(_components.a, {
        href: "#批量处理",
        children: "批量处理"
      })
    }), _jsx(_components.p, {
      children: "Reactor 一次 poll 可以处理多个就绪事件："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// 伪代码\nloop {\n    let events = epoll_wait();  // 一次获取多个事件\n\n    for event in events {\n        // 批量处理，提高效率\n        handle_event(event);\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "实践建议",
      children: _jsx(_components.a, {
        href: "#实践建议",
        children: "实践建议"
      })
    }), _jsx(_components.h3, {
      id: "-推荐做法",
      children: _jsx(_components.a, {
        href: "#-推荐做法",
        children: "✅ 推荐做法"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// 1. 使用异步 I/O\nasync fn read_file() -> io::Result<String> {\n    tokio::fs::read_to_string(\"file.txt\").await\n}\n\n// 2. 正确处理错误\nasync fn safe_connect() -> Result<TcpStream, io::Error> {\n    match TcpStream::connect(\"127.0.0.1:8080\").await {\n        Ok(stream) => Ok(stream),\n        Err(e) => {\n            eprintln!(\"Connection failed: {}\", e);\n            Err(e)\n        }\n    }\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "-避免做法",
      children: _jsx(_components.a, {
        href: "#-避免做法",
        children: "❌ 避免做法"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// ❌ 不要混用阻塞 I/O\nasync fn bad_example() {\n    // 这会阻塞 worker 线程！\n    let data = std::fs::read_to_string(\"file.txt\").unwrap();\n}\n\n// ✅ 应该使用\nasync fn good_example() {\n    let data = tokio::fs::read_to_string(\"file.txt\").await.unwrap();\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "小结",
      children: _jsx(_components.a, {
        href: "#小结",
        children: "小结"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "✅ Reactor 监听 I/O 事件"
      }), "\n", _jsx(_components.li, {
        children: "✅ Waker 唤醒等待的任务"
      }), "\n", _jsx(_components.li, {
        children: "✅ 基于 mio，跨平台支持"
      }), "\n", _jsx(_components.li, {
        children: "✅ 零拷贝，高性能"
      }), "\n", _jsx(_components.li, {
        children: "✅ 批量处理事件"
      }), "\n"]
    })]
  });
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
