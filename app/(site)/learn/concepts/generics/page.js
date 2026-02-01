import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import LearnLayout from '@/components/LearnLayout';
export const metadata = {
  title: '泛型 - Vision-RS',
  description: 'Rust 的泛型编程',
};
function _createMdxContent(props) {
  const _components = {
    a: 'a',
    code: 'code',
    h1: 'h1',
    h2: 'h2',
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
        id: '泛型',
        children: _jsx(_components.a, {
          href: '#泛型',
          children: '泛型',
        }),
      }),
      _jsx(_components.p, {
        children: '泛型让我们编写可适用于多种类型的代码。',
      }),
      _jsx(_components.h2, {
        id: '泛型函数',
        children: _jsx(_components.a, {
          href: '#泛型函数',
          children: '泛型函数',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            "fn largest<T: PartialOrd>(list: &[T]) -> &T {\n    let mut largest = &list[0];\n\n    for item in list {\n        if item > largest {\n            largest = item;\n        }\n    }\n\n    largest\n}\n\nfn main() {\n    let numbers = vec![34, 50, 25, 100, 65];\n    let result = largest(&numbers);\n    println!(\"最大值: {}\", result);\n\n    let chars = vec!['y', 'm', 'a', 'q'];\n    let result = largest(&chars);\n    println!(\"最大字符: {}\", result);\n}\n",
        }),
      }),
      _jsx(_components.h2, {
        id: '泛型结构体',
        children: _jsx(_components.a, {
          href: '#泛型结构体',
          children: '泛型结构体',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'struct Point<T> {\n    x: T,\n    y: T,\n}\n\nimpl<T> Point<T> {\n    fn new(x: T, y: T) -> Self {\n        Point { x, y }\n    }\n\n    fn x(&self) -> &T {\n        &self.x\n    }\n}\n\n// 为特定类型实现方法\nimpl Point<f32> {\n    fn distance_from_origin(&self) -> f32 {\n        (self.x.powi(2) + self.y.powi(2)).sqrt()\n    }\n}\n\nfn main() {\n    let integer_point = Point::new(5, 10);\n    let float_point = Point::new(1.0, 4.0);\n\n    println!("距离原点: {}", float_point.distance_from_origin());\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '泛型枚举',
        children: _jsx(_components.a, {
          href: '#泛型枚举',
          children: '泛型枚举',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'enum Option<T> {\n    Some(T),\n    None,\n}\n\nenum Result<T, E> {\n    Ok(T),\n    Err(E),\n}\n\nfn main() {\n    let some_number: Option<i32> = Some(5);\n    let some_string: Option<String> = Some(String::from("hello"));\n    let absent: Option<i32> = None;\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '多个泛型参数',
        children: _jsx(_components.a, {
          href: '#多个泛型参数',
          children: '多个泛型参数',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'struct Point<T, U> {\n    x: T,\n    y: U,\n}\n\nfn main() {\n    let mixed = Point { x: 5, y: 4.0 };  // T=i32, U=f64\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '泛型约束',
        children: _jsx(_components.a, {
          href: '#泛型约束',
          children: '泛型约束',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'use std::fmt::Display;\n\nfn print_two<T: Display + Clone, U: Clone + Debug>(t: T, u: U) {\n    println!("{}", t);\n}\n\n// where 子句（更易读）\nfn print_two_where<T, U>(t: T, u: U)\nwhere\n    T: Display + Clone,\n    U: Clone + Debug,\n{\n    println!("{}", t);\n}\n',
        }),
      }),
      _jsx(_components.h2, {
        id: '单态化',
        children: _jsx(_components.a, {
          href: '#单态化',
          children: '单态化',
        }),
      }),
      _jsx(_components.p, {
        children: 'Rust 在编译时为每个具体类型生成专用代码：',
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'let integer = Some(5);   // 编译为 Option_i32\nlet float = Some(5.0);   // 编译为 Option_f64\n',
        }),
      }),
      _jsxs(_components.p, {
        children: [
          _jsx(_components.strong, {
            children: '零成本抽象',
          }),
          '：泛型没有运行时开销！',
        ],
      }),
      _jsx(_components.h2, {
        id: '关联类型',
        children: _jsx(_components.a, {
          href: '#关联类型',
          children: '关联类型',
        }),
      }),
      _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: 'language-rust',
          children:
            'trait Iterator {\n    type Item;  // 关联类型\n\n    fn next(&mut self) -> Option<Self::Item>;\n}\n\nstruct Counter {\n    count: u32,\n}\n\nimpl Iterator for Counter {\n    type Item = u32;\n\n    fn next(&mut self) -> Option<Self::Item> {\n        self.count += 1;\n        if self.count < 6 {\n            Some(self.count)\n        } else {\n            None\n        }\n    }\n}\n',
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
            children: '✅ 泛型提供代码复用',
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              '✅ 使用 ',
              _jsx(_components.code, {
                children: '<T>',
              }),
              ' 语法声明泛型类型',
            ],
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 可以对泛型添加 trait 约束',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 单态化保证零运行时开销',
          }),
          '\n',
          _jsx(_components.li, {
            children: '✅ 关联类型简化 trait 定义',
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
