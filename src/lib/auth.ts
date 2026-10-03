export type Role = "admin" | "petugas";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: Role;
  boothId?: string;
}

export const USERS = [
  {
    id: "usr_admin",
    username: "admin",
    password: "admin123",
    name: "Admin Operasional",
    role: "admin" as Role,
  },
  {
    id: "usr_petugas",
    username: "petugas",
    password: "petugas123",
    name: "Petugas Pos Booth 01",
    role: "petugas" as Role,
    boothId: "BOOTH-01",
  },
];

export const AUTH_COOKIE_NAME = "bge_auth_session";

export function authenticate(username: string, password: string): AuthUser | null {
  const user = USERS.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase().trim() &&
      u.password === password
  );

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    boothId: user.boothId,
  };
}
