import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
export const metadata = {
  title: '分布式系统 - Vision-RS',
  description: '分布式系统是"在不确定性中建立确定性"的工程',
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
        id: '分布式系统',
        children: _jsx(_components.a, {
          href: '#分布式系统',
          children: '分布式系统',
        }),
      }),
      '\n',
      _jsx(_components.p, {
        children:
          '分布式系统是"在不确定性中建立确定性"的工程。它要求你处理网络分区、时钟偏差、部分失败、重复执行、状态收敛等问题——这些问题不会因为语言安全就自动消失，但 Rust 能让你把关键的不变式与资源边界更明确地表达出来，减少"隐式共享"和"不可控副作用"。',
      }),
      '\n',
      _jsx(_components.p, {
        children: '本章节将以"机制优先"的方式组织内容：',
      }),
      '\n',
      _jsxs(_components.ul, {
        children: [
          '\n',
          _jsx(_components.li, {
            children: '一致性与复制：日志、状态机、选主、仲裁、收敛路径',
          }),
          '\n',
          _jsx(_components.li, {
            children: '可靠性与可运维性：幂等、重试、超时、补偿、观测与回放',
          }),
          '\n',
          _jsx(_components.li, {
            children: '工程权衡：CAP/PACELC 的现实语境下如何做取舍与分层',
          }),
          '\n',
        ],
      }),
      '\n',
      _jsx(_components.p, {
        children:
          '这里强调"可解释的系统行为"：你不仅要让系统工作，还要能回答它在异常情况下会怎样、为什么这样。',
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
              '：读完本章节，你应该能把分布式问题拆成明确的机制与边界，并能落在代码与运行策略上。',
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
          '感谢分布式系统领域的经典论文与实践系统（数据库、共识、消息系统、存储系统）的长期经验积累；也感谢 Rust 社区在可靠系统、异步与并发基础设施方面的持续投入。',
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
