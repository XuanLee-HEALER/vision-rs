import { getVersionedData, atomicUpdate } from './storage';

/**
 * Edge Config storage structure for messages
 *
 * Key: "messages"
 * Value: Message[]
 */

export interface Message {
  id: string;
  content: string;
  timestamp: number;
  ip: string;
}

export interface RateLimitRecord {
  lastMessageTime: number;
}

/**
 * Get all messages from storage (reads from versioned storage)
 */
async function getAllMessages(): Promise<Message[]> {
  const data = await getVersionedData<Message[]>('messages');
  return data || [];
}

/**
 * Get rate limit records from storage (reads from versioned storage)
 */
async function getRateLimitRecords(): Promise<Record<string, RateLimitRecord>> {
  const data = await getVersionedData<Record<string, RateLimitRecord>>('messageLimits');
  return data || {};
}

/**
 * Get recent messages (latest 7)
 */
export async function getRecentMessages(): Promise<Omit<Message, 'ip'>[]> {
  const messages = await getAllMessages();
  // Return latest 7 messages without IP info
  return messages
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 7)
    .map(({ id, content, timestamp }) => ({ id, content, timestamp }));
}

/**
 * Check rate limit for an IP
 */
export async function checkRateLimit(
  ip: string,
  limitHours: number = 6
): Promise<{ allowed: boolean; remainingTime?: number }> {
  const rateLimits = await getRateLimitRecords();
  const record = rateLimits[ip];

  if (!record) {
    return { allowed: true };
  }

  const limitMs = limitHours * 60 * 60 * 1000;
  const timeSinceLastMessage = Date.now() - record.lastMessageTime;

  if (timeSinceLastMessage < limitMs) {
    return {
      allowed: false,
      remainingTime: limitMs - timeSinceLastMessage,
    };
  }

  return { allowed: true };
}

/**
 * Add a new message (使用原子更新防止并发冲突)
 */
export async function addMessage(content: string, ip: string): Promise<Message> {
  const newMessage: Message = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    timestamp: Date.now(),
    ip,
  };

  // 原子更新消息列表
  await atomicUpdate<Message[]>('messages', (current) => {
    const messages = current || [];
    return [newMessage, ...messages].slice(0, 100); // Keep only latest 100
  });

  // 原子更新频率限制
  await atomicUpdate<Record<string, RateLimitRecord>>('messageLimits', (current) => {
    const rateLimits = current || {};
    rateLimits[ip] = {
      lastMessageTime: Date.now(),
    };
    return rateLimits;
  });

  return newMessage;
}

/**
 * Delete a message (admin only, 使用原子更新保持版本化存储一致性)
 */
export async function deleteMessage(id: string): Promise<void> {
  await atomicUpdate<Message[]>('messages', (current) => {
    const messages = current || [];
    return messages.filter((msg) => msg.id !== id);
  });
}
