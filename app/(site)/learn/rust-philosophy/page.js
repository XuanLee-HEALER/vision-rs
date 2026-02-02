import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
export const metadata = {
  title: 'Rust 设计哲学 - Vision-RS',
  description:
    'Rust 的设计哲学围绕一个核心目标：在不牺牲性能的前提下，把"正确性"尽可能前置到编译期',
};
function _createMdxContent(props) {
  const _components = {
    a: 'a',
    blockquote: 'blockquote',
    h1: 'h1',
    h2: 'h2',
    li: 'li',
    p: 'p',
    strong: 'strong',
    ul: 'ul',
    ...props.components,
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx(_components.h1, {
        id: 'rust-设计哲学',
        children: _jsx(_components.a, {
          href: '#rust-设计哲学',
          children: 'Rust 设计哲学',
        }),
      }),
      '\n',
      _jsx(_components.p, {
        children:
          'Rust 的设计哲学围绕一个核心目标：在不牺牲性能的前提下，把"正确性"尽可能前置到编译期。它不追求隐藏复杂度，而是用类型系统与编译器约束，把内存安全、并发安全、资源管理等系统级问题变成可被验证的工程事实。',
      }),
      '\n',
      _jsx(_components.p, {
        children: '本章节聚焦语言层面的"规则与代价"：',
      }),
      '\n',
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '所有权 / 生命周期',
              }),
              '：资源与引用的可验证边界，决定了可用的表达方式与抽象形态',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '零成本抽象',
              }),
              '：把高层表达折叠成底层等价物，让"写得高级"和"跑得快"同时成立',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '内存安全 / 无 GC',
              }),
              '：不是独立主题，而是所有权模型与借用规则的"结果与目标"',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '错误处理',
              }),
              '：以类型承载分支与恢复路径，减少隐式控制流',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: '并发 vs 异步',
              }),
              '：并发是一种组织方式；异步是延迟与调度的一种手段——两者重叠但不等价',
            ],
          }),
          '\n',
        ],
      }),
      '\n',
      _jsx(_components.p, {
        children:
          '这里的重点不是"怎么用"，而是"为什么这样设计、代价是什么、换来了什么"。你会看到 Rust 的很多语法与限制，本质上都是在为"可预测的系统行为"付费。',
      }),
      '\n',
      _jsxs(_components.blockquote, {
        children: [
          '\n',
          _jsxs(_components.p, {
            children: [
              _jsx(_components.strong, {
                children: '阅读预期',
              }),
              '：本章节适合在你写大型 Rust 项目之前先完成一轮通读，以便后续遇到 borrow\nchecker / trait bounds / async 约束时能快速定位根因。',
            ],
          }),
          '\n',
        ],
      }),
      '\n',
      _jsx(_components.h2, {
        id: '鸣谢',
        children: _jsx(_components.a, {
          href: '#鸣谢',
          children: '鸣谢',
        }),
      }),
      '\n',
      _jsx(_components.p, {
        children:
          '感谢 Rust 官方团队、RFC 作者与编译器/标准库贡献者长期迭代语言模型与工具链；也感谢社区对所有权与异步模型的长期讨论与实践沉淀，使这些理念可以被工程化地传播与复用。',
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
