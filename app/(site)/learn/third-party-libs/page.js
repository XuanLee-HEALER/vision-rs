import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
export const metadata = {
  title: '第三方库解析 - Vision-RS',
  description:
    'Rust 生态的强项在于：许多核心能力并不强行塞进标准库，而是通过高质量第三方库先行探索',
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
        id: '第三方库解析',
        children: _jsx(_components.a, {
          href: '#第三方库解析',
          children: '第三方库解析',
        }),
      }),
      '\n',
      _jsx(_components.p, {
        children:
          'Rust 生态的强项在于：许多核心能力并不强行塞进标准库，而是通过高质量第三方库先行探索，再由实践反哺语言与工具链。理解这些库的设计理念与实现机制，能帮助你在架构层面做出正确选型，并避免"只会用，不会解释"的黑箱状态。',
      }),
      '\n',
      _jsx(_components.p, {
        children: '本章节将把第三方库当作"范式样本"来解剖：',
      }),
      '\n',
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'Tokio',
              }),
              '：异步运行时的调度与 I/O 模型，如何把 Future 推进到完成，以及工程上的可观测性与可控性',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'Serde',
              }),
              '：序列化框架如何利用类型系统与宏生成实现"静态绑定 + 高性能"的数据转换',
            ],
          }),
          '\n',
          _jsxs(_components.li, {
            children: [
              _jsx(_components.strong, {
                children: 'std::future / Future 生态',
              }),
              '：Future\ntrait 的语义边界与运行时解耦方式，解释生态为何能并存多运行时',
            ],
          }),
          '\n',
        ],
      }),
      '\n',
      _jsx(_components.p, {
        children:
          '这部分的目标不是列清单，而是梳理"生态为何这样形成、库为何这样分层、这些选择对项目意味着什么"。',
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
              '：读完本章节，你应该能把"异步/序列化"从功能点提升为架构层能力：知道它们的边界、风险与性能模型。',
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
          '感谢 Tokio 与 Serde 等核心库维护者持续投入，也感谢 Rust 社区对异步模型、宏与类型系统边界的长期打磨与讨论。',
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
