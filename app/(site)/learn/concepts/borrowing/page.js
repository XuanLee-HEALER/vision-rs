import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LearnLayout from '@/components/LearnLayout';
import BorrowChecker from '@/components/BorrowChecker';
import Mermaid from '@/components/MermaidDiagram';
export const metadata = {
  title: '借用与引用 - Vision-RS',
  description: 'Rust 的借用机制与引用规则',
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
        id: '借用与引用',
        children: _jsx(_components.a, {
          href: '#借用与引用',
          children: '借用与引用',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '借用',
          }),
          '（Borrowing）是 Rust 中在',
          _jsx(_components.strong, {
            children: '不获取所有权',
          }),
          '的情况下访问数据的机制。',
        ],
      }),
      _jsx(_components.h2, {
        id: '引用',
        children: _jsx(_components.a, {
          href: '#引用',
          children: '引用',
        }),
      }),
      _jsx(_components.p, {
        children: '引用允许你引用某个值而不取得其所有权：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let s1 = String::from("hello");\n\n    let len = calculate_length(&s1);  // 借用 s1\n\n    println!("\'{}\' 的长度是 {}", s1, len);  // ✅ s1 仍然有效\n}\n\nfn calculate_length(s: &String) -> usize {\n    s.len()\n}  // s 离开作用域，但不释放数据（因为没有所有权）\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.code, {
            children: '&s1',
          }),
          ' 创建一个',
          _jsx(_components.strong, {
            children: '指向',
          }),
          ' ',
          _jsx(_components.code, {
            children: 's1',
          }),
          ' 的引用，但',
          _jsx(_components.strong, {
            children: '不拥有',
          }),
          '它。',
        ],
      }),
      _jsx(Mermaid, {
        chart: `
graph LR
  A[main 函数] -->|创建| B[s1: String]
  A -->|传递 &s1| C[calculate_length 函数]
  C -->|接收引用 s| B
  C -->|返回 len| A

  style B fill:#8aadf4,stroke:#8aadf4,color:#24273a
  style C fill:#a6da95,stroke:#a6da95,color:#24273a

`,
      }),
      _jsx(_components.h3, {
        id: '引用不可变',
        children: _jsx(_components.a, {
          href: '#引用不可变',
          children: '引用不可变',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '默认情况下，引用是',
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
            'fn main() {\n    let s = String::from("hello");\n\n    change(&s);\n}\n\nfn change(some_string: &String) {\n    // some_string.push_str(", world");  // ❌ 编译错误：不能修改引用的值\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '可变引用',
        children: _jsx(_components.a, {
          href: '#可变引用',
          children: '可变引用',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '使用 ',
          _jsx(_components.code, {
            children: '&mut',
          }),
          ' 创建',
          _jsx(_components.strong, {
            children: '可变引用',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let mut s = String::from("hello");\n\n    change(&mut s);  // 传递可变引用\n\n    println!("{}", s);  // "hello, world"\n}\n\nfn change(some_string: &mut String) {\n    some_string.push_str(", world");  // ✅ 可以修改\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '可变引用的限制',
        children: _jsx(_components.a, {
          href: '#可变引用的限制',
          children: '可变引用的限制',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '同一时间，同一作用域内，只能有一个可变引用',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let mut s = String::from("hello");\n\n    let r1 = &mut s;\n    // let r2 = &mut s;  // ❌ 编译错误：不能同时有两个可变引用\n\n    println!("{}", r1);\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '好处',
          }),
          '：防止',
          _jsx(_components.strong, {
            children: '数据竞争',
          }),
          '（data race）。',
        ],
      }),
      _jsx(_components.h3, {
        id: '不能同时存在可变和不可变引用',
        children: _jsx(_components.a, {
          href: '#不能同时存在可变和不可变引用',
          children: '不能同时存在可变和不可变引用',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let mut s = String::from("hello");\n\n    let r1 = &s;      // ✅ 不可变引用\n    let r2 = &s;      // ✅ 多个不可变引用是允许的\n    // let r3 = &mut s;  // ❌ 不能在存在不可变引用时创建可变引用\n\n    println!("{} and {}", r1, r2);\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '借用检查器可视化',
        children: _jsx(_components.a, {
          href: '#借用检查器可视化',
          children: '借用检查器可视化',
        }),
      }),
      _jsx(BorrowChecker, {}),
      _jsx(_components.h2, {
        id: '引用的作用域',
        children: _jsx(_components.a, {
          href: '#引用的作用域',
          children: '引用的作用域',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '引用的作用域从声明开始，持续到',
          _jsx(_components.strong, {
            children: '最后一次使用',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let mut s = String::from("hello");\n\n    let r1 = &s;\n    let r2 = &s;\n    println!("{} and {}", r1, r2);\n    // r1 和 r2 的作用域在这里结束（最后一次使用）\n\n    let r3 = &mut s;  // ✅ 可以创建可变引用\n    println!("{}", r3);\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '这个特性叫做',
          _jsx(_components.strong, {
            children: '非词法作用域生命周期',
          }),
          '（Non-Lexical Lifetimes, NLL）。',
        ],
      }),
      _jsx(_components.h2, {
        id: '悬垂引用',
        children: _jsx(_components.a, {
          href: '#悬垂引用',
          children: '悬垂引用',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          'Rust 编译器保证引用',
          _jsx(_components.strong, {
            children: '永远不会',
          }),
          '成为悬垂引用（dangling reference）：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let reference_to_nothing = dangle();\n}\n\nfn dangle() -> &String {  // ❌ 编译错误\n    let s = String::from("hello");\n    &s\n}  // s 离开作用域被释放，返回的引用指向无效内存\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '修复方法',
          }),
          '：返回所有权而不是引用：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let string = no_dangle();\n}\n\nfn no_dangle() -> String {  // ✅ 正确\n    let s = String::from("hello");\n    s  // 移动所有权\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '借用规则总结',
        children: _jsx(_components.a, {
          href: '#借用规则总结',
          children: '借用规则总结',
        }),
      }),
      _jsx(Mermaid, {
        chart: `
graph TD
  A[借用规则] --> B[规则 1]
  A --> C[规则 2]
  A --> D[规则 3]

  B[任意时刻<br/>只能有以下之一]
  C[一个可变引用]
  D[任意数量不可变引用]

  B --> E[✅ 一个 &mut T]
  B --> F[✅ 多个 &T]
  B --> G[❌ 混合 &mut T 和 &T]

  style E fill:#a6da95,stroke:#a6da95,color:#24273a
  style F fill:#a6da95,stroke:#a6da95,color:#24273a
  style G fill:#ed8796,stroke:#ed8796,color:#24273a

`,
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '三大规则',
          }),
          '：',
        ],
      }),
      _jsxs(_components.ol, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              '在任意给定时间，',
              _jsx(_components.strong, {
                children: '要么',
              }),
              '只能有一个可变引用，',
              _jsx(_components.strong, {
                children: '要么',
              }),
              '只能有多个不可变引用',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '引用必须',
              _jsx(_components.strong, {
                children: '总是有效的',
              }),
              '（不能悬垂）',
            ],
          }),
          '\n',
          _jsx(_components.li, {
            children: '引用的生命周期不能超过被引用数据的生命周期',
          }),
          '\n',
        ],
      }),
      _jsx(_components.h2, {
        id: '引用与解引用',
        children: _jsx(_components.a, {
          href: '#引用与解引用',
          children: '引用与解引用',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '使用 ',
          _jsx(_components.code, {
            children: '*',
          }),
          ' 解引用：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;\n    let y = &x;\n\n    assert_eq!(5, x);\n    assert_eq!(5, *y);  // 解引用 y 获取值\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '自动解引用',
          }),
          '：',
        ],
      }),
      _jsx(_components.p, {
        children: 'Rust 在某些情况下会自动解引用（如方法调用）：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let s = String::from("hello");\n    let len = s.len();  // 自动解引用\n\n    let r = &s;\n    let len = r.len();  // 自动解引用 r，调用 String 的 len 方法\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '多重引用',
        children: _jsx(_components.a, {
          href: '#多重引用',
          children: '多重引用',
        }),
      }),
      _jsx(_components.p, {
        children: '可以创建引用的引用：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;\n    let y = &x;      // &i32\n    let z = &y;      // &&i32\n\n    assert_eq!(5, **z);  // 两次解引用\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '切片slice',
        children: _jsx(_components.a, {
          href: '#切片slice',
          children: '切片（Slice）',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          '切片是一种',
          _jsx(_components.strong, {
            children: '特殊的引用',
          }),
          '，引用集合的连续序列：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let s = String::from("hello world");\n\n    let hello = &s[0..5];    // "hello"\n    let world = &s[6..11];   // "world"\n\n    // 简写\n    let hello = &s[..5];     // 等同于 &s[0..5]\n    let world = &s[6..];     // 等同于 &s[6..11]\n    let whole = &s[..];      // 整个字符串\n\n    println!("{}", hello);\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '字符串字面量就是切片',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let s: &str = "Hello, world!";  // &str 是字符串切片类型\n}\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '数组切片',
          }),
          '：',
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let a = [1, 2, 3, 4, 5];\n    let slice: &[i32] = &a[1..3];  // [2, 3]\n    assert_eq!(slice, &[2, 3]);\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '实践示例',
        children: _jsx(_components.a, {
          href: '#实践示例',
          children: '实践示例',
        }),
      }),
      _jsx(_components.h3, {
        id: '示例-1安全的字符串分割',
        children: _jsx(_components.a, {
          href: '#示例-1安全的字符串分割',
          children: '示例 1：安全的字符串分割',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn first_word(s: &String) -> &str {\n    let bytes = s.as_bytes();\n\n    for (i, &item) in bytes.iter().enumerate() {\n        if item == b\' \' {\n            return &s[0..i];\n        }\n    }\n\n    &s[..]\n}\n\nfn main() {\n    let mut s = String::from("hello world");\n    let word = first_word(&s);  // 不可变借用\n\n    // s.clear();  // ❌ 编译错误：不能在存在不可变借用时修改\n    println!("第一个单词: {}", word);\n}\n',
        }),
      }),
      _jsx(_components.h3, {
        id: '示例-2可变引用传递',
        children: _jsx(_components.a, {
          href: '#示例-2可变引用传递',
          children: '示例 2：可变引用传递',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn append_exclamation(s: &mut String) {\n    s.push(\'!\');\n}\n\nfn main() {\n    let mut greeting = String::from("Hello");\n    append_exclamation(&mut greeting);\n    println!("{}", greeting);  // "Hello!"\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '引用的内存表示',
        children: _jsx(_components.a, {
          href: '#引用的内存表示',
          children: '引用的内存表示',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x: i32 = 42;\n    let r: &i32 = &x;\n\n    println!("x 的地址: {:p}", &x);\n    println!("r 的值（地址）: {:p}", r);\n    println!("r 解引用的值: {}", *r);\n}\n',
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
            '栈内存：\n┌──────────────┐\n│  x: 42       │  ← i32，4 字节\n├──────────────┤\n│  r: 0x...    │  ← 引用（指针），8 字节（64 位系统）\n│  │           │\n│  └──> 指向 x\n└──────────────┘\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '智能指针-vs-引用',
        children: _jsx(_components.a, {
          href: '#智能指针-vs-引用',
          children: '智能指针 vs 引用',
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
                _jsxs(_components.th, {
                  children: [
                    '引用 ',
                    _jsx(_components.code, {
                      children: '&T',
                    }),
                  ],
                }),
                _jsxs(_components.th, {
                  children: [
                    '智能指针 ',
                    _jsx(_components.code, {
                      children: 'Box<T>',
                    }),
                  ],
                }),
              ],
            }),
          }),
          _jsxs(_components.tbody, {
            children: [
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '所有权',
                  }),
                  _jsx(_components.td, {
                    children: '无',
                  }),
                  _jsx(_components.td, {
                    children: '有',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '解引用',
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.code, {
                      children: '*r',
                    }),
                  }),
                  _jsx(_components.td, {
                    children: _jsx(_components.code, {
                      children: '*b',
                    }),
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '实现',
                  }),
                  _jsx(_components.td, {
                    children: '简单指针',
                  }),
                  _jsx(_components.td, {
                    children: '堆分配 + Drop',
                  }),
                ],
              }),
              _jsxs(_components.tr, {
                children: [
                  _jsx(_components.td, {
                    children: '大小',
                  }),
                  _jsx(_components.td, {
                    children: '指针大小',
                  }),
                  _jsx(_components.td, {
                    children: '指针大小（指向堆）',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let x = 5;\n    let r = &x;       // 引用\n    let b = Box::new(x);  // 智能指针（堆分配）\n\n    println!("r: {}", *r);\n    println!("b: {}", *b);\n}\n',
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
            'fn main() {\n    let s = String::from("hello");\n\n    // 1. 优先使用不可变引用\n    print_string(&s);\n\n    // 2. 只在需要时使用可变引用\n    let mut s = s;\n    modify_string(&mut s);\n\n    // 3. 使用切片而不是索引\n    let word = first_word(&s);  // 返回 &str\n}\n\nfn print_string(s: &String) {\n    println!("{}", s);\n}\n\nfn modify_string(s: &mut String) {\n    s.push_str(", world");\n}\n\nfn first_word(s: &String) -> &str {\n    // 返回切片而不是索引\n    &s[..]\n}\n',
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
            'fn main() {\n    let mut s = String::from("hello");\n\n    // ❌ 创建不必要的可变引用\n    let r1 = &mut s;\n    let r2 = &mut s;  // 编译错误\n\n    // ❌ 返回局部变量的引用\n    let bad_ref = create_dangling();\n}\n\nfn create_dangling() -> &String {  // ❌ 悬垂引用\n    let s = String::from("hello");\n    &s  // s 在函数结束时被释放\n}\n',
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
        id: '练习-1修复借用错误',
        children: _jsx(_components.a, {
          href: '#练习-1修复借用错误',
          children: '练习 1：修复借用错误',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn main() {\n    let mut s = String::from("hello");\n    let r1 = &s;\n    let r2 = &mut s;\n    println!("{}, {}", r1, r2);\n}\n',
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
                'fn main() {\n    let mut s = String::from("hello");\n    let r1 = &s;\n    println!("{}", r1);  // r1 的作用域结束\n\n    let r2 = &mut s;  // 现在可以创建可变引用\n    println!("{}", r2);\n}\n',
            }),
          }),
        ],
      }),
      _jsx(_components.h3, {
        id: '练习-2实现字符串反转',
        children: _jsx(_components.a, {
          href: '#练习-2实现字符串反转',
          children: '练习 2：实现字符串反转',
        }),
      }),
      _jsx(_components.p, {
        children: '使用引用实现字符串反转：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'fn reverse_string(s: &mut String) {\n    // 实现反转\n}\n\nfn main() {\n    let mut s = String::from("hello");\n    reverse_string(&mut s);\n    println!("{}", s);  // "olleh"\n}\n',
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
                'fn reverse_string(s: &mut String) {\n    *s = s.chars().rev().collect();\n}\n\nfn main() {\n    let mut s = String::from("hello");\n    reverse_string(&mut s);\n    println!("{}", s);  // "olleh"\n}\n',
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
              '✅ ',
              _jsx(_components.strong, {
                children: '引用',
              }),
              '允许访问数据而不获取所有权',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ ',
              _jsx(_components.code, {
                children: '&T',
              }),
              ' 是不可变引用，',
              _jsx(_components.code, {
                children: '&mut T',
              }),
              ' 是可变引用',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ 同一时间只能有',
              _jsx(_components.strong, {
                children: '一个可变引用',
              }),
              '或',
              _jsx(_components.strong, {
                children: '多个不可变引用',
              }),
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ 引用必须',
              _jsx(_components.strong, {
                children: '总是有效',
              }),
              '，不会悬垂',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ ',
              _jsx(_components.strong, {
                children: '切片',
              }),
              '是特殊的引用类型',
            ],
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ Rust 的借用检查器在编译时保证内存安全',
          }),
          '\n',
        ],
      }),
      _jsxs(_components.p, {
        children: [
          '下一步，我们将学习',
          _jsx(_components.strong, {
            children: '生命周期',
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
