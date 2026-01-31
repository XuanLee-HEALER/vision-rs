import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
export const metadata = {
  title: '模式匹配 - Vision-RS',
  description: 'Rust 的模式匹配与解构'
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
    ul: "ul",
    ...props.components
  };
  return _jsxs(LearnLayout, {
    children: [_jsx(_components.h1, {
      id: "模式匹配",
      children: _jsx(_components.a, {
        href: "#模式匹配",
        children: "模式匹配"
      })
    }), _jsx(_components.p, {
      children: "模式匹配是 Rust 最强大的控制流工具之一。"
    }), _jsx(_components.h2, {
      id: "match-表达式",
      children: _jsx(_components.a, {
        href: "#match-表达式",
        children: "match 表达式"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let number = 13;\n\n    match number {\n        1 => println!(\"一！\"),\n        2 | 3 | 5 | 7 | 11 => println!(\"这是质数\"),\n        13..=19 => println!(\"十几\"),\n        _ => println!(\"其他\"),\n    }\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "match-必须穷尽",
      children: _jsx(_components.a, {
        href: "#match-必须穷尽",
        children: "match 必须穷尽"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let x = 1;\n\n    match x {\n        1 => println!(\"一\"),\n        2 => println!(\"二\"),\n        _ => println!(\"其他\"),  // 必须处理所有情况\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "if-let-模式",
      children: _jsx(_components.a, {
        href: "#if-let-模式",
        children: "if let 模式"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let some_value = Some(3);\n\n    // 只关心一种情况\n    if let Some(3) = some_value {\n        println!(\"三！\");\n    }\n\n    // 等同于\n    match some_value {\n        Some(3) => println!(\"三！\"),\n        _ => (),\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "while-let-循环",
      children: _jsx(_components.a, {
        href: "#while-let-循环",
        children: "while let 循环"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let mut stack = Vec::new();\n    stack.push(1);\n    stack.push(2);\n    stack.push(3);\n\n    while let Some(top) = stack.pop() {\n        println!(\"{}\", top);\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "解构",
      children: _jsx(_components.a, {
        href: "#解构",
        children: "解构"
      })
    }), _jsx(_components.h3, {
      id: "解构结构体",
      children: _jsx(_components.a, {
        href: "#解构结构体",
        children: "解构结构体"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct Point {\n    x: i32,\n    y: i32,\n}\n\nfn main() {\n    let p = Point { x: 0, y: 7 };\n\n    let Point { x, y } = p;\n    println!(\"x = {}, y = {}\", x, y);\n\n    match p {\n        Point { x: 0, y } => println!(\"在 y 轴上，y = {}\", y),\n        Point { x, y: 0 } => println!(\"在 x 轴上，x = {}\", x),\n        Point { x, y } => println!(\"其他位置: ({}, {})\", x, y),\n    }\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "解构枚举",
      children: _jsx(_components.a, {
        href: "#解构枚举",
        children: "解构枚举"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "enum Message {\n    Quit,\n    Move { x: i32, y: i32 },\n    Write(String),\n    ChangeColor(i32, i32, i32),\n}\n\nfn process(msg: Message) {\n    match msg {\n        Message::Quit => println!(\"退出\"),\n        Message::Move { x, y } => println!(\"移动到 ({}, {})\", x, y),\n        Message::Write(text) => println!(\"文本: {}\", text),\n        Message::ChangeColor(r, g, b) => println!(\"颜色: ({}, {}, {})\", r, g, b),\n    }\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "解构元组",
      children: _jsx(_components.a, {
        href: "#解构元组",
        children: "解构元组"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let tuple = (1, \"hello\", 4.5);\n\n    let (x, y, z) = tuple;\n    println!(\"{}, {}, {}\", x, y, z);\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "模式守卫",
      children: _jsx(_components.a, {
        href: "#模式守卫",
        children: "模式守卫"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let num = Some(4);\n\n    match num {\n        Some(x) if x < 5 => println!(\"小于 5: {}\", x),\n        Some(x) => println!(\"{}\", x),\n        None => (),\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "-绑定",
      children: _jsx(_components.a, {
        href: "#-绑定",
        children: "@ 绑定"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "enum Message {\n    Hello { id: i32 },\n}\n\nfn main() {\n    let msg = Message::Hello { id: 5 };\n\n    match msg {\n        Message::Hello { id: id_variable @ 3..=7 } => {\n            println!(\"ID 在范围内: {}\", id_variable)\n        }\n        Message::Hello { id: 10..=12 } => {\n            println!(\"ID 在另一个范围内\")\n        }\n        Message::Hello { id } => {\n            println!(\"其他 ID: {}\", id)\n        }\n    }\n}\n"
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
          children: "match"
        }), " 必须穷尽所有可能"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "if let"
        }), " 用于只关心一种模式"]
      }), "\n", _jsx(_components.li, {
        children: "✅ 可以解构结构体、枚举、元组"
      }), "\n", _jsx(_components.li, {
        children: "✅ 模式守卫添加额外条件"
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "@"
        }), " 绑定在模式中创建变量"]
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
