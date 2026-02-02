import { getFromStorage, atomicUpdate } from './storage';

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
 * Get all visitor records from storage
 */
async function getAllVisitors(): Promise<Record<string, VisitorDayRecord>> {
  const data = await getFromStorage<Record<string, VisitorDayRecord>>('visitors');
  return data || {};
}

/**
 * Get today's date key (YYYY-MM-DD)
 */
function getTodayKey(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get visitor stats date range (yesterday + today + next 5 days placeholders)
 */
function getVisitorStatsDateRange(): string[] {
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
 * Record a visit from an IP (使用原子更新防止并发冲突)
 */
export async function recordVisit(ip: string): Promise<void> {
  const todayKey = getTodayKey();

  await atomicUpdate<Record<string, VisitorDayRecord>>('visitors', (current) => {
    const allVisitors = current || {};

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
    }

    return allVisitors;
  });
}

/**
 * Get visitor stats for last 7 days
 */
export async function getLast7DaysStats(): Promise<VisitorData[]> {
  const allVisitors = await getAllVisitors();
  const last7Days = getVisitorStatsDateRange();

  return last7Days.map((dateKey) => ({
    date: formatDate(dateKey),
    visitors: allVisitors[dateKey]?.count || 0,
  }));
}
