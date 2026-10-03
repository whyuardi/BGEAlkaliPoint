// Mock database store (in-memory for prototype)
// In production, replace with Supabase / PostgreSQL

export interface User {
  id: string;
  name: string;
  phone: string;
  area: string;
  qrToken: string;
  createdAt: string;
}

export interface DispenseLog {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  liters: number;
  boothId: string;
  timestamp: string;
}

// Generate a unique token
export function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "BGE-";
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// In-memory store
interface Store {
  users: User[];
  dispenseLogs: DispenseLog[];
}

// Use global to persist across hot reloads in dev
const globalStore = globalThis as unknown as { __store: Store };

if (!globalStore.__store) {
  globalStore.__store = {
    users: [],
    dispenseLogs: [],
  };
}

export const store = globalStore.__store;

// Helper: Check if user already dispensed today
export function hasDispensedToday(userId: string): DispenseLog | null {
  const today = new Date().toISOString().split("T")[0];
  const log = store.dispenseLogs.find(
    (l) => l.userId === userId && l.timestamp.startsWith(today)
  );
  return log || null;
}

// Helper: Get today's stats
export function getTodayStats() {
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = store.dispenseLogs.filter((l) =>
    l.timestamp.startsWith(today)
  );
  return {
    totalLitersToday: todayLogs.reduce((sum, l) => sum + l.liters, 0),
    totalDispensesToday: todayLogs.length,
    totalUsers: store.users.length,
    totalLitersAllTime: store.dispenseLogs.reduce(
      (sum, l) => sum + l.liters,
      0
    ),
    totalDispensesAllTime: store.dispenseLogs.length,
  };
}
