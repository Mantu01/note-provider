"use client";

import Link from "next/link";
import { Search, Edit3, Trash2, ShieldAlert, FolderPlus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { useAdminGroups, useAdminProfile, useDeleteGroup } from "@/hooks/useAdmin";
import { useAdminListState } from "@/hooks/use-admin-table-state";
import type { AdminGroup } from "@/lib/types";

export function GroupsTable() {
  const { page, search, deleteId, setPage, setSearch, setDeleteId } = useAdminListState();
  const { data: profile } = useAdminProfile();
  const { data, isLoading } = useAdminGroups({ page, limit: 12, q: search });
  const deleteMutation = useDeleteGroup();

  const groups = data?.items ?? [];
  const pagination = data?.pagination;
  const deletingGroup = groups.find((g) => g.id === deleteId) ?? null;

  const setDeletingGroup = (group: AdminGroup | null) => setDeleteId(group?.id ?? null);

  const canDeleteGroup = (group: AdminGroup | null) => {
    if (!group || !profile) return false;
    if (profile.isHead) return true;
    if (group.createdBy?.id && group.createdBy.id === profile.id) return true;
    return false;
  };

  const handleDelete = () => {
    if (!deletingGroup || !canDeleteGroup(deletingGroup)) return;
    deleteMutation.mutate(deletingGroup.id, {
      onSuccess: () => setDeletingGroup(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bundles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Button render={<Link href="/admin/groups/new" />}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Create Bundle
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bundle Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contained Notes</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="h-10 animate-pulse rounded bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <p className="text-sm font-medium text-foreground">No bundles created yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Group notes into a discounted study bundle.
                  </p>
                  <Button className="mt-4" render={<Link href="/admin/groups/new" />}>
                    Create Bundle
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{group.name}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{group.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {group.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex w-fit items-center gap-1">
                      <Layers className="h-3 w-3 text-primary" />
                      {group.noteCount ?? group.notes?.length ?? 0} Notes
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {group.priceLabel}
                  </TableCell>
                  <TableCell>
                    <Badge variant={group.visibility === "public" ? "default" : "secondary"}>
                      {group.visibility}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        render={<Link href={`/admin/groups/${group.id}/edit`} />}
                        title="Edit bundle"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingGroup(group)}
                        disabled={!canDeleteGroup(group)}
                        className={canDeleteGroup(group) ? "text-muted-foreground" : "opacity-40 cursor-not-allowed"}
                        title={canDeleteGroup(group) ? "Delete bundle" : "Only Head Admin or Bundle Creator can delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      <Dialog open={Boolean(deletingGroup)} onOpenChange={() => setDeletingGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" /> Delete Bundle
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingGroup?.name}&quot;? Note items inside will not be deleted, only the bundle grouping.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingGroup(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending || !deletingGroup || !canDeleteGroup(deletingGroup)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
