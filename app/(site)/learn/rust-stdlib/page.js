import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
export const metadata = {
  title: 'Rust 标准库 - Vision-RS',
  description: '标准库是 Rust 语言哲学的工程化落地：它不仅提供 API，更体现了"分层、边界、可移植性、性能与安全"的取舍'
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    code: "code",
    h1: "h1",
    h2: "h2",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      id: "rust-标准库",
      children: _jsx(_components.a, {
        href: "#rust-标准库",
        children: "Rust 标准库"
      })
    }), "\n", _jsx(_components.p, {
      children: "标准库是 Rust 语言哲学的工程化落地：它不仅提供 API，更体现了\"分层、边界、可移植性、性能与安全\"的取舍。理解标准库的结构和关键实现，有助于你在系统开发中做出更稳健的抽象与架构选择。"
    }), "\n", _jsx(_components.p, {
      children: "本章节主要关注三个方向："
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "分层结构"
        }), "：", _jsx(_components.code, {
          children: "core / alloc / std"
        }), "\n的职责边界与依赖方向，解释 Rust 如何同时覆盖嵌入式与通用操作系统环境"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "内存管理主线"
        }), "：分配、Drop、引用计数、所有权转移在标准库中的具体落点（强调机制而非\"怎么调用 API\"）"]
      }), "\n", _jsxs(_components.li, {
        children: [_jsx(_components.strong, {
          children: "并发原语主线"
        }), "：互斥、读写锁、原子操作的语义与实现边界，理解线程安全的最小构件"]
      }), "\n"]
    }), "\n", _jsxs(_components.p, {
      children: ["本章节", _jsx(_components.strong, {
        children: "刻意弱化 I/O 的精读"
      }), "：I/O 子系统往往更依赖 OS 与平台差异，适合在你构建网络/存储系统时按需深入；而标准库分层、内存、并发原语则更像\"地基\"，值得提前深挖并建立长期记忆。"]
    }), "\n", _jsxs(_components.blockquote, {
      children: ["\n", _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "阅读预期"
        }), "：读完本章节，你应该能够回答：\"我现在写的这段 Rust 代码，在标准库层面到底依赖了什么？它的边界与代价是什么？\""]
      }), "\n"]
    }), "\n", _jsx(_components.h2, {
      id: "鸣谢",
      children: _jsx(_components.a, {
        href: "#鸣谢",
        children: "鸣谢"
      })
    }), "\n", _jsx(_components.p, {
      children: "感谢标准库团队在稳定性与演进之间保持长期克制；也感谢众多性能与正确性相关的贡献者，使标准库在可维护性和工程强度上保持高水位。"
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
