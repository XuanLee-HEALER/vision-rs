import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
import MermaidDiagram from '@/components/MermaidDiagram';
export const metadata = {
  title: '错误处理 - Vision-RS',
  description: 'Rust 的错误处理机制'
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
    ul: "ul",
    ...props.components
  };
  return _jsxs(LearnLayout, {
    children: [_jsx(_components.h1, {
      id: "错误处理",
      children: _jsx(_components.a, {
        href: "#错误处理",
        children: "错误处理"
      })
    }), _jsxs(_components.p, {
      children: ["Rust 将错误分为两类：", _jsx(_components.strong, {
        children: "可恢复错误"
      }), "（", _jsx(_components.code, {
        children: "Result<T, E>"
      }), "）和", _jsx(_components.strong, {
        children: "不可恢复错误"
      }), "（panic!）。"]
    }), _jsx(_components.h2, {
      id: "panic-宏",
      children: _jsx(_components.a, {
        href: "#panic-宏",
        children: "panic! 宏"
      })
    }), _jsx(_components.p, {
      children: "遇到不可恢复的错误时，程序会 panic："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    panic!(\"程序崩溃了！\");\n}\n"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "何时使用 panic"
      }), "："]
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "示例代码、原型"
      }), "\n", _jsx(_components.li, {
        children: "不可能发生的情况（逻辑错误）"
      }), "\n", _jsx(_components.li, {
        children: "库代码中的契约违反"
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "result-枚举",
      children: _jsx(_components.a, {
        href: "#result-枚举",
        children: "Result 枚举"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "enum Result<T, E> {\n    Ok(T),\n    Err(E),\n}\n\nuse std::fs::File;\n\nfn main() {\n    let f = File::open(\"hello.txt\");\n\n    let f = match f {\n        Ok(file) => file,\n        Err(error) => {\n            panic!(\"打开文件失败: {:?}\", error);\n        }\n    };\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "匹配不同错误",
      children: _jsx(_components.a, {
        href: "#匹配不同错误",
        children: "匹配不同错误"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use std::fs::File;\nuse std::io::ErrorKind;\n\nfn main() {\n    let f = File::open(\"hello.txt\");\n\n    let f = match f {\n        Ok(file) => file,\n        Err(error) => match error.kind() {\n            ErrorKind::NotFound => match File::create(\"hello.txt\") {\n                Ok(fc) => fc,\n                Err(e) => panic!(\"创建文件失败: {:?}\", e),\n            },\n            other_error => panic!(\"打开文件失败: {:?}\", other_error),\n        },\n    };\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "unwrap-和-expect",
      children: _jsx(_components.a, {
        href: "#unwrap-和-expect",
        children: "unwrap 和 expect"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use std::fs::File;\n\nfn main() {\n    // unwrap：Ok 返回值，Err 则 panic\n    let f = File::open(\"hello.txt\").unwrap();\n\n    // expect：可以自定义 panic 消息\n    let f = File::open(\"hello.txt\")\n        .expect(\"无法打开 hello.txt\");\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "传播错误",
      children: _jsx(_components.a, {
        href: "#传播错误",
        children: "传播错误"
      })
    }), _jsxs(_components.p, {
      children: ["使用 ", _jsx(_components.code, {
        children: "?"
      }), " 运算符："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use std::fs::File;\nuse std::io::{self, Read};\n\nfn read_username_from_file() -> Result<String, io::Error> {\n    let mut f = File::open(\"hello.txt\")?;  // 如果 Err，提前返回\n    let mut s = String::new();\n    f.read_to_string(&mut s)?;\n    Ok(s)\n}\n\n// 更简洁的链式调用\nfn read_username_simplified() -> Result<String, io::Error> {\n    let mut s = String::new();\n    File::open(\"hello.txt\")?.read_to_string(&mut s)?;\n    Ok(s)\n}\n"
      })
    }), _jsx(MermaidDiagram, {
      chart: `
graph LR
  A[调用函数] --> B{返回 Result}
  B -->|Ok| C[提取值<br/>继续执行]
  B -->|Err| D[提前返回<br/>传播错误]

  style C fill:#a6da95,stroke:#a6da95,color:#24273a
  style D fill:#ed8796,stroke:#ed8796,color:#24273a

`
    }), _jsx(_components.h2, {
      id: "-只能用于返回-result-的函数",
      children: _jsx(_components.a, {
        href: "#-只能用于返回-result-的函数",
        children: "? 只能用于返回 Result 的函数"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let f = File::open(\"hello.txt\")?;  // ✅ 现在可以在 main 中使用 ?\n    Ok(())\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "自定义错误类型",
      children: _jsx(_components.a, {
        href: "#自定义错误类型",
        children: "自定义错误类型"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use std::fmt;\n\n#[derive(Debug)]\nenum MyError {\n    Io(std::io::Error),\n    Parse(std::num::ParseIntError),\n}\n\nimpl fmt::Display for MyError {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            MyError::Io(e) => write!(f, \"IO 错误: {}\", e),\n            MyError::Parse(e) => write!(f, \"解析错误: {}\", e),\n        }\n    }\n}\n\nimpl std::error::Error for MyError {}\n\n// 使用 From trait 自动转换\nimpl From<std::io::Error> for MyError {\n    fn from(err: std::io::Error) -> MyError {\n        MyError::Io(err)\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "option-vs-result",
      children: _jsx(_components.a, {
        href: "#option-vs-result",
        children: "Option vs Result"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// Option：表示可能没有值\nfn find_user(id: u32) -> Option<User> {\n    // ...\n}\n\n// Result：表示可能失败的操作\nfn save_user(user: &User) -> Result<(), DatabaseError> {\n    // ...\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "and_then-和-map",
      children: _jsx(_components.a, {
        href: "#and_then-和-map",
        children: "and_then 和 map"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let result: Result<i32, &str> = Ok(2);\n\n    // map：转换 Ok 中的值\n    let doubled = result.map(|x| x * 2);  // Ok(4)\n\n    // and_then：链式调用可能失败的操作\n    let result = Ok(2)\n        .and_then(|x| Ok(x * 2))\n        .and_then(|x| Ok(x + 1));  // Ok(5)\n}\n"
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
        children: "// 1. 使用 ? 传播错误\nfn process() -> Result<(), MyError> {\n    let data = read_data()?;\n    transform(data)?;\n    Ok(())\n}\n\n// 2. 使用 expect 提供上下文\nlet config = load_config()\n    .expect(\"配置文件必须存在且格式正确\");\n\n// 3. 库代码返回 Result，应用代码处理错误\npub fn parse_number(s: &str) -> Result<i32, ParseError> {\n    s.parse().map_err(|e| ParseError::InvalidFormat(e))\n}\n"
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
        children: "// ❌ 滥用 unwrap\nlet value = may_fail().unwrap();  // 可能导致 panic\n\n// ❌ 忽略错误\nlet _ = may_fail();  // 错误被静默忽略\n\n// ❌ 过度使用 panic\nif x < 0 {\n    panic!(\"x 不能为负\");  // 应该使用 Result\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "小结",
      children: _jsx(_components.a, {
        href: "#小结",
        children: "小结"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "Result<T, E>"
        }), " 用于可恢复错误"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "panic!"
        }), " 用于不可恢复错误"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "?"
        }), " 运算符简化错误传播"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "unwrap"
        }), " 和 ", _jsx(_components.code, {
          children: "expect"
        }), " 用于原型和测试"]
      }), "\n", _jsx(_components.li, {
        children: "✅ 自定义错误类型提高可读性"
      }), "\n", _jsxs(_components.li, {
        children: ["✅ 库代码应返回 ", _jsx(_components.code, {
          children: "Result"
        }), "，让调用者处理"]
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
