import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
export const metadata = {
  title: '数据结构 - Vision-RS',
  description: '数据结构是性能与可维护性之间的共同语言。在 Rust 中，数据结构不仅是算法载体，更与所有权、借用、内存布局、可变性边界深度绑定'
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
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
      id: "数据结构",
      children: _jsx(_components.a, {
        href: "#数据结构",
        children: "数据结构"
      })
    }), "\n", _jsx(_components.p, {
      children: "数据结构是性能与可维护性之间的共同语言。在 Rust 中，数据结构不仅是算法载体，更与所有权、借用、内存布局、可变性边界深度绑定：很多\"写法限制\"其实就是\"结构不变式\"的护栏。"
    }), "\n", _jsx(_components.p, {
      children: "本章节的定位是：以工程视角建立\"结构—代价—语义\"的长期映射。"
    }), "\n", _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "关注结构在内存中的布局与生命周期边界，而不仅是接口"
      }), "\n", _jsx(_components.li, {
        children: "关注可变性与共享方式（独占/共享、内部可变性）的实现代价"
      }), "\n", _jsx(_components.li, {
        children: "关注在真实项目中如何选择结构来匹配吞吐、延迟与可维护性目标"
      }), "\n"]
    }), "\n", _jsx(_components.p, {
      children: "在这里，你会更频繁地看到\"为什么选择这种结构\"而不是\"怎么把代码跑起来\"。最终目标是让你能在面对具体场景时，做出可解释、可复用的结构选择。"
    }), "\n", _jsxs(_components.blockquote, {
      children: ["\n", _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "阅读预期"
        }), "：读完本章节，你应该能为关键数据结构的选型写出可审计的理由，而不是凭经验拍脑袋。"]
      }), "\n"]
    }), "\n", _jsx(_components.h2, {
      id: "鸣谢",
      children: _jsx(_components.a, {
        href: "#鸣谢",
        children: "鸣谢"
      })
    }), "\n", _jsx(_components.p, {
      children: "感谢算法与系统领域的经典理论积累，也感谢 Rust 社区围绕内存布局、unsafe 封装与性能边界形成的工程共识与实践样本。"
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
