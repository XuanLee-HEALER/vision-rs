import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
import LifetimeAnimation from '@/components/LifetimeAnimation';
import MermaidDiagram from '@/components/MermaidDiagram';
export const metadata = {
  title: '生命周期 - Vision-RS',
  description: 'Rust 的生命周期注解与生命周期规则'
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return _jsxs(LearnLayout, {
    children: [_jsx(_components.h1, {
      id: "生命周期",
      children: _jsx(_components.a, {
        href: "#生命周期",
        children: "生命周期"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "生命周期"
      }), "（Lifetime）是 Rust 中引用保持有效的作用域。"]
    }), _jsx(_components.h2, {
      id: "为什么需要生命周期",
      children: _jsx(_components.a, {
        href: "#为什么需要生命周期",
        children: "为什么需要生命周期？"
      })
    }), _jsxs(_components.p, {
      children: ["生命周期防止", _jsx(_components.strong, {
        children: "悬垂引用"
      }), "（dangling references）："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    let r;                // ---------+-- 'a\n                          //          |\n    {                     //          |\n        let x = 5;        // -+-- 'b  |\n        r = &x;           //  |       |\n    }                     // -+       |\n                          //          |\n    println!(\"r: {}\", r); //          |  ❌ 编译错误！\n}                         // ---------+\n"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "错误原因"
      }), "：", _jsx(_components.code, {
        children: "x"
      }), " 的生命周期 'b 比 ", _jsx(_components.code, {
        children: "r"
      }), " 的生命周期 'a 短，当尝试使用 ", _jsx(_components.code, {
        children: "r"
      }), " 时，", _jsx(_components.code, {
        children: "x"
      }), "\n已被释放。"]
    }), _jsx(LifetimeAnimation, {}), _jsx(_components.h2, {
      id: "生命周期注解语法",
      children: _jsx(_components.a, {
        href: "#生命周期注解语法",
        children: "生命周期注解语法"
      })
    }), _jsxs(_components.p, {
      children: ["生命周期注解使用", _jsx(_components.strong, {
        children: "单引号"
      }), "开头，通常使用小写字母："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "&i32        // 普通引用\n&'a i32     // 带有显式生命周期的引用\n&'a mut i32 // 带有显式生命周期的可变引用\n"
      })
    }), _jsx(_components.h3, {
      id: "函数中的生命周期",
      children: _jsx(_components.a, {
        href: "#函数中的生命周期",
        children: "函数中的生命周期"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() {\n        x\n    } else {\n        y\n    }\n}\n\nfn main() {\n    let string1 = String::from(\"abcd\");\n    let string2 = \"xyz\";\n\n    let result = longest(string1.as_str(), string2);\n    println!(\"最长的字符串是: {}\", result);\n}\n"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "含义"
      }), "：返回值的生命周期与参数中生命周期", _jsx(_components.strong, {
        children: "较短的"
      }), "那个相同。"]
    }), _jsx(MermaidDiagram, {
      chart: `
sequenceDiagram
  participant Main
  participant longest
  participant x
  participant y

  Main->>longest: 调用 longest(x, y)
  longest->>x: 检查 x.len()
  longest->>y: 检查 y.len()
  longest->>Main: 返回引用（生命周期 = min(x, y)）

  note over longest: 返回值生命周期<br/>取决于较短的输入

`
    }), _jsx(_components.h2, {
      id: "生命周期省略规则",
      children: _jsx(_components.a, {
        href: "#生命周期省略规则",
        children: "生命周期省略规则"
      })
    }), _jsx(_components.p, {
      children: "编译器可以在某些情况下自动推导生命周期，无需显式标注。"
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "三条省略规则"
      }), "："]
    }), _jsxs(_components.ol, {
      children: ["\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "规则 1"
        }), "：每个引用参数都有自己的生命周期"]
      }), "\n"]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn foo(x: &i32)  // 实际是 fn foo<'a>(x: &'a i32)\n"
      })
    }), _jsxs(_components.ol, {
      start: "2",
      children: ["\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "规则 2"
        }), "：如果只有一个输入生命周期，赋予所有输出"]
      }), "\n"]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn foo(x: &i32) -> &i32  // 实际是 fn foo<'a>(x: &'a i32) -> &'a i32\n"
      })
    }), _jsxs(_components.ol, {
      start: "3",
      children: ["\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "规则 3"
        }), "：如果有 ", _jsx(_components.code, {
          children: "&self"
        }), " 或 ", _jsx(_components.code, {
          children: "&mut self"
        }), "，返回值的生命周期是 ", _jsx(_components.code, {
          children: "self"
        }), "\n的生命周期"]
      }), "\n"]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "impl MyStruct {\n    fn get_data(&self) -> &str {  // 返回值生命周期等于 self\n        &self.data\n    }\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "需要显式标注的情况",
      children: _jsx(_components.a, {
        href: "#需要显式标注的情况",
        children: "需要显式标注的情况"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn longest(x: &str, y: &str) -> &str {  // ❌ 编译错误：无法推导返回值生命周期\n    if x.len() > y.len() { x } else { y }\n}\n\n// 修复：显式标注\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {  // ✅\n    if x.len() > y.len() { x } else { y }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "结构体中的生命周期",
      children: _jsx(_components.a, {
        href: "#结构体中的生命周期",
        children: "结构体中的生命周期"
      })
    }), _jsx(_components.p, {
      children: "结构体包含引用时，需要生命周期注解："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct ImportantExcerpt<'a> {\n    part: &'a str,\n}\n\nfn main() {\n    let novel = String::from(\"Call me Ishmael. Some years ago...\");\n    let first_sentence = novel.split('.').next().expect(\"找不到 '.'\");\n\n    let excerpt = ImportantExcerpt {\n        part: first_sentence,\n    };\n\n    println!(\"{}\", excerpt.part);\n}\n"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "含义"
      }), "：", _jsx(_components.code, {
        children: "ImportantExcerpt"
      }), " 实例的生命周期不能超过 ", _jsx(_components.code, {
        children: "part"
      }), " 字段引用的数据。"]
    }), _jsx(_components.h2, {
      id: "方法中的生命周期",
      children: _jsx(_components.a, {
        href: "#方法中的生命周期",
        children: "方法中的生命周期"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "impl<'a> ImportantExcerpt<'a> {\n    fn level(&self) -> i32 {  // 省略规则 3：返回值生命周期来自 self\n        3\n    }\n\n    fn announce_and_return_part(&self, announcement: &str) -> &str {\n        println!(\"请注意: {}\", announcement);\n        self.part  // 返回值生命周期来自 self\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "静态生命周期",
      children: _jsx(_components.a, {
        href: "#静态生命周期",
        children: "静态生命周期"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.code, {
        children: "'static"
      }), " 生命周期表示整个程序运行期间："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "let s: &'static str = \"我有一个静态生命周期\";  // 字符串字面量\n"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "字符串字面量"
      }), "默认是 ", _jsx(_components.code, {
        children: "'static"
      }), "，因为它们被存储在程序的二进制文件中。"]
    }), _jsxs(_components.p, {
      children: [_jsxs(_components.strong, {
        children: ["谨慎使用 ", _jsx(_components.code, {
          children: "'static"
        })]
      }), "："]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// ❌ 不推荐：过度使用 'static\nfn get_str() -> &'static str {\n    \"hello\"\n}\n\n// ✅ 更好：返回 String（有所有权）\nfn get_string() -> String {\n    String::from(\"hello\")\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "生命周期约束",
      children: _jsx(_components.a, {
        href: "#生命周期约束",
        children: "生命周期约束"
      })
    }), _jsx(_components.p, {
      children: "可以指定生命周期之间的关系："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn longest_with_constraint<'a, 'b: 'a>(x: &'a str, y: &'b str) -> &'a str {\n    // 'b: 'a 表示 'b 的生命周期至少与 'a 一样长\n    x\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "多个生命周期参数",
      children: _jsx(_components.a, {
        href: "#多个生命周期参数",
        children: "多个生命周期参数"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn compare<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {\n    x  // 只能返回 x，不能返回 y（生命周期不同）\n}\n\nfn main() {\n    let str1 = String::from(\"long string is long\");\n    let result;\n    {\n        let str2 = String::from(\"xyz\");\n        result = compare(str1.as_str(), str2.as_str());\n    }  // str2 被释放，但不影响 result（它来自 str1）\n\n    println!(\"{}\", result);  // ✅ 正常工作\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "生命周期与泛型",
      children: _jsx(_components.a, {
        href: "#生命周期与泛型",
        children: "生命周期与泛型"
      })
    }), _jsx(_components.p, {
      children: "结合泛型和生命周期："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use std::fmt::Display;\n\nfn longest_with_announcement<'a, T>(\n    x: &'a str,\n    y: &'a str,\n    ann: T,\n) -> &'a str\nwhere\n    T: Display,\n{\n    println!(\"公告！{}\", ann);\n    if x.len() > y.len() {\n        x\n    } else {\n        y\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "实践示例",
      children: _jsx(_components.a, {
        href: "#实践示例",
        children: "实践示例"
      })
    }), _jsx(_components.h3, {
      id: "示例-1解析配置",
      children: _jsx(_components.a, {
        href: "#示例-1解析配置",
        children: "示例 1：解析配置"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct Config<'a> {\n    host: &'a str,\n    port: u16,\n}\n\nimpl<'a> Config<'a> {\n    fn new(host: &'a str, port: u16) -> Self {\n        Config { host, port }\n    }\n\n    fn connection_string(&self) -> String {\n        format!(\"{}:{}\", self.host, self.port)\n    }\n}\n\nfn main() {\n    let host = String::from(\"localhost\");\n    let config = Config::new(&host, 8080);\n\n    println!(\"连接到: {}\", config.connection_string());\n}  // host 和 config 同时被释放，生命周期正确\n"
      })
    }), _jsx(_components.h3, {
      id: "示例-2迭代器实现",
      children: _jsx(_components.a, {
        href: "#示例-2迭代器实现",
        children: "示例 2：迭代器实现"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct StrSplit<'a> {\n    remainder: &'a str,\n    delimiter: &'a str,\n}\n\nimpl<'a> StrSplit<'a> {\n    fn new(haystack: &'a str, delimiter: &'a str) -> Self {\n        StrSplit {\n            remainder: haystack,\n            delimiter,\n        }\n    }\n}\n\nimpl<'a> Iterator for StrSplit<'a> {\n    type Item = &'a str;\n\n    fn next(&mut self) -> Option<Self::Item> {\n        if let Some(next_delim) = self.remainder.find(self.delimiter) {\n            let until_delimiter = &self.remainder[..next_delim];\n            self.remainder = &self.remainder[next_delim + self.delimiter.len()..];\n            Some(until_delimiter)\n        } else if self.remainder.is_empty() {\n            None\n        } else {\n            let rest = self.remainder;\n            self.remainder = \"\";\n            Some(rest)\n        }\n    }\n}\n\nfn main() {\n    let haystack = \"a,b,c\";\n    let letters: Vec<_> = StrSplit::new(haystack, \",\").collect();\n    println!(\"{:?}\", letters);  // [\"a\", \"b\", \"c\"]\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "常见错误与修复",
      children: _jsx(_components.a, {
        href: "#常见错误与修复",
        children: "常见错误与修复"
      })
    }), _jsx(_components.h3, {
      id: "错误-1返回值生命周期不明确",
      children: _jsx(_components.a, {
        href: "#错误-1返回值生命周期不明确",
        children: "错误 1：返回值生命周期不明确"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn longest(x: &str, y: &str) -> &str {  // ❌ 编译错误\n    if x.len() > y.len() { x } else { y }\n}\n\n// 修复：添加生命周期注解\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {  // ✅\n    if x.len() > y.len() { x } else { y }\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "错误-2返回局部变量的引用",
      children: _jsx(_components.a, {
        href: "#错误-2返回局部变量的引用",
        children: "错误 2：返回局部变量的引用"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn get_str() -> &str {  // ❌ 编译错误\n    let s = String::from(\"hello\");\n    &s  // s 在函数结束时被释放\n}\n\n// 修复：返回 String（转移所有权）\nfn get_string() -> String {  // ✅\n    String::from(\"hello\")\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "错误-3结构体缺少生命周期注解",
      children: _jsx(_components.a, {
        href: "#错误-3结构体缺少生命周期注解",
        children: "错误 3：结构体缺少生命周期注解"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct Excerpt {\n    part: &str,  // ❌ 编译错误：缺少生命周期\n}\n\n// 修复：添加生命周期\nstruct Excerpt<'a> {\n    part: &'a str,  // ✅\n}\n"
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
        children: "// 1. 优先使用生命周期省略规则\nfn first_word(s: &str) -> &str {  // 自动推导\n    &s[..1]\n}\n\n// 2. 只在必要时显式标注\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\n// 3. 使用有意义的生命周期名称\nfn parse_config<'cfg>(input: &'cfg str) -> Config<'cfg> {\n    // 'cfg 比 'a 更具描述性\n    Config { data: input }\n}\n\nstruct Config<'cfg> {\n    data: &'cfg str,\n}\n"
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
        children: "// ❌ 过度使用 'static\nfn get_data() -> &'static str {\n    \"data\"  // 只有在确实是全局常量时才使用\n}\n\n// ❌ 不必要的复杂生命周期\nfn simple<'a, 'b, 'c>(x: &'a str, y: &'b str) -> &'c str {\n    // 如果可以简化，就简化\n    x\n}\n\n// ❌ 返回局部变量的引用\nfn bad() -> &str {\n    let s = String::from(\"bad\");\n    &s  // 悬垂引用\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "练习题",
      children: _jsx(_components.a, {
        href: "#练习题",
        children: "练习题"
      })
    }), _jsx(_components.h3, {
      id: "练习-1修复生命周期错误",
      children: _jsx(_components.a, {
        href: "#练习-1修复生命周期错误",
        children: "练习 1：修复生命周期错误"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn longest(x: &str, y: &str) -> &str {\n    if x.len() > y.len() { x } else { y }\n}\n"
      })
    }), _jsxs("details", {
      children: [_jsx("summary", {
        children: "查看答案"
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n"
        })
      })]
    }), _jsx(_components.h3, {
      id: "练习-2结构体生命周期",
      children: _jsx(_components.a, {
        href: "#练习-2结构体生命周期",
        children: "练习 2：结构体生命周期"
      })
    }), _jsx(_components.p, {
      children: "实现一个包含字符串切片的结构体："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct Book {\n    title: &str,\n    author: &str,\n}\n"
      })
    }), _jsxs("details", {
      children: [_jsx("summary", {
        children: "查看答案"
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "struct Book<'a> {\n    title: &'a str,\n    author: &'a str,\n}\n\nfn main() {\n    let title = String::from(\"Rust Programming\");\n    let author = String::from(\"Graydon Hoare\");\n\n    let book = Book {\n        title: &title,\n        author: &author,\n    };\n\n    println!(\"{} by {}\", book.title, book.author);\n}\n"
        })
      })]
    }), _jsx(_components.h2, {
      id: "小结",
      children: _jsx(_components.a, {
        href: "#小结",
        children: "小结"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.strong, {
          children: "生命周期"
        }), "确保引用始终有效"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ 使用 ", _jsx(_components.code, {
          children: "'a"
        }), " 语法标注生命周期"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ 编译器可以通过", _jsx(_components.strong, {
          children: "省略规则"
        }), "自动推导生命周期"]
      }), "\n", _jsx(_components.li, {
        children: "✅ 结构体包含引用时需要生命周期注解"
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "'static"
        }), " 表示整个程序生命周期"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ 生命周期在", _jsx(_components.strong, {
          children: "编译时"
        }), "检查，", _jsx(_components.strong, {
          children: "零运行时开销"
        })]
      }), "\n"]
    }), _jsxs(_components.p, {
      children: ["下一步，我们将学习", _jsx(_components.strong, {
        children: "模式匹配"
      }), "。"]
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
