import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
import TraitRelationship from '@/components/TraitRelationship';
export const metadata = {
  title: 'Trait - Vision-RS',
  description: 'Rust 的 Trait 系统'
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
      id: "trait",
      children: _jsx(_components.a, {
        href: "#trait",
        children: "Trait"
      })
    }), _jsx(_components.p, {
      children: "Trait 类似于其他语言中的接口（interface），定义共享行为。"
    }), _jsx(_components.h2, {
      id: "定义-trait",
      children: _jsx(_components.a, {
        href: "#定义-trait",
        children: "定义 Trait"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "pub trait Summary {\n    fn summarize(&self) -> String;\n}\n\npub struct NewsArticle {\n    pub headline: String,\n    pub content: String,\n}\n\nimpl Summary for NewsArticle {\n    fn summarize(&self) -> String {\n        format!(\"{}: {}\", self.headline, self.content)\n    }\n}\n\nfn main() {\n    let article = NewsArticle {\n        headline: String::from(\"重大新闻\"),\n        content: String::from(\"内容详情\"),\n    };\n\n    println!(\"{}\", article.summarize());\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "默认实现",
      children: _jsx(_components.a, {
        href: "#默认实现",
        children: "默认实现"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "pub trait Summary {\n    fn summarize(&self) -> String {\n        String::from(\"（阅读更多...）\")  // 默认实现\n    }\n}\n\nimpl Summary for NewsArticle {}  // 使用默认实现\n"
      })
    }), _jsx(_components.h2, {
      id: "trait-作为参数",
      children: _jsx(_components.a, {
        href: "#trait-作为参数",
        children: "Trait 作为参数"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// impl Trait 语法\npub fn notify(item: &impl Summary) {\n    println!(\"快讯！{}\", item.summarize());\n}\n\n// Trait bound 语法（更灵活）\npub fn notify<T: Summary>(item: &T) {\n    println!(\"快讯！{}\", item.summarize());\n}\n\n// 多个 trait 约束\npub fn notify<T: Summary + Display>(item: &T) {\n    // ...\n}\n\n// where 子句\npub fn notify<T>(item: &T)\nwhere\n    T: Summary + Display,\n{\n    // ...\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "返回实现-trait-的类型",
      children: _jsx(_components.a, {
        href: "#返回实现-trait-的类型",
        children: "返回实现 Trait 的类型"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn returns_summarizable() -> impl Summary {\n    NewsArticle {\n        headline: String::from(\"标题\"),\n        content: String::from(\"内容\"),\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "trait-关系可视化",
      children: _jsx(_components.a, {
        href: "#trait-关系可视化",
        children: "Trait 关系可视化"
      })
    }), _jsx(TraitRelationship, {}), _jsx(_components.h2, {
      id: "孤儿规则",
      children: _jsx(_components.a, {
        href: "#孤儿规则",
        children: "孤儿规则"
      })
    }), _jsx(_components.p, {
      children: "只有当 trait 或类型至少有一个在本地 crate 时，才能为类型实现 trait："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// ✅ 可以：为本地类型实现标准库 trait\nimpl Display for MyStruct { }\n\n// ✅ 可以：为标准库类型实现本地 trait\nimpl MyTrait for Vec<i32> { }\n\n// ❌ 不可以：为外部类型实现外部 trait\nimpl Display for Vec<i32> { }  // 编译错误\n"
      })
    }), _jsx(_components.h2, {
      id: "标准库常用-trait",
      children: _jsx(_components.a, {
        href: "#标准库常用-trait",
        children: "标准库常用 Trait"
      })
    }), _jsx(_components.h3, {
      id: "clone-和-copy",
      children: _jsx(_components.a, {
        href: "#clone-和-copy",
        children: "Clone 和 Copy"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "#[derive(Clone, Copy)]\nstruct Point {\n    x: i32,\n    y: i32,\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "debug-和-display",
      children: _jsx(_components.a, {
        href: "#debug-和-display",
        children: "Debug 和 Display"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "#[derive(Debug)]\nstruct Point {\n    x: i32,\n    y: i32,\n}\n\nuse std::fmt;\n\nimpl fmt::Display for Point {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, \"({}, {})\", self.x, self.y)\n    }\n}\n"
      })
    }), _jsx(_components.h3, {
      id: "partialeq-和-eq",
      children: _jsx(_components.a, {
        href: "#partialeq-和-eq",
        children: "PartialEq 和 Eq"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "#[derive(PartialEq, Eq)]\nstruct Point {\n    x: i32,\n    y: i32,\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "trait-对象",
      children: _jsx(_components.a, {
        href: "#trait-对象",
        children: "Trait 对象"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "pub trait Draw {\n    fn draw(&self);\n}\n\npub struct Screen {\n    pub components: Vec<Box<dyn Draw>>,  // Trait 对象\n}\n\nimpl Screen {\n    pub fn run(&self) {\n        for component in self.components.iter() {\n            component.draw();\n        }\n    }\n}\n"
      })
    }), _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "静态分发 vs 动态分发"
      }), "："]
    }), _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: [_jsx(_components.code, {
          children: "impl Trait"
        }), "：静态分发，编译时确定，零开销"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.code, {
          children: "dyn Trait"
        }), "：动态分发，运行时确定，有虚表开销"]
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "关联类型",
      children: _jsx(_components.a, {
        href: "#关联类型",
        children: "关联类型"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "pub trait Iterator {\n    type Item;  // 关联类型\n\n    fn next(&mut self) -> Option<Self::Item>;\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "trait-继承",
      children: _jsx(_components.a, {
        href: "#trait-继承",
        children: "Trait 继承"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "trait OutlinePrint: fmt::Display {\n    fn outline_print(&self) {\n        println!(\"* {} *\", self);  // 可以使用 Display 的 to_string\n    }\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "小结",
      children: _jsx(_components.a, {
        href: "#小结",
        children: "小结"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "✅ Trait 定义共享行为"
      }), "\n", _jsx(_components.li, {
        children: "✅ 可以有默认实现"
      }), "\n", _jsxs(_components.li, {
        children: ["✅ 使用 ", _jsx(_components.code, {
          children: "impl Trait"
        }), " 或 Trait bound 作为参数"]
      }), "\n", _jsxs(_components.li, {
        children: ["✅ ", _jsx(_components.code, {
          children: "dyn Trait"
        }), " 实现动态分发"]
      }), "\n", _jsx(_components.li, {
        children: "✅ 孤儿规则防止冲突"
      }), "\n", _jsx(_components.li, {
        children: "✅ 标准库提供了许多常用 Trait"
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
