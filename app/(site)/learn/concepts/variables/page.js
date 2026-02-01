import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LearnLayout from '@/components/LearnLayout';
import MermaidDiagram from '@/components/MermaidDiagram';
export const metadata = {
  title: '变量与常量 - Vision-RS',
  description: 'Rust 中的变量绑定、可变性与常量',
};
function _createMdxContent(props) {
  const _components = {
    a: 'a',
    code: 'code',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    li: 'li',
    ol: 'ol',
    p: 'p',
    pre: 'pre',
    strong: 'strong',
    table: 'table',
    tbody: 'tbody',
    td: 'td',
    th: 'th',
    thead: 'thead',
    tr: 'tr',
    ul: 'ul',
    ...props.components,
  };
  return _jsxs(LearnLayout, {
    children: [
      _jsx(_components.h1, {
        id: '变量与常量',
        children: _jsx(_components.a, {
          href: '#变量与常量',
          children: '变量与常量',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '在 Rust 中，变量绑定默认是',
          _jsx(_components.strong, {
            children: '不可变的',
          }),
          '（immutable）。这是 Rust 安全性保证的基石之一。',
        ],
      }),
      _jsx(_components.h2, {
        id: '变量绑定',
        children: _jsx(_components.a, {
          href: '#变量绑定',
          children: '变量绑定',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '使用 ',
          _jsx(_components.code, {
            children: 'let',
          }),
          ' 关键字创建变量绑定：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children: 'fn main() {\n    let x = 5;\n    println!("x 的值是: {}", x);\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '不可变性immutability',
        children: _jsx(_components.a, {
          href: '#不可变性immutability',
          children: '不可变性（Immutability）',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '默认情况下，变量是',
          _jsx(_components.strong, {
            children: '不可变的',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;\n    // x = 6;  // ❌ 编译错误：cannot assign twice to immutable variable\n    println!("x = {}", x);\n}\n',
        }),
      }),
      _jsx(_components.h4, {
        id: '为什么默认不可变',
        children: _jsx(_components.a, {
          href: '#为什么默认不可变',
          children: '为什么默认不可变？',
        }),
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              '🔒 ',
              _jsx(_components.strong, {
                children: '安全性',
              }),
              ': 防止意外修改',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '🚀 ',
              _jsx(_components.strong, {
                children: '并发',
              }),
              ': 多线程环境下更安全',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '🧠 ',
              _jsx(_components.strong, {
                children: '可读性',
              }),
              ': 代码更容易理解',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '⚡ ',
              _jsx(_components.strong, {
                children: '优化',
              }),
              ': 编译器可以做更多优化',
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.h2, {
        id: '可变变量',
        children: _jsx(_components.a, {
          href: '#可变变量',
          children: '可变变量',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '使用 ',
          _jsx(_components.code, {
            children: 'mut',
          }),
          ' 关键字声明可变变量：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let mut x = 5;\n    println!("x 的初始值: {}", x);\n\n    x = 6;  // ✅ 可以修改\n    println!("x 的新值: {}", x);\n}\n',
        }),
      }),
      _jsx(MermaidDiagram, {
        chart: `
stateDiagram-v2
  [*] --> Immutable: let x = 5
  [*] --> Mutable: let mut x = 5

  Immutable --> [*]: 只能读取
  Mutable --> Modified: x = 6
  Modified --> [*]: 可以修改

  note right of Immutable
      默认不可变
      更安全
  end note

  note right of Mutable
      显式声明可变
      需要 mut 关键字
  end note

`,
      }),
      _jsx(_components.h2, {
        id: '变量遮蔽shadowing',
        children: _jsx(_components.a, {
          href: '#变量遮蔽shadowing',
          children: '变量遮蔽（Shadowing）',
        }),
      }),
      _jsx(_components.p, {
        children: 'Rust 允许用相同名称声明新变量，"遮蔽"旧变量：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;\n\n    let x = x + 1;  // 遮蔽：创建新变量\n\n    {\n        let x = x * 2;  // 内层作用域的遮蔽\n        println!("内层 x = {}", x);  // 12\n    }\n\n    println!("外层 x = {}", x);  // 6\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '遮蔽-vs-可变性',
        children: _jsx(_components.a, {
          href: '#遮蔽-vs-可变性',
          children: '遮蔽 vs 可变性',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '遮蔽的优势',
          }),
          '：',
        ],
      }),
      _jsxs(_components.ol, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '可以改变类型',
              }),
              '：',
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let spaces = "   ";           // &str 类型\n    let spaces = spaces.len();    // ✅ usize 类型，遮蔽允许改变类型\n\n    // 对比可变变量（不允许改变类型）：\n    let mut count = "   ";\n    // count = count.len();       // ❌ 编译错误：类型不匹配\n}\n',
        }),
      }),
      _jsxs(_components.ol, {
        start: '2',
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '保持不可变性',
              }),
              '：',
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;\n    let x = x + 1;  // 新的 x 仍然是不可变的\n    // x = 10;      // ❌ 不能修改\n}\n',
        }),
      }),
      _jsx(MermaidDiagram, {
        chart: `
graph TD
  A[let x = 5] --> B[第一个 x<br/>值: 5]
  B --> C[let x = x + 1]
  C --> D[第二个 x<br/>值: 6<br/>遮蔽第一个 x]
  D --> E[作用域结束]
  E --> F[第二个 x 被销毁]

  style B fill:#8aadf4,stroke:#8aadf4,color:#24273a
  style D fill:#a6da95,stroke:#a6da95,color:#24273a

`,
      }),
      _jsx(_components.h2, {
        id: '常量constants',
        children: _jsx(_components.a, {
          href: '#常量constants',
          children: '常量（Constants）',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '常量使用 ',
          _jsx(_components.code, {
            children: 'const',
          }),
          ' 关键字声明，并且',
          _jsx(_components.strong, {
            children: '必须',
          }),
          '标注类型：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'const MAX_POINTS: u32 = 100_000;\nconst PI: f64 = 3.14159;\n\nfn main() {\n    println!("最大点数: {}", MAX_POINTS);\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '常量的特点',
        children: _jsx(_components.a, {
          href: '#常量的特点',
          children: '常量的特点',
        }),
      }),
      _jsxs(_components.table, {
        children: [
          _jsx(_components.thead, {
            children: _jsxs(_components.tr, {
              children: [
                _jsx(_components.th, {
                  children: '特性',
                }),
                _jsx(_components.th, {
                  children: '常量',
                }),
                _jsx(_components.th, {
                  children: '不可变变量',
                }),
              ],
            }),
          }),
          _jsxs(_components.tbody, {
            children: [
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '关键字',
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.code, {
                      children: 'const',
                    }),
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.code, {
                      children: 'let',
                    }),
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '类型标注',
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.strong, {
                      children: '必须',
                    }),
                  }),
                  _jsx(_components.td, {
                    children: '可选（类型推导）',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '作用域',
                  }),
                  _jsxs(_components.td, {
                    children: [
                      '可以是',
                      _jsx(_components.strong, {
                        children: '全局',
                      }),
                    ],
                  }),
                  _jsx(_components.td, {
                    children: '通常是局部',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '值',
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.strong, {
                      children: '编译时确定',
                    }),
                  }),
                  _jsx(_components.td, {
                    children: '运行时确定',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '表达式',
                  }),
                  _jsxs(_components.td, {
                    children: [
                      '只能是',
                      _jsx(_components.strong, {
                        children: '常量表达式',
                      }),
                    ],
                  }),
                  _jsx(_components.td, {
                    children: '任意表达式',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '命名规范',
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.code, {
                      children: 'SCREAMING_SNAKE_CASE',
                    }),
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.code, {
                      children: 'snake_case',
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx(_components.h3, {
        id: '常量-vs-变量',
        children: _jsx(_components.a, {
          href: '#常量-vs-变量',
          children: '常量 vs 变量',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            '// ✅ 常量：编译时求值\nconst SECONDS_IN_HOUR: u32 = 60 * 60;\n\nfn main() {\n    // ✅ 不可变变量：运行时求值\n    let runtime_value = get_value();\n\n    // ❌ 常量不能使用运行时函数\n    // const WRONG: u32 = get_value();\n}\n\nfn get_value() -> u32 {\n    42\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '类型推导',
        children: _jsx(_components.a, {
          href: '#类型推导',
          children: '类型推导',
        }),
      }),
      _jsx(_components.p, {
        children: 'Rust 有强大的类型推导能力：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;           // 推导为 i32\n    let y = 2.0;         // 推导为 f64\n    let is_true = true;  // 推导为 bool\n\n    // 显式类型标注\n    let z: u64 = 100;\n\n    // 通过使用方式推导\n    let mut guess = String::new();\n    guess.push_str("42");\n    let guess: i32 = guess.trim().parse().expect("Not a number!");\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '数字分隔符',
        children: _jsx(_components.a, {
          href: '#数字分隔符',
          children: '数字分隔符',
        }),
      }),
      _jsx(_components.p, {
        children: '为了提高可读性，可以在数字中使用下划线：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let million = 1_000_000;\n    let hex = 0xff_ff_ff;\n    let binary = 0b1111_0000;\n    let float = 1_234.567_890;\n\n    println!("一百万: {}", million);\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '实践建议',
        children: _jsx(_components.a, {
          href: '#实践建议',
          children: '实践建议',
        }),
      }),
      _jsx(_components.h3, {
        id: '-推荐做法',
        children: _jsx(_components.a, {
          href: '#-推荐做法',
          children: '✅ 推荐做法',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    // 1. 默认使用不可变变量\n    let price = 100;\n\n    // 2. 只在需要时使用 mut\n    let mut count = 0;\n    count += 1;\n\n    // 3. 常量用于魔法数字\n    const TAX_RATE: f64 = 0.08;\n    let total = price as f64 * (1.0 + TAX_RATE);\n\n    // 4. 使用遮蔽改变类型\n    let input = "42";\n    let input: i32 = input.parse().unwrap();\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '-避免做法',
        children: _jsx(_components.a, {
          href: '#-避免做法',
          children: '❌ 避免做法',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    // ❌ 不必要的 mut\n    let mut x = 5;  // 如果后续不修改，不要用 mut\n    println!("{}", x);\n\n    // ❌ 魔法数字（应该用常量）\n    let tax = price * 0.08;  // 0.08 是什么？\n\n    // ❌ 过度使用遮蔽（可读性差）\n    let x = 1;\n    let x = x + 1;\n    let x = x * 2;\n    let x = x - 1;\n    // 太多遮蔽会让代码难以追踪\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '内存视角',
        children: _jsx(_components.a, {
          href: '#内存视角',
          children: '内存视角',
        }),
      }),
      _jsx(_components.p, {
        children: '变量绑定在内存中的表示：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x: i32 = 42;\n    let y: i32 = x;  // Copy trait: 栈上复制\n\n    println!("x = {}, y = {}", x, y);\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '栈上的布局',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          children:
            '栈内存：\n┌──────────┐\n│  x: 42   │  ← i32 在栈上，4 字节\n├──────────┤\n│  y: 42   │  ← 复制值，不是引用\n└──────────┘\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '练习题',
        children: _jsx(_components.a, {
          href: '#练习题',
          children: '练习题',
        }),
      }),
      _jsx(_components.h3, {
        id: '练习-1修复编译错误',
        children: _jsx(_components.a, {
          href: '#练习-1修复编译错误',
          children: '练习 1：修复编译错误',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;\n    x = 6;  // ❌ 编译错误\n    println!("{}", x);\n}\n',
        }),
      }),
      _jsxs('details', {
        children: [
          _jsx('summary', {
            children: '查看答案',
          }),
          _jsx(_components.pre, {
            children: _jsx(_components.code, {
              className: 'language-rust',
              children:
                'fn main() {\n    let mut x = 5;  // 添加 mut 关键字\n    x = 6;\n    println!("{}", x);\n}\n',
            }),
          }),
        ],
      }),
      _jsx(_components.h3, {
        id: '练习-2使用遮蔽',
        children: _jsx(_components.a, {
          href: '#练习-2使用遮蔽',
          children: '练习 2：使用遮蔽',
        }),
      }),
      _jsx(_components.p, {
        children: '将字符串转换为数字，使用遮蔽技术：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let guess = "42";\n    // 在这里将 guess 转换为数字（提示：使用遮蔽）\n}\n',
        }),
      }),
      _jsxs('details', {
        children: [
          _jsx('summary', {
            children: '查看答案',
          }),
          _jsx(_components.pre, {
            children: _jsx(_components.code, {
              className: 'language-rust',
              children:
                'fn main() {\n    let guess = "42";\n    let guess: i32 = guess.parse().expect("Not a number!");\n    println!("数字是: {}", guess);\n}\n',
            }),
          }),
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
          _jsxs(_components.li, {
            children: [
              '✅ Rust 中的变量默认',
              _jsx(_components.strong, {
                children: '不可变',
              }),
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ 使用 ',
              _jsx(_components.code, {
                children: 'mut',
              }),
              ' 关键字声明',
              _jsx(_components.strong, {
                children: '可变变量',
              }),
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ ',
              _jsx(_components.strong, {
                children: '遮蔽',
              }),
              '允许重新绑定变量，可以改变类型',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ ',
              _jsx(_components.strong, {
                children: '常量',
              }),
              '用 ',
              _jsx(_components.code, {
                children: 'const',
              }),
              ' 声明，必须标注类型，编译时求值',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ 不可变性带来',
              _jsx(_components.strong, {
                children: '安全性',
              }),
              '、',
              _jsx(_components.strong, {
                children: '并发性',
              }),
              '和',
              _jsx(_components.strong, {
                children: '优化',
              }),
              '优势',
            ],
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 优先使用不可变，只在必要时使用可变',
          }),
          '\n',
        ],
      }),
      _jsxs(_components.p, {
        children: [
          '下一步，我们将学习 Rust 的',
          _jsx(_components.strong, {
            children: '数据类型系统',
          }),
          '。',
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
