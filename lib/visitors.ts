import { get } from '@vercel/edge-config';

/**
 * Edge Config storage structure for visitor stats
 *
 * Key: "visitors"
 * Value: Record<dateKey, VisitorDayRecord>
 */

export interface VisitorDayRecord {
  count: number;
  ips: string[]; // List of unique IPs that visited on this day
}

export interface VisitorData {
  date: string; // Formatted date (M/D)
  visitors: number;
}

/**
 * Get all visitor records from Edge Config
 */
async function getAllVisitorsFromEdgeConfig(): Promise<Record<string, VisitorDayRecord>> {
  try {
    const data = await get<Record<string, VisitorDayRecord>>('visitors');
    return data || {};
  } catch (error) {
    console.error('Error reading visitors from Edge Config:', error);
    return {};
  }
}

/**
 * Update Edge Config via Vercel API
 */
async function updateEdgeConfigViaAPI(data: Record<string, VisitorDayRecord>): Promise<void> {
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
          key: 'visitors',
          value: data,
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
 * Get today's date key (YYYY-MM-DD)
 */
function getTodayKey(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get last 7 days keys
 */
function getLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date();

  // 昨天 (1天历史数据)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  days.push(yesterday.toISOString().split('T')[0]);

  // 今天
  days.push(today.toISOString().split('T')[0]);

  // 未来5天占位符
  for (let i = 1; i <= 5; i++) {
    const future = new Date(today);
    future.setDate(future.getDate() + i);
    days.push(future.toISOString().split('T')[0]);
  }

  return days;
}

/**
 * Format date for display (M/D)
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * Record a visit from an IP
 */
export async function recordVisit(ip: string): Promise<void> {
  const todayKey = getTodayKey();
  const allVisitors = await getAllVisitorsFromEdgeConfig();

  // Get or create today's record
  const todayRecord = allVisitors[todayKey] || { count: 0, ips: [] };

  // Check if this IP already visited today
  if (!todayRecord.ips.includes(ip)) {
    todayRecord.ips.push(ip);
    todayRecord.count = todayRecord.ips.length;
    allVisitors[todayKey] = todayRecord;

    // Clean up old records (keep only last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffKey = thirtyDaysAgo.toISOString().split('T')[0];

    Object.keys(allVisitors).forEach((key) => {
      if (key < cutoffKey) {
        delete allVisitors[key];
      }
    });

    await updateEdgeConfigViaAPI(allVisitors);
  }
}

/**
 * Get visitor stats for last 7 days
 */
export async function getLast7DaysStats(): Promise<VisitorData[]> {
  const allVisitors = await getAllVisitorsFromEdgeConfig();
  const last7Days = getLast7Days();

  return last7Days.map((dateKey) => ({
    date: formatDate(dateKey),
    visitors: allVisitors[dateKey]?.count || 0,
  }));
}
