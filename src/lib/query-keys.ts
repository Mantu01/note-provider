import type { GroupsQuery, NotesQuery } from "@/lib/types";

export const queryKeys = {
  home: ["home"] as const,
  filters: ["filters"] as const,
  categories: ["categories"] as const,
  notes: {
    all: ["notes"] as const,
    list: (params: NotesQuery) => ["notes", "list", params] as const,
    detail: (slug: string) => ["notes", "detail", slug] as const,
  },
  groups: {
    all: ["groups"] as const,
    list: (params: GroupsQuery) => ["groups", "list", params] as const,
    detail: (slug: string) => ["groups", "detail", slug] as const,
  },
  order: (id: string) => ["order", id] as const,
  orderLookup: (orderNumber: string) => ["order", "lookup", orderNumber] as const,
  admin: {
    me: ["admin", "me"] as const,
    dashboard: ["admin", "dashboard"] as const,
    notes: {
      all: ["admin", "notes"] as const,
      list: (params: unknown) => ["admin", "notes", "list", params] as const,
      detail: (id: string) => ["admin", "notes", "detail", id] as const,
    },
    groups: {
      all: ["admin", "groups"] as const,
      list: (params: unknown) => ["admin", "groups", "list", params] as const,
      detail: (id: string) => ["admin", "groups", "detail", id] as const,
    },
    categories: ["admin", "categories"] as const,
    orders: {
      all: ["admin", "orders"] as const,
      list: (params: unknown) => ["admin", "orders", "list", params] as const,
      detail: (id: string) => ["admin", "orders", "detail", id] as const,
    },
    leads: (params: unknown) => ["admin", "leads", params] as const,
    activities: (params: unknown) => ["admin", "activities", params] as const,
    admins: ["admin", "admins"] as const,
  },
} as const;
