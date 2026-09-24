"use client";

import { parseAsBoolean, parseAsInteger, parseAsString, throttle, useQueryStates } from "nuqs";

export function useAdminListState() {
  const [{ page, search, deleteId }, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(""),
      deleteId: parseAsString,
    },
    { clearOnDefault: true, limitUrlUpdates: throttle(300) },
  );

  return {
    page,
    search,
    deleteId,
    setPage: (next: number) => setParams({ page: next }),
    setSearch: (next: string) => setParams({ search: next, page: 1 }),
    setDeleteId: (next: string | null) => setParams({ deleteId: next }),
  };
}

export function useCategoryDialogState() {
  const [{ dialog, editId }, setParams] = useQueryStates(
    {
      dialog: parseAsBoolean.withDefault(false),
      editId: parseAsString,
    },
    { clearOnDefault: true },
  );

  return {
    dialogOpen: dialog,
    editingId: editId,
    openCreate: () => setParams({ dialog: true, editId: null }),
    openEdit: (id: string) => setParams({ dialog: true, editId: id }),
    closeDialog: () => setParams({ dialog: false, editId: null }),
  };
}
