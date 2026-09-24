"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { Plus, Edit3, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryDialog } from "@/components/admin/categories/category-dialog";
import { useAdminCategories, useAdminProfile, useDeleteCategory } from "@/hooks/useAdmin";
import { useCategoryDialogState } from "@/hooks/use-admin-table-state";
import type { AdminCategory } from "@/lib/types";

export function CategoriesTable() {
  const [{ deleteId }, setParams] = useQueryStates(
    { deleteId: parseAsString },
    { clearOnDefault: true },
  );
  const { dialogOpen, editingId, openCreate, openEdit, closeDialog } = useCategoryDialogState();

  const { data: profile } = useAdminProfile();
  const { data, isLoading } = useAdminCategories();
  const deleteMutation = useDeleteCategory();

  const categories = data?.items ?? [];
  const isHeadAdmin = Boolean(profile?.isHead);
  const editingCategory = categories.find((c) => c.id === editingId) ?? null;
  const deletingCategory = categories.find((c) => c.id === deleteId) ?? null;
  const setDeletingCategory = (category: AdminCategory | null) =>
    setParams({ deleteId: category?.id ?? null });

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
          <h1 className="text-2xl font-bold tracking-tight">Study Categories</h1>
          <p className="text-sm text-muted-foreground">Manage the topics used to organize notes.</p>
        </div>
        <Button onClick={openCreate}>
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
                <TableCell colSpan={5} className="py-12 text-center">
                  <p className="text-sm font-medium text-foreground">No categories created</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create your first study topic category.
                  </p>
                  <Button className="mt-4" onClick={openCreate}>
                    Add Category
                  </Button>
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
                      <Button variant="outline" size="icon" onClick={() => openEdit(cat.id)} aria-label="Edit category">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCategory(cat)}
                        disabled={!isHeadAdmin}
                        className={isHeadAdmin ? "text-muted-foreground" : "opacity-40 cursor-not-allowed"}
                        title={isHeadAdmin ? "Delete category" : "Only Head Admin can delete"}
                        aria-label="Delete category"
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
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
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
