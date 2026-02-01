import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LearnLayout from '@/components/LearnLayout';
import MemoryLayout3D from '@/components/MemoryLayout3D';
import MermaidDiagram from '@/components/MermaidDiagram';
export const metadata = {
  title: '堆与栈 - Vision-RS',
  description: 'Rust 的堆栈内存管理',
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
        id: '堆与栈',
        children: _jsx(_components.a, {
          href: '#堆与栈',
          children: '堆与栈',
        }),
      }),
      _jsx(_components.p, {
        children: '理解堆（Heap）和栈（Stack）是掌握 Rust 内存管理的关键。',
      }),
      _jsx(_components.h2, {
        id: '栈stack',
        children: _jsx(_components.a, {
          href: '#栈stack',
          children: '栈（Stack）',
        }),
      }),
      _jsx(_components.p, {
        children: '栈是一种 LIFO（后进先出）的数据结构，用于存储局部变量和函数调用信息。',
      }),
      _jsx(_components.h3, {
        id: '栈的特点',
        children: _jsx(_components.a, {
          href: '#栈的特点',
          children: '栈的特点',
        }),
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              '⚡ ',
              _jsx(_components.strong, {
                children: '快速分配和释放',
              }),
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '📏 ',
              _jsx(_components.strong, {
                children: '大小固定',
              }),
              '，编译时确定',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '🔄 ',
              _jsx(_components.strong, {
                children: '自动管理',
              }),
              '，函数返回时自动清理',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '📦 ',
              _jsx(_components.strong, {
                children: '连续内存',
              }),
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.h3, {
        id: '栈上分配的数据',
        children: _jsx(_components.a, {
          href: '#栈上分配的数据',
          children: '栈上分配的数据',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;          // 栈上的 i32\n    let y = true;       // 栈上的 bool\n    let arr = [1, 2, 3];  // 栈上的数组\n\n    println!("{}, {}, {:?}", x, y, arr);\n}  // x, y, arr 离开作用域，自动释放\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '堆heap',
        children: _jsx(_components.a, {
          href: '#堆heap',
          children: '堆（Heap）',
        }),
      }),
      _jsx(_components.p, {
        children: '堆是一个大的内存池，用于动态大小的数据。',
      }),
      _jsx(_components.h3, {
        id: '堆的特点',
        children: _jsx(_components.a, {
          href: '#堆的特点',
          children: '堆的特点',
        }),
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              '🐌 ',
              _jsx(_components.strong, {
                children: '分配较慢',
              }),
              '（需要分配器）',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '📐 ',
              _jsx(_components.strong, {
                children: '大小动态',
              }),
              '，运行时确定',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '🔧 ',
              _jsx(_components.strong, {
                children: '手动管理',
              }),
              '（Rust 通过所有权自动化）',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '🗂️ ',
              _jsx(_components.strong, {
                children: '非连续内存',
              }),
            ],
          }),
          '\n',
        ],
      }),
      _jsx(_components.h3, {
        id: '堆上分配的数据',
        children: _jsx(_components.a, {
          href: '#堆上分配的数据',
          children: '堆上分配的数据',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let s = String::from("hello");  // 堆上的 String\n    let v = vec![1, 2, 3];          // 堆上的 Vec\n    let b = Box::new(5);            // 堆上的 Box\n\n    println!("{}, {:?}, {}", s, v, b);\n}  // s, v, b 离开作用域，堆内存被释放\n',
        }),
      }),
      _jsx(MemoryLayout3D, {
        scenario: 'heap',
      }),
      _jsx(_components.h2, {
        id: '栈与堆的对比',
        children: _jsx(_components.a, {
          href: '#栈与堆的对比',
          children: '栈与堆的对比',
        }),
      }),
      _jsx(MermaidDiagram, {
        chart: `
graph TD
  subgraph 栈
      A[函数调用] --> B[栈帧]
      B --> C[局部变量]
      B --> D[返回地址]
  end

  subgraph 堆
      E[动态分配] --> F[String]
      E --> G[Vec]
      E --> H[Box]
  end

  C -.指针.-> F
  C -.指针.-> G
  C -.指针.-> H

  style A fill:#8aadf4,stroke:#8aadf4,color:#24273a
  style E fill:#f5a97f,stroke:#f5a97f,color:#24273a

`,
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
                  children: '栈',
                }),
                _jsx(_components.th, {
                  children: '堆',
                }),
              ],
            }),
          }),
          _jsxs(_components.tbody, {
            children: [
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '速度',
                  }),
                  _jsx(_components.td, {
                    children: '快',
                  }),
                  _jsx(_components.td, {
                    children: '较慢',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '大小',
                  }),
                  _jsx(_components.td, {
                    children: '固定（编译时）',
                  }),
                  _jsx(_components.td, {
                    children: '动态（运行时）',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '管理',
                  }),
                  _jsx(_components.td, {
                    children: '自动',
                  }),
                  _jsx(_components.td, {
                    children: '手动（Rust 自动化）',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '生命周期',
                  }),
                  _jsx(_components.td, {
                    children: '作用域',
                  }),
                  _jsx(_components.td, {
                    children: '显式控制',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '典型用途',
                  }),
                  _jsx(_components.td, {
                    children: '局部变量',
                  }),
                  _jsx(_components.td, {
                    children: '大对象、动态大小',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx(_components.h2, {
        id: '栈帧',
        children: _jsx(_components.a, {
          href: '#栈帧',
          children: '栈帧',
        }),
      }),
      _jsx(_components.p, {
        children: '每次函数调用都会创建一个栈帧：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {           // main 的栈帧\n    let x = 5;\n    let y = foo(x);   // foo 的栈帧入栈\n    println!("{}", y);\n}                     // main 的栈帧出栈\n\nfn foo(n: i32) -> i32 {\n    let result = n * 2;\n    result\n}                     // foo 的栈帧出栈\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '栈帧包含',
          }),
          '：',
        ],
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsx(_components.li, {
            children: '局部变量',
          }),
          '\n',
          _jsx(_components.li, {
            children: '参数',
          }),
          '\n',
          _jsx(_components.li, {
            children: '返回地址',
          }),
          '\n',
          _jsx(_components.li, {
            children: '保存的寄存器',
          }),
          '\n',
        ],
      }),
      _jsx(_components.h2, {
        id: '栈溢出',
        children: _jsx(_components.a, {
          href: '#栈溢出',
          children: '栈溢出',
        }),
      }),
      _jsx(_components.p, {
        children: '栈空间有限（通常几 MB），递归过深会导致栈溢出：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn infinite_recursion() {\n    infinite_recursion();  // ⚠️ 栈溢出！\n}\n\n// 避免：使用迭代或尾递归优化\nfn safe_loop() {\n    let mut i = 0;\n    loop {\n        i += 1;\n        if i > 1000000 {\n            break;\n        }\n    }\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '何时使用堆',
        children: _jsx(_components.a, {
          href: '#何时使用堆',
          children: '何时使用堆',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '使用 ',
          _jsx(_components.code, {
            children: 'Box<T>',
          }),
          ' 将数据放在堆上：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    // 递归类型必须使用 Box（大小固定）\n    enum List {\n        Cons(i32, Box<List>),\n        Nil,\n    }\n\n    // 大对象放在堆上\n    let large_array = Box::new([0; 1000000]);\n\n    // 需要长生命周期的数据\n    let heap_data = Box::new(42);\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: 'string-vs-str',
        children: _jsx(_components.a, {
          href: '#string-vs-str',
          children: 'String vs &str',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    // &str：指向栈或静态内存的字符串切片\n    let s: &str = "hello";  // 字符串字面量（静态内存）\n\n    // String：堆分配的字符串\n    let mut s = String::from("hello");\n    s.push_str(", world");  // 可以增长\n\n    println!("{}", s);\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '内存布局',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          children:
            '栈：\n┌──────────────┐\n│  s: &str     │ → 静态内存中的 "hello"\n├──────────────┤\n│  s: String   │\n│  ├─ ptr ─────┼─→ 堆: "hello, world"\n│  ├─ len: 12  │\n│  └─ cap: 12  │\n└──────────────┘\n',
        }),
      }),
      _jsx(_components.h2, {
        id: 'vec-的内存布局',
        children: _jsx(_components.a, {
          href: '#vec-的内存布局',
          children: 'Vec 的内存布局',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let mut v = Vec::new();\n    v.push(1);\n    v.push(2);\n    v.push(3);\n\n    println!("长度: {}, 容量: {}", v.len(), v.capacity());\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '内存布局',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          children:
            '栈：\n┌──────────────┐\n│  v: Vec<i32> │\n│  ├─ ptr ─────┼─→ 堆: [1, 2, 3, _, _, ...]\n│  ├─ len: 3   │\n│  └─ cap: 8   │\n└──────────────┘\n',
        }),
      }),
      _jsx(_components.h2, {
        id: 'rc-和-arc',
        children: _jsx(_components.a, {
          href: '#rc-和-arc',
          children: 'Rc 和 Arc',
        }),
      }),
      _jsx(_components.p, {
        children: '多个所有者共享堆数据：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use std::rc::Rc;\n\nfn main() {\n    let a = Rc::new(5);\n    let b = Rc::clone(&a);  // 引用计数 +1\n    let c = Rc::clone(&a);  // 引用计数 +1\n\n    println!("引用计数: {}", Rc::strong_count(&a));  // 3\n}\n',
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
            '// 1. 优先使用栈（默认）\nfn process_number(x: i32) -> i32 {\n    x * 2\n}\n\n// 2. 大对象或动态大小使用堆\nfn create_large_buffer() -> Vec<u8> {\n    vec![0; 1000000]\n}\n\n// 3. 需要所有权转移的场景使用 Box\nfn create_node() -> Box<Node> {\n    Box::new(Node { value: 42, next: None })\n}\n\nstruct Node {\n    value: i32,\n    next: Option<Box<Node>>,\n}\n',
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
            '// ❌ 不必要的 Box\nfn bad() -> Box<i32> {\n    Box::new(42)  // i32 很小，没必要放堆上\n}\n\n// 更好：直接返回值\nfn good() -> i32 {\n    42\n}\n\n// ❌ 栈上分配过大的数组\nfn very_bad() {\n    let huge = [0; 10_000_000];  // 可能栈溢出\n}\n\n// 更好：使用 Vec\nfn better() {\n    let huge = vec![0; 10_000_000];  // 堆分配\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '性能考虑',
        children: _jsx(_components.a, {
          href: '#性能考虑',
          children: '性能考虑',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '栈分配',
          }),
          '：',
        ],
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsx(_components.li, {
            children: '⚡ 快速（只需移动栈指针）',
          }),
          '\n',
          _jsx(_components.li, {
            children: '🔄 缓存友好（局部性好）',
          }),
          '\n',
        ],
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '堆分配',
          }),
          '：',
        ],
      }),
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsx(_components.li, {
            children: '🐌 较慢（需要分配器查找空闲块）',
          }),
          '\n',
          _jsx(_components.li, {
            children: '💾 可能缓存未命中',
          }),
          '\n',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use std::time::Instant;\n\nfn main() {\n    let start = Instant::now();\n\n    // 栈分配（快）\n    for _ in 0..1_000_000 {\n        let _x = [0; 100];\n    }\n\n    println!("栈: {:?}", start.elapsed());\n\n    let start = Instant::now();\n\n    // 堆分配（慢）\n    for _ in 0..1_000_000 {\n        let _v = vec![0; 100];\n    }\n\n    println!("堆: {:?}", start.elapsed());\n}\n',
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
          _jsxs(_components.li, {
            children: [
              '✅ ',
              _jsx(_components.strong, {
                children: '栈',
              }),
              '：快速、固定大小、自动管理',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ ',
              _jsx(_components.strong, {
                children: '堆',
              }),
              '：灵活、动态大小、显式管理',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ Rust 通过',
              _jsx(_components.strong, {
                children: '所有权',
              }),
              '自动管理堆内存',
            ],
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 优先使用栈，必要时使用堆',
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ ',
              _jsx(_components.code, {
                children: 'Box',
              }),
              ', ',
              _jsx(_components.code, {
                children: 'Vec',
              }),
              ', ',
              _jsx(_components.code, {
                children: 'String',
              }),
              ' 等使用堆分配',
            ],
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 理解内存布局有助于优化性能',
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
