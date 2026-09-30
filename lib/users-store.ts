const STORAGE_KEY = "miles.users.v1";

const ROLES = ["admin", "editor", "viewer"] as const;
const STATUSES = ["active", "inactive", "suspended"] as const;
const LAST_ACTIVE = [
  "2 mins ago",
  "1 hour ago",
  "3 days ago",
  "Just now",
  "1 week ago",
  "5 mins ago",
  "10 mins ago",
  "4 days ago",
] as const;

type UserRole = (typeof ROLES)[number];
type UserStatus = (typeof STATUSES)[number];

type StoredUser = {
  id: string;
  displayId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  image: string;
  initials: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  joinTime: number;
  lastActive: string;
  twoFactor: boolean;
};

type DummyAddress = {
  address?: string;
  city?: string;
  stateCode?: string;
};

type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  image: string;
  address?: DummyAddress;
};

type Listener = () => void;

const listeners = new Set<Listener>();

function subscribeUsers(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyUsers() {
  listeners.forEach((listener) => listener());
}

function randomFrom<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

function randomizer(seed: number) {
  let value = seed % 233280;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatJoinDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function joinDateFor(random: () => number) {
  const now = new Date();
  const inThisMonth = random() < 0.18;
  const date = inThisMonth
    ? new Date(now.getFullYear(), now.getMonth(), 1 + Math.floor(random() * 27))
    : new Date(2023 + Math.floor(random() * 2), Math.floor(random() * 12), 1 + Math.floor(random() * 27));

  return { joinDate: formatJoinDate(date), joinTime: date.getTime() };
}

function formatBirthDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return formatLongDate(date);
}

function formatAddress(address?: DummyAddress) {
  const parts = [address?.address, address?.city, address?.stateCode].filter(Boolean);
  return parts.join(", ") || "123 Business Rd, Suite 100, New York, NY";
}

function toStoredUser(user: DummyUser): StoredUser {
  const random = randomizer(user.id);
  const name = `${user.firstName} ${user.lastName}`.trim();
  const joined = joinDateFor(random);

  return {
    id: String(user.id),
    displayId: `#USR-${String(user.id).padStart(4, "0")}`,
    name,
    email: user.email,
    phone: user.phone,
    birthDate: formatBirthDate(user.birthDate),
    address: formatAddress(user.address),
    image: user.image,
    initials: initialsFrom(name),
    role: randomFrom(ROLES, random),
    status: randomFrom(STATUSES, random),
    joinDate: joined.joinDate,
    joinTime: joined.joinTime,
    lastActive: randomFrom(LAST_ACTIVE, random),
    twoFactor: random() > 0.35,
  };
}

function readUsers(): StoredUser[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  notifyUsers();
}

let loadingUsers: Promise<StoredUser[]> | null = null;

async function ensureUsers(): Promise<StoredUser[]> {
  const existing = readUsers();
  if (existing && existing.length > 0) {
    return existing;
  }

  if (loadingUsers) {
    return loadingUsers;
  }

  loadingUsers = fetch("https://dummyjson.com/users?limit=100")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Could not load users");
      }

      const data = (await response.json()) as { users: DummyUser[] };
      const saved = readUsers();
      if (saved && saved.length > 0) {
        return saved;
      }

      const users = data.users.map(toStoredUser);
      writeUsers(users);
      return users;
    })
    .finally(() => {
      loadingUsers = null;
    });

  return loadingUsers;
}

function updateUser(id: string, patch: Partial<StoredUser>) {
  const users = readUsers() ?? [];
  const next = users.map((user) => {
    if (user.id !== id) {
      return user;
    }

    const name = patch.name ?? user.name;
    return { ...user, ...patch, name, initials: initialsFrom(name) };
  });
  writeUsers(next);
  return next.find((user) => user.id === id) ?? null;
}

function updateUsers(ids: string[], patch: Partial<StoredUser>) {
  const selected = new Set(ids);
  const users = readUsers() ?? [];
  const next = users.map((user) => {
    if (!selected.has(user.id)) {
      return user;
    }

    const name = patch.name ?? user.name;
    return { ...user, ...patch, name, initials: initialsFrom(name) };
  });
  writeUsers(next);
  return next;
}

function addUser(input: { name: string; email: string; role: UserRole }) {
  const users = readUsers() ?? [];
  const nextNumber =
    users.reduce((max, user) => {
      const value = Number(user.id);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0) + 1;
  const now = new Date();
  const name = input.name.trim();
  const user: StoredUser = {
    id: String(nextNumber),
    displayId: `#USR-${String(nextNumber).padStart(4, "0")}`,
    name,
    email: input.email.trim(),
    phone: "",
    birthDate: "",
    address: "",
    image: "",
    initials: initialsFrom(name),
    role: input.role,
    status: "active",
    joinDate: formatJoinDate(now),
    joinTime: now.getTime(),
    lastActive: "Just now",
    twoFactor: false,
  };

  writeUsers([user, ...users]);
  return user;
}

function deleteUser(id: string) {
  const users = readUsers() ?? [];
  writeUsers(users.filter((user) => user.id !== id));
}

export { addUser, deleteUser, ensureUsers, readUsers, subscribeUsers, updateUser, updateUsers };
export type { StoredUser, UserRole, UserStatus };
