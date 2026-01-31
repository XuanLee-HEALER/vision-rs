import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
export const metadata = {
  title: '所有权系统 - Vision-RS',
  description: '深入理解 Rust 的所有权系统'
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    ol: "ol",
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
      id: "所有权系统",
      children: _jsx(_components.a, {
        href: "#所有权系统",
        children: "所有权系统"
      })
    }), _jsxs(_components.p, {
      children: ["所有权(Ownership)是 Rust 最独特也是最核心的特性。它使得 Rust 能够在", _jsx(_components.strong, {
        children: "没有垃圾回收器"
      }), "的情况下保证内存安全。"]
    }), _jsx(_components.h2, {
      id: "什么是所有权",
      children: _jsx(_components.a, {
        href: "#什么是所有权",
        children: "什么是所有权？"
      })
    }), _jsxs(_components.p, {
      children: ["在 Rust 中，每个值都有一个", _jsx(_components.strong, {
        children: "所有者"
      }), "(owner)。所有权系统遵循三条基本规则："]
    }), _jsxs(_components.ol, {
      children: ["\n", _jsxs(_components.li, {
        children: ["Rust 中的每个值都有一个", _jsx(_components.strong, {
          children: "所有者"
        })]
      }), "\n", _jsxs(_components.li, {
        children: ["同一时刻，一个值只能有", _jsx(_components.strong, {
          children: "一个所有者"
        })]
      }), "\n", _jsxs(_components.li, {
        children: ["当所有者离开作用域时，值将被", _jsx(_components.strong, {
          children: "自动释放"
        })]
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "基本示例",
      children: _jsx(_components.a, {
        href: "#基本示例",
        children: "基本示例"
      })
    }), _jsx(_components.p, {
      children: "让我们通过代码来理解所有权："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let s1 = String::from(\"hello\");  // s1 是字符串的所有者\n    let s2 = s1;                      // 所有权转移给 s2\n\n    // println!(\"{}\", s1);            // ❌ 编译错误！s1 已经无效\n    println!(\"{}\", s2);               // ✅ 正确，s2 现在是所有者\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "发生了什么",
      children: _jsx(_components.a, {
        href: "#发生了什么",
        children: "发生了什么？"
      })
    }), _jsxs(_components.p, {
      children: ["当我们执行 ", _jsx(_components.code, {
        children: "let s2 = s1"
      }), " 时："]
    }), _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "不是"
        }), "复制数据(这会很昂贵)"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "而是"
        }), "转移了所有权"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.code, {
          children: "s1"
        }), " 变为", _jsx(_components.strong, {
          children: "无效"
        }), "，不能再使用"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.code, {
          children: "s2"
        }), " 成为", _jsx(_components.strong, {
          children: "新的所有者"
        })]
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "内存布局",
      children: _jsx(_components.a, {
        href: "#内存布局",
        children: "内存布局"
      })
    }), _jsxs(_components.p, {
      children: ["让我们可视化一下 ", _jsx(_components.code, {
        children: "String"
      }), " 在内存中的表示："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        children: "栈(Stack)                    堆(Heap)\n┌──────────┐\n│   s1     │──────┐\n├──────────┤      │            ┌─────────┐\n│  ptr     │──────┼───────────>│  h      │\n│  len: 5  │      │            │  e      │\n│  cap: 5  │      │            │  l      │\n└──────────┘      │            │  l      │\n                  │            │  o      │\n┌──────────┐      │            └─────────┘\n│   s2     │──────┘\n├──────────┤\n│  ptr     │──────────────────>(指向同一块堆内存)\n│  len: 5  │\n│  cap: 5  │\n└──────────┘\n"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "重要"
        }), "：移动操作后，", _jsx(_components.code, {
          children: "s1"
        }), " 的指针被", _jsx(_components.strong, {
          children: "失效"
        }), "，防止", _jsx(_components.strong, {
          children: "双重释放"
        }), "(double\nfree)问题。"]
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "克隆clone",
      children: _jsx(_components.a, {
        href: "#克隆clone",
        children: "克隆(Clone)"
      })
    }), _jsxs(_components.p, {
      children: ["如果确实需要", _jsx(_components.strong, {
        children: "深拷贝"
      }), "堆上的数据，可以使用 ", _jsx(_components.code, {
        children: "clone"
      }), " 方法："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = s1.clone();  // 完整复制堆上的数据\n\n    println!(\"s1 = {}, s2 = {}\", s1, s2);  // ✅ 都有效\n}\n"
      })
    }), _jsxs(_components.p, {
      children: ["⚠️ ", _jsx(_components.strong, {
        children: "注意"
      }), "：", _jsx(_components.code, {
        children: "clone"
      }), " 可能会很昂贵，因为它会复制堆上的所有数据。"]
    }), _jsx(_components.h2, {
      id: "栈上的数据复制copy",
      children: _jsx(_components.a, {
        href: "#栈上的数据复制copy",
        children: "栈上的数据：复制(Copy)"
      })
    }), _jsxs(_components.p, {
      children: ["对于存储在栈上的简单类型，Rust 会自动", _jsx(_components.strong, {
        children: "复制"
      }), "而不是", _jsx(_components.strong, {
        children: "移动"
      }), "："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let x = 5;\n    let y = x;  // 复制值\n\n    println!(\"x = {}, y = {}\", x, y);  // ✅ 都有效\n}\n"
      })
    }), _jsxs(_components.p, {
      children: ["这些类型实现了 ", _jsx(_components.code, {
        children: "Copy"
      }), " trait："]
    }), _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["所有整数类型(", _jsx(_components.code, {
          children: "i32"
        }), ", ", _jsx(_components.code, {
          children: "u64"
        }), " 等)"]
      }), "\n", _jsxs(_components.li, {
        children: ["布尔类型 ", _jsx(_components.code, {
          children: "bool"
        })]
      }), "\n", _jsxs(_components.li, {
        children: ["浮点类型(", _jsx(_components.code, {
          children: "f32"
        }), ", ", _jsx(_components.code, {
          children: "f64"
        }), ")"]
      }), "\n", _jsxs(_components.li, {
        children: ["字符类型 ", _jsx(_components.code, {
          children: "char"
        })]
      }), "\n", _jsxs(_components.li, {
        children: ["元组(如果所有成员都是 ", _jsx(_components.code, {
          children: "Copy"
        }), " 的)"]
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "函数与所有权",
      children: _jsx(_components.a, {
        href: "#函数与所有权",
        children: "函数与所有权"
      })
    }), _jsx(_components.h3, {
      id: "传递值到函数",
      children: _jsx(_components.a, {
        href: "#传递值到函数",
        children: "传递值到函数"
      })
    }), _jsxs(_components.p, {
      children: ["将值传递给函数会", _jsx(_components.strong, {
        children: "移动"
      }), "或", _jsx(_components.strong, {
        children: "复制"
      }), "，和赋值一样："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let s = String::from(\"hello\");  // s 进入作用域\n\n    takes_ownership(s);              // s 的值移动到函数\n    // println!(\"{}\", s);            // ❌ s 已经无效\n\n    let x = 5;                       // x 进入作用域\n\n    makes_copy(x);                   // x 被复制到函数\n    println!(\"{}\", x);               // ✅ x 仍然有效\n}\n\nfn takes_ownership(some_string: String) {\n    println!(\"{}\", some_string);\n}  // some_string 在这里被释放\n\nfn makes_copy(some_integer: i32) {\n    println!(\"{}\", some_integer);\n}  // some_integer 在这里离开作用域，无事发生\n"
      })
    }), _jsx(_components.h3, {
      id: "返回值与所有权",
      children: _jsx(_components.a, {
        href: "#返回值与所有权",
        children: "返回值与所有权"
      })
    }), _jsxs(_components.p, {
      children: ["函数也可以", _jsx(_components.strong, {
        children: "转移"
      }), "所有权："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let s1 = gives_ownership();         // 函数返回值移动到 s1\n\n    let s2 = String::from(\"hello\");     // s2 进入作用域\n\n    let s3 = takes_and_gives_back(s2);  // s2 移入函数，返回值移动到 s3\n}\n\nfn gives_ownership() -> String {\n    let some_string = String::from(\"yours\");\n    some_string  // 返回值移动给调用者\n}\n\nfn takes_and_gives_back(a_string: String) -> String {\n    a_string  // 返回值移动给调用者\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "为什么需要所有权",
      children: _jsx(_components.a, {
        href: "#为什么需要所有权",
        children: "为什么需要所有权？"
      })
    }), _jsx(_components.p, {
      children: "所有权系统解决了几个关键问题："
    }), _jsxs(_components.table, {
      children: [_jsx(_components.thead, {
        children: _jsxs(_components.tr, {
          children: [_jsx(_components.th, {
            children: "问题"
          }), _jsx(_components.th, {
            children: "传统语言的解决方案"
          }), _jsx(_components.th, {
            children: "Rust 的方案"
          })]
        })
      }), _jsxs(_components.tbody, {
        children: [_jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "内存泄漏"
          }), _jsx(_components.td, {
            children: "垃圾回收器(GC)"
          }), _jsx(_components.td, {
            children: "编译时检查"
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "悬垂指针"
          }), _jsx(_components.td, {
            children: "运行时检查"
          }), _jsx(_components.td, {
            children: "编译时检查"
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "数据竞争"
          }), _jsx(_components.td, {
            children: "锁和同步原语"
          }), _jsx(_components.td, {
            children: "编译时检查"
          })]
        }), _jsxs(_components.tr, {
          children: [_jsx(_components.td, {
            children: "双重释放"
          }), _jsx(_components.td, {
            children: "引用计数"
          }), _jsx(_components.td, {
            children: "编译时检查"
          })]
        })]
      })]
    }), _jsxs(_components.p, {
      children: ["✨ ", _jsx(_components.strong, {
        children: "核心优势"
      }), "：", _jsx(_components.strong, {
        children: "零成本抽象"
      }), " + ", _jsx(_components.strong, {
        children: "内存安全"
      }), " + ", _jsx(_components.strong, {
        children: "无需 GC"
      })]
    }), _jsx(_components.h2, {
      id: "小结",
      children: _jsx(_components.a, {
        href: "#小结",
        children: "小结"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "所有权是 Rust 的核心特性"
      }), "\n", _jsxs(_components.li, {
        children: ["默认情况下，赋值和传参会", _jsx(_components.strong, {
          children: "移动"
        }), "所有权"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.code, {
          children: "Copy"
        }), " 类型会被", _jsx(_components.strong, {
          children: "复制"
        }), "而不是移动"]
      }), "\n", _jsxs(_components.li, {
        children: ["使用 ", _jsx(_components.code, {
          children: "clone()"
        }), " 可以显式深拷贝"]
      }), "\n", _jsx(_components.li, {
        children: "当所有者离开作用域，值会被自动释放"
      }), "\n"]
    }), _jsxs(_components.p, {
      children: ["下一步，我们将学习", _jsx(_components.strong, {
        children: "借用"
      }), "(Borrowing)，这是一种在不获取所有权的情况下使用值的方式。"]
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
