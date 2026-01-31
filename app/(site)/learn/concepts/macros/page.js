import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
export const metadata = {
  title: '宏系统 - Vision-RS',
  description: 'Rust 的宏编程'
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
      id: "宏系统",
      children: _jsx(_components.a, {
        href: "#宏系统",
        children: "宏系统"
      })
    }), _jsx(_components.p, {
      children: "宏（Macro）在编译时展开代码，提供元编程能力。"
    }), _jsx(_components.h2, {
      id: "声明宏",
      children: _jsx(_components.a, {
        href: "#声明宏",
        children: "声明宏"
      })
    }), _jsxs(_components.p, {
      children: ["使用 ", _jsx(_components.code, {
        children: "macro_rules!"
      }), " 定义声明宏："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "macro_rules! say_hello {\n    () => {\n        println!(\"Hello!\");\n    };\n}\n\nfn main() {\n    say_hello!();  // 展开为 println!(\"Hello!\");\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "带参数的宏",
      children: _jsx(_components.a, {
        href: "#带参数的宏",
        children: "带参数的宏"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "macro_rules! create_function {\n    ($func_name:ident) => {\n        fn $func_name() {\n            println!(\"函数 {:?} 被调用\", stringify!($func_name));\n        }\n    };\n}\n\ncreate_function!(foo);\ncreate_function!(bar);\n\nfn main() {\n    foo();  // \"函数 \"foo\" 被调用\"\n    bar();  // \"函数 \"bar\" 被调用\"\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "模式匹配",
      children: _jsx(_components.a, {
        href: "#模式匹配",
        children: "模式匹配"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "macro_rules! vec_of_strings {\n    ($($x:expr),*) => {\n        {\n            let mut temp_vec = Vec::new();\n            $(\n                temp_vec.push($x.to_string());\n            )*\n            temp_vec\n        }\n    };\n}\n\nfn main() {\n    let v = vec_of_strings![\"hello\", \"world\"];\n    println!(\"{:?}\", v);  // [\"hello\", \"world\"]\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "常用的内置宏",
      children: _jsx(_components.a, {
        href: "#常用的内置宏",
        children: "常用的内置宏"
      })
    }), _jsx(_components.h3, {
      id: "println-和-format",
      children: _jsx(_components.a, {
        href: "#println-和-format",
        children: "println! 和 format!"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    println!(\"Hello, {}!\", \"world\");\n    let s = format!(\"x = {}, y = {}\", 10, 20);\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "vec",
      children: _jsx(_components.a, {
        href: "#vec",
        children: "vec!"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let v = vec![1, 2, 3];\n\n    // 等同于\n    let mut v = Vec::new();\n    v.push(1);\n    v.push(2);\n    v.push(3);\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "panic",
      children: _jsx(_components.a, {
        href: "#panic",
        children: "panic!"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    panic!(\"发生了致命错误！\");\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "assert-和-debug_assert",
      children: _jsx(_components.a, {
        href: "#assert-和-debug_assert",
        children: "assert! 和 debug_assert!"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    assert!(1 + 1 == 2, \"数学出错了！\");\n    assert_eq!(1 + 1, 2);\n    assert_ne!(1, 2);\n\n    // 只在 debug 模式下检查\n    debug_assert!(expensive_check());\n}\n\nfn expensive_check() -> bool {\n    true\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "派生宏",
      children: _jsx(_components.a, {
        href: "#派生宏",
        children: "派生宏"
      })
    }), _jsxs(_components.p, {
      children: ["使用 ", _jsx(_components.code, {
        children: "#[derive]"
      }), " 自动实现 trait："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "#[derive(Debug, Clone, PartialEq)]\nstruct Point {\n    x: i32,\n    y: i32,\n}\n\nfn main() {\n    let p1 = Point { x: 1, y: 2 };\n    let p2 = p1.clone();\n\n    println!(\"{:?}\", p1);  // Debug\n    assert_eq!(p1, p2);    // PartialEq\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "属性宏",
      children: _jsx(_components.a, {
        href: "#属性宏",
        children: "属性宏"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "#[test]\nfn it_works() {\n    assert_eq!(2 + 2, 4);\n}\n\n#[cfg(test)]\nmod tests {\n    #[test]\n    fn test_add() {\n        assert_eq!(2 + 2, 4);\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "过程宏高级",
      children: _jsx(_components.a, {
        href: "#过程宏高级",
        children: "过程宏（高级）"
      })
    }), _jsx(_components.p, {
      children: "过程宏需要单独的 crate："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// 在 my_macro crate 中\nuse proc_macro::TokenStream;\n\n#[proc_macro_derive(HelloMacro)]\npub fn hello_macro_derive(input: TokenStream) -> TokenStream {\n    // 实现代码生成逻辑\n    // ...\n}\n"
      })
    }), _jsx(_components.p, {
      children: "使用："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use my_macro::HelloMacro;\n\n#[derive(HelloMacro)]\nstruct Pancakes;\n\nfn main() {\n    Pancakes::hello_macro();\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "宏调试",
      children: _jsx(_components.a, {
        href: "#宏调试",
        children: "宏调试"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "macro_rules! debug_macro {\n    ($($x:tt)*) => {\n        {\n            println!(\"展开为：\");\n            $($x)*\n        }\n    };\n}\n\nfn main() {\n    debug_macro! {\n        let x = 42;\n        println!(\"{}\", x);\n    }\n}\n"
      })
    }), _jsxs(_components.p, {
      children: ["使用 ", _jsx(_components.code, {
        children: "cargo expand"
      }), " 查看宏展开结果："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-bash",
        children: "cargo install cargo-expand\ncargo expand\n"
      })
    }), _jsx(_components.h2, {
      id: "宏-vs-函数",
      children: _jsx(_components.a, {
        href: "#宏-vs-函数",
        children: "宏 vs 函数"
      })
    }), _jsxs(_components.table, {
      children: [_jsx(_components.thead, {
        children: _jsxs(_components.tr, {
          children: [_jsx(_components.th, {
            children: "特性"
          }), _jsx(_components.th, {
            children: "宏"
          }), _jsx(_components.th, {
            children: "函数"
          })]
        })
      }), _jsxs(_components.tbody, {
        children: [_jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "调用语法"
          }), _jsx(_components.td, {
            children: _jsx(_components.code, {
              children: "name!()"
            })
          }), _jsx(_components.td, {
            children: _jsx(_components.code, {
              children: "name()"
            })
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "展开时机"
          }), _jsx(_components.td, {
            children: "编译时"
          }), _jsx(_components.td, {
            children: "运行时"
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "参数个数"
          }), _jsx(_components.td, {
            children: "可变"
          }), _jsx(_components.td, {
            children: "固定"
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "参数类型"
          }), _jsx(_components.td, {
            children: "任意"
          }), _jsx(_components.td, {
            children: "固定"
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "卫生性"
          }), _jsx(_components.td, {
            children: "有"
          }), _jsx(_components.td, {
            children: "无关"
          })]
        })]
      })]
    }), _jsx(_components.h2, {
      id: "小结",
      children: _jsx(_components.a, {
        href: "#小结",
        children: "小结"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "✅ 宏在编译时展开代码"
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "macro_rules!"
        }), " 定义声明宏"]
      }), "\n", _jsx(_components.li, {
        children: "✅ 派生宏自动实现 trait"
      }), "\n", _jsx(_components.li, {
        children: "✅ 过程宏提供高级元编程"
      }), "\n", _jsx(_components.li, {
        children: "✅ 宏比函数更灵活，但更难调试"
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
