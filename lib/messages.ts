import { get } from '@vercel/edge-config';

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
 * Get all messages from Edge Config
 */
async function getAllMessagesFromEdgeConfig(): Promise<Message[]> {
  try {
    const data = await get<Message[]>('messages');
    return data || [];
  } catch (error) {
    console.error('Error reading messages from Edge Config:', error);
    return [];
  }
}

/**
 * Get rate limit records from Edge Config
 */
async function getRateLimitRecordsFromEdgeConfig(): Promise<Record<string, RateLimitRecord>> {
  try {
    const data = await get<Record<string, RateLimitRecord>>('messageLimits');
    return data || {};
  } catch (error) {
    console.error('Error reading rate limits from Edge Config:', error);
    return {};
  }
}

/**
 * Update Edge Config via Vercel API
 */
async function updateEdgeConfigViaAPI(
  key: string,
  value: Message[] | Record<string, RateLimitRecord>
): Promise<void> {
  const edgeConfigId = process.env.EDGE_CONFIG?.match(/ecfg_[a-z0-9]+/)?.[0];
  const token = process.env.VERCEL_API_TOKEN;

  if (!edgeConfigId || !token) {
    throw new Error(
      'Missing EDGE_CONFIG or VERCEL_API_TOKEN. Cannot update Edge Config without these credentials.'
    );
  }

  const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'upsert',
          key,
          value,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update Edge Config: ${error}`);
  }
}

/**
 * Get recent messages (latest 7)
 */
export async function getRecentMessages(): Promise<Omit<Message, 'ip'>[]> {
  const messages = await getAllMessagesFromEdgeConfig();
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
  const rateLimits = await getRateLimitRecordsFromEdgeConfig();
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
 * Add a new message
 */
export async function addMessage(content: string, ip: string): Promise<Message> {
  const messages = await getAllMessagesFromEdgeConfig();
  const rateLimits = await getRateLimitRecordsFromEdgeConfig();

  const newMessage: Message = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    timestamp: Date.now(),
    ip,
  };

  // Add new message at the beginning
  const updatedMessages = [newMessage, ...messages].slice(0, 100); // Keep only latest 100

  // Update rate limit
  rateLimits[ip] = {
    lastMessageTime: Date.now(),
  };

  // Update both messages and rate limits
  await updateEdgeConfigViaAPI('messages', updatedMessages);
  await updateEdgeConfigViaAPI('messageLimits', rateLimits);

  return newMessage;
}

/**
 * Delete a message (admin only)
 */
export async function deleteMessage(id: string): Promise<void> {
  const messages = await getAllMessagesFromEdgeConfig();
  const updatedMessages = messages.filter((msg) => msg.id !== id);
  await updateEdgeConfigViaAPI('messages', updatedMessages);
}
