"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, ShieldAlert, Eye, Lock, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useAdminNotes, useDeleteNote } from "@/features/admin/api/use-admin-notes";
import { useAdminProfile } from "@/features/admin/api/use-admin";
import type { AdminNote } from "@/lib/types";

export function NotesTable() {
  const [{ page, search, deleteId }, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    deleteId: parseAsString,
  });

  const { data: profile } = useAdminProfile();
  const { data, isLoading } = useAdminNotes({ page, limit: 12, q: search });
  const deleteMutation = useDeleteNote();

  const notes = data?.items ?? [];
  const pagination = data?.pagination;
  const isHeadAdmin = Boolean(profile?.isHead);
  const deletingNote = notes.find((n) => n.id === deleteId) ?? null;

  const setPage = (p: number) => setParams({ page: p });
  const setSearch = (q: string) => setParams({ search: q, page: 1 });
  const setDeletingNote = (n: AdminNote | null) => setParams({ deleteId: n?.id ?? null });

  const canDeleteNote = (note: AdminNote | null) => {
    if (!note || !profile) return false;
    if (profile.isHead) return true;
    if (note.createdBy?.id && note.createdBy.id === profile.id) return true;
    return false;
  };

  const handleDelete = () => {
    if (!deletingNote || !canDeleteNote(deletingNote)) return;
    deleteMutation.mutate(deletingNote.id, {
      onSuccess: () => setDeletingNote(null),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes catalog..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Button render={<Link href="/admin/notes/new" />}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create Note
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title & Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <div className="h-10 animate-pulse rounded bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : notes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState
                    title="No notes found"
                    description="Create your first note to populate the catalog."
                    action={
                      <Button render={<Link href="/admin/notes/new" />}>
                        Create Note
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{note.title}</div>
                    <div className="text-xs text-muted-foreground">{note.subject}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {note.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={note.level} type="level" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <StatusBadge status={note.pricingType} type="pricing" />
                    {note.pricingType === "paid" && (
                      <span className="ml-2 text-sm">{note.priceLabel}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={note.visibility === "public" ? "default" : "secondary"}>
                      {note.visibility}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {note.downloadCount + note.purchaseCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        render={<Link href={`/admin/notes/${note.id}/edit`} />}
                        title="Edit note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingNote(note)}
                        disabled={!canDeleteNote(note)}
                        className={canDeleteNote(note) ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10" : "opacity-40 cursor-not-allowed"}
                        title={canDeleteNote(note) ? "Delete note" : "Only Head Admin or Note Creator can delete"}
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

      <Dialog open={Boolean(deletingNote)} onOpenChange={() => setDeletingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" /> Delete Note
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingNote?.title}&quot;? This action cannot be undone and will remove all Cloudinary file assets.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingNote(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending || !deletingNote || !canDeleteNote(deletingNote)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
