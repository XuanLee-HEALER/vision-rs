export const metadata = {
  title: '网络编程 & 分布式 - Vision-RS',
  description: 'Rust 在网络编程和分布式系统中的应用与原理',
};

export default function NetworkIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <header className="mb-12 border-b border-overlay0/30 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-text">🌐 网络编程 & 分布式</h1>
        <p className="text-lg leading-relaxed text-subtext1">
          从底层网络协议到分布式系统设计，全面掌握 Rust 在网络领域的应用
        </p>
      </header>

      {/* Introduction */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">学习路径</h2>
        <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
          <ul className="space-y-3 text-subtext1">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>从 TCP/UDP 基础开始，理解网络编程的核心概念</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>掌握异步 I/O 和事件驱动编程模式</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>学习各种应用层协议的实现原理</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>深入分布式系统的共识算法和一致性保证</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>阅读经典分布式系统论文，理解理论基础</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Reference Links */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">参考资料</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://tokio.rs/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">Tokio</h3>
            <p className="text-sm text-subtext0">异步运行时和网络框架</p>
          </a>
          <a
            href="https://raft.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">Raft Consensus</h3>
            <p className="text-sm text-subtext0">分布式共识算法可视化</p>
          </a>
        </div>
      </section>

      {/* Content Sections */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-text">内容模块</h2>
        <div className="space-y-6">
          {/* 基础网络编程 */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">基础网络编程</h3>
            <p className="mb-4 text-sm text-subtext0">掌握 Rust 中的网络编程基础</p>
            <div className="space-y-2 text-sm text-subtext1">
              <div>• TCP/UDP Socket 编程：客户端/服务器实现</div>
              <div>• 异步 I/O 模型：epoll, kqueue, IOCP</div>
              <div>• Tokio 异步运行时：Task, Runtime, Executor</div>
              <div>• 网络协议实现：HTTP/1.1, HTTP/2, WebSocket</div>
            </div>
          </div>

          {/* 应用层协议 */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">应用层协议</h3>
            <p className="mb-4 text-sm text-subtext0">深入理解常用网络协议的设计和实现</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-surface1/50 p-3">
                <div className="mb-1 font-semibold text-text">HTTP/HTTPS</div>
                <div className="text-xs text-subtext0">请求响应模型、TLS/SSL</div>
              </div>
              <div className="rounded-md bg-surface1/50 p-3">
                <div className="mb-1 font-semibold text-text">gRPC</div>
                <div className="text-xs text-subtext0">Protobuf、流式传输</div>
              </div>
              <div className="rounded-md bg-surface1/50 p-3">
                <div className="mb-1 font-semibold text-text">WebSocket</div>
                <div className="text-xs text-subtext0">全双工通信、心跳机制</div>
              </div>
              <div className="rounded-md bg-surface1/50 p-3">
                <div className="mb-1 font-semibold text-text">QUIC</div>
                <div className="text-xs text-subtext0">基于 UDP 的传输协议</div>
              </div>
            </div>
          </div>

          {/* 分布式系统基础 */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">分布式系统基础</h3>
            <p className="mb-4 text-sm text-subtext0">理解分布式系统的核心概念和挑战</p>
            <div className="space-y-2 text-sm text-subtext1">
              <div>• CAP 定理与 BASE 理论</div>
              <div>• 分布式事务：2PC, 3PC, TCC, Saga</div>
              <div>• 共识算法：Raft, Paxos, Multi-Paxos</div>
              <div>• 时钟同步：NTP, Logical Clock, Vector Clock</div>
            </div>
          </div>

          {/* RPC 与服务治理 */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">RPC 与服务治理</h3>
            <p className="mb-4 text-sm text-subtext0">构建高可用的分布式服务</p>
            <div className="space-y-2 text-sm text-subtext1">
              <div>• RPC 框架设计：序列化、传输、协议</div>
              <div>• 服务发现：注册中心、健康检查</div>
              <div>• 负载均衡：轮询、加权、一致性哈希</div>
              <div>• 熔断降级：Circuit Breaker, Rate Limiting</div>
            </div>
          </div>

          {/* 消息队列 */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">消息队列</h3>
            <p className="mb-4 text-sm text-subtext0">异步解耦与可靠消息传递</p>
            <div className="space-y-2 text-sm text-subtext1">
              <div>• 消息队列原理：生产者-消费者模型</div>
              <div>• 可靠性保证：持久化、确认机制、重试</div>
              <div>• Kafka 架构：分区、副本、ISR</div>
              <div>• RabbitMQ/RocketMQ 特性对比</div>
            </div>
          </div>

          {/* 论文精读 */}
          <div className="rounded-lg border border-blue/30 bg-blue/10 p-6">
            <h3 className="mb-4 text-lg font-semibold text-blue">📚 经典论文精读</h3>
            <p className="mb-4 text-sm text-subtext0">阅读分布式系统领域的奠基性论文</p>
            <div className="space-y-2 text-sm text-subtext1">
              <div>• The Google File System (GFS)</div>
              <div>• MapReduce: Simplified Data Processing</div>
              <div>• Bigtable: A Distributed Storage System</div>
              <div>• Dynamo: Amazon's Highly Available Key-value Store</div>
              <div>• In Search of an Understandable Consensus Algorithm (Raft)</div>
              <div>• Time, Clocks, and the Ordering of Events (Lamport)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <div className="mt-12 rounded-lg border border-yellow/30 bg-yellow/10 p-6">
        <p className="text-sm text-yellow">📝 内容正在持续更新中...</p>
      </div>
    </div>
  );
}
