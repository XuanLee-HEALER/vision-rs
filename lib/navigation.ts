export interface NavItem {
  title: string;
  href: string;
}

export interface NavSubsection {
  name: string;
  items: NavItem[];
}

export interface NavSection {
  title: string;
  icon: string;
  items?: NavItem[];
  subsections?: NavSubsection[];
}

export const navigationData: NavSection[] = [
  {
    title: "语言概念",
    icon: "🔤",
    items: [
      { title: "变量与常量", href: "/learn/concepts/variables" },
      { title: "数据类型", href: "/learn/concepts/types" },
      { title: "所有权系统", href: "/learn/concepts/ownership" },
      { title: "借用与引用", href: "/learn/concepts/borrowing" },
      { title: "生命周期", href: "/learn/concepts/lifetimes" },
      { title: "模式匹配", href: "/learn/concepts/pattern-matching" },
      { title: "泛型", href: "/learn/concepts/generics" },
      { title: "Trait", href: "/learn/concepts/traits" },
      { title: "错误处理", href: "/learn/concepts/error-handling" },
      { title: "宏系统", href: "/learn/concepts/macros" },
      { title: "内存布局", href: "/learn/concepts/memory-layout" },
      { title: "堆与栈", href: "/learn/concepts/heap-stack" },
    ],
  },
  {
    title: "数据结构",
    icon: "📦",
    subsections: [
      {
        name: "标准库提供",
        items: [
          { title: "Vec<T>", href: "/learn/data-structures/vec" },
          { title: "HashMap<K, V>", href: "/learn/data-structures/hashmap" },
          { title: "HashSet<T>", href: "/learn/data-structures/hashset" },
          { title: "BTreeMap/BTreeSet", href: "/learn/data-structures/btree" },
          { title: "String & str", href: "/learn/data-structures/string" },
          { title: "Option<T>", href: "/learn/data-structures/option" },
          { title: "Result<T, E>", href: "/learn/data-structures/result" },
          { title: "Box<T>", href: "/learn/data-structures/box" },
          { title: "Rc<T> / Arc<T>", href: "/learn/data-structures/rc-arc" },
          { title: "RefCell<T>", href: "/learn/data-structures/refcell" },
          { title: "Cow<T>", href: "/learn/data-structures/cow" },
        ],
      },
      {
        name: "自定义实现",
        items: [
          { title: "链表实现", href: "/learn/data-structures/linked-list" },
          { title: "二叉树实现", href: "/learn/data-structures/binary-tree" },
          { title: "图结构实现", href: "/learn/data-structures/graph" },
          { title: "LRU Cache", href: "/learn/data-structures/lru-cache" },
          { title: "Trie 树", href: "/learn/data-structures/trie" },
          { title: "跳表", href: "/learn/data-structures/skip-list" },
        ],
      },
    ],
  },
  {
    title: "三方库原理",
    icon: "🔧",
    items: [
      { title: "Tokio - 异步运行时", href: "/learn/crates/tokio" },
      { title: "Serde - 序列化框架", href: "/learn/crates/serde" },
      { title: "Actix - Web 框架", href: "/learn/crates/actix" },
      { title: "Rayon - 并行计算", href: "/learn/crates/rayon" },
      { title: "Diesel - ORM", href: "/learn/crates/diesel" },
      { title: "Axum - Web 框架", href: "/learn/crates/axum" },
      { title: "async-std", href: "/learn/crates/async-std" },
      { title: "crossbeam - 并发工具", href: "/learn/crates/crossbeam" },
    ],
  },
  {
    title: "网络编程 & 分布式",
    icon: "🌐",
    items: [
      { title: "TCP/UDP 编程", href: "/learn/network/tcp-udp" },
      { title: "HTTP 协议实现", href: "/learn/network/http" },
      { title: "WebSocket", href: "/learn/network/websocket" },
      { title: "gRPC", href: "/learn/network/grpc" },
      { title: "共识算法（Raft/Paxos）", href: "/learn/distributed/consensus" },
      { title: "分布式事务", href: "/learn/distributed/transactions" },
      { title: "消息队列", href: "/learn/distributed/message-queue" },
      { title: "负载均衡", href: "/learn/distributed/load-balancing" },
      { title: "RPC 框架设计", href: "/learn/distributed/rpc" },
      { title: "论文精读系列", href: "/learn/distributed/papers" },
    ],
  },
];
