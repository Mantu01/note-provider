"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { Plus, Edit3, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { CategoryDialog } from "@/features/admin/components/categories/category-dialog";
import { useAdminCategories, useDeleteCategory } from "@/features/admin/api/use-admin-categories";
import { useAdminProfile } from "@/features/admin/api/use-admin";
import type { AdminCategory } from "@/lib/types";

export function CategoriesTable() {
  const [{ dialog, editId, deleteId }, setParams] = useQueryStates({
    dialog: parseAsBoolean.withDefault(false),
    editId: parseAsString,
    deleteId: parseAsString,
  });

  const { data: profile } = useAdminProfile();
  const { data, isLoading } = useAdminCategories();
  const deleteMutation = useDeleteCategory();

  const categories = data?.items ?? [];
  const isHeadAdmin = Boolean(profile?.isHead);
  const editingCategory = categories.find((c) => c.id === editId) ?? null;
  const deletingCategory = categories.find((c) => c.id === deleteId) ?? null;

  const setDialogOpen = (open: boolean) => setParams({ dialog: open, editId: open ? editId : null });
  const setEditingCategory = (c: AdminCategory | null) => setParams({ editId: c?.id ?? null, dialog: Boolean(c) });
  const setDeletingCategory = (c: AdminCategory | null) => setParams({ deleteId: c?.id ?? null });

  const handleEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingCategory || !isHeadAdmin) return;
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Study Categories</h2>
          <p className="text-sm text-muted-foreground">Manage topic categories used to organize notes.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Notes Count</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="h-10 animate-pulse rounded bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title="No categories created"
                    description="Create your first study topic category."
                    action={<Button onClick={handleCreate}>Add Category</Button>}
                  />
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{cat.name}</div>
                    {cat.description && (
                      <div className="text-xs text-muted-foreground line-clamp-1">{cat.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {cat.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cat.noteCount} Notes</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cat.order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(cat)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCategory(cat)}
                        disabled={!isHeadAdmin}
                        className={isHeadAdmin ? "text-muted-foreground" : "opacity-40 cursor-not-allowed"}
                        title={isHeadAdmin ? "Delete category" : "Only Head Admin can delete"}
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

      <CategoryDialog
        open={dialog}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />

      <Dialog open={Boolean(deletingCategory)} onOpenChange={() => setDeletingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" /> Delete Category
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete category &quot;{deletingCategory?.name}&quot;? If notes are assigned to it, reassign them first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending || !isHeadAdmin}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
