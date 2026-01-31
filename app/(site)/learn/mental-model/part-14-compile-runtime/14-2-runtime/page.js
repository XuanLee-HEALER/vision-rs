import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
export const metadata = {
  title: '14.2 哪些问题刻意留在运行期',
  description: 'Part 14 · 编译期 vs 运行期的最终分界 - 14.2 哪些问题刻意留在运行期',
  part: 'Part 14 · 编译期 vs 运行期的最终分界',
  chapter_id: '14-2'
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    code: "code",
    h1: "h1",
    h2: "h2",
    hr: "hr",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    ul: "ul",
    ...props.components
  };
  return _jsxs(LearnLayout, {
    children: [_jsx(_components.h1, {
      id: "142-哪些问题刻意留在运行期",
      children: _jsx(_components.a, {
        href: "#142-哪些问题刻意留在运行期",
        children: "14.2 哪些问题刻意留在运行期"
      })
    }), _jsx(_components.h2, {
      id: "文字叙述",
      children: _jsx(_components.a, {
        href: "#文字叙述",
        children: "文字叙述"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "主要概念解释"
      }), "\n"]
    }), _jsx(_components.p, {
      children: "本节将深入探讨相关概念的核心要义。"
    }), _jsx(_components.h2, {
      id: "图形表示",
      children: _jsx(_components.a, {
        href: "#图形表示",
        children: "图形表示"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "图表与示意图"
      }), "\n"]
    }), _jsx(_components.p, {
      children: "（此处应包含精心设计的示意图，帮助读者建立直观的理解）"
    }), _jsx(_components.h2, {
      id: "动画演示",
      children: _jsx(_components.a, {
        href: "#动画演示",
        children: "动画演示"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "状态变化与推导过程（如适用）"
      }), "\n"]
    }), _jsx(_components.p, {
      children: "（通过动态演示展示概念的演变过程）"
    }), _jsx(_components.h2, {
      id: "代码示例",
      children: _jsx(_components.a, {
        href: "#代码示例",
        children: "代码示例"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "最小但可推理的代码"
      }), "\n"]
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// 示例代码\nfn example() {\n    // TODO: 补充具体实现\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "应用场景",
      children: _jsx(_components.a, {
        href: "#应用场景",
        children: "应用场景"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "实际应用"
      }), "\n"]
    }), _jsx(_components.p, {
      children: "本节探讨的概念在实际开发中的应用场景包括："
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "场景一"
      }), "\n", _jsx(_components.li, {
        children: "场景二"
      }), "\n", _jsx(_components.li, {
        children: "场景三"
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "总结",
      children: _jsx(_components.a, {
        href: "#总结",
        children: "总结"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "关键要点"
      }), "\n"]
    }), _jsx(_components.p, {
      children: "本章核心要点："
    }), _jsxs(_components.ol, {
      children: ["\n", _jsx(_components.li, {
        children: "要点一"
      }), "\n", _jsx(_components.li, {
        children: "要点二"
      }), "\n", _jsx(_components.li, {
        children: "要点三"
      }), "\n"]
    }), _jsx(_components.hr, {}), _jsx(_components.h2, {
      id: "我的理解",
      children: _jsx(_components.a, {
        href: "#我的理解",
        children: "我的理解"
      })
    }), _jsxs(_components.blockquote, {
      children: ["\n", _jsx(_components.p, {
        children: "此部分可通过管理后台编辑"
      }), "\n"]
    }), _jsx(_components.p, {
      children: "（在这里记录你的个人理解、心得体会和延伸思考）"
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
