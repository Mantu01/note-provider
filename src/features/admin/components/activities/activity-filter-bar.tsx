"use client";

import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ActivityFilterBarProps = {
  filters: {
    q?: string;
    action?: string;
    targetType?: string;
    from?: string;
    to?: string;
  };
  onChange: (filters: { q?: string; action?: string; targetType?: string; from?: string; to?: string }) => void;
};

export function ActivityFilterBar({ filters, onChange }: ActivityFilterBarProps) {
  const hasActiveFilters = Boolean(filters.q || filters.action || filters.targetType || filters.from || filters.to);

  const resetFilters = () => {
    onChange({});
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          Filter Activity Logs
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs text-muted-foreground">
            <X className="mr-1 h-3.5 w-3.5" /> Reset Filters
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search action details, target, IP..."
            value={filters.q ?? ""}
            onChange={(e) => onChange({ ...filters, q: e.target.value || undefined })}
            className="pl-9"
          />
        </div>

        <div>
          <Select
            value={filters.action ?? "all"}
            onValueChange={(val) => onChange({ ...filters, action: !val || val === "all" ? undefined : val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="note.create">Note Created</SelectItem>
              <SelectItem value="note.update">Note Updated</SelectItem>
              <SelectItem value="note.delete">Note Deleted</SelectItem>
              <SelectItem value="group.create">Bundle Created</SelectItem>
              <SelectItem value="group.update">Bundle Updated</SelectItem>
              <SelectItem value="group.delete">Bundle Deleted</SelectItem>
              <SelectItem value="category.create">Category Created</SelectItem>
              <SelectItem value="category.update">Category Updated</SelectItem>
              <SelectItem value="category.delete">Category Deleted</SelectItem>
              <SelectItem value="order.update_fulfillment">Order Fulfilled</SelectItem>
              <SelectItem value="admin.login">Admin Login</SelectItem>
              <SelectItem value="admin.register">Admin Registered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.targetType ?? "all"}
            onValueChange={(val) => onChange({ ...filters, targetType: !val || val === "all" ? undefined : val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Target Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Targets</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="group">Bundles</SelectItem>
              <SelectItem value="category">Categories</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Input
            type="date"
            placeholder="From"
            value={filters.from ?? ""}
            onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
          />
        </div>
      </div>
    </div>
  );
}
