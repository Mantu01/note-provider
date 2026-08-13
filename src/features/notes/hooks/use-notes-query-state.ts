"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { DEFAULT_PAGE_LIMIT, NOTE_SORTS } from "@/lib/constants";

const parsers = {
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(DEFAULT_PAGE_LIMIT),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  level: parseAsArrayOf(parseAsString).withDefault([]),
  subject: parseAsArrayOf(parseAsString).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  pricing: parseAsString.withDefault(""),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  sort: parseAsStringLiteral(NOTE_SORTS).withDefault("newest"),
  view: parseAsStringLiteral(["grid", "list"] as const).withDefault("grid"),
};

type NotesUrlState = {
  q: string;
  page: number;
  limit: number;
  category: string[];
  level: string[];
  subject: string[];
  tags: string[];
  pricing: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: (typeof NOTE_SORTS)[number];
  view: "grid" | "list";
};

export function useNotesQueryState() {
  const [state, setState] = useQueryStates(parsers, {
    history: "push",
    shallow: true,
    clearOnDefault: true,
  });

  const setFilter = (values: Partial<NotesUrlState>) =>
    setState({ ...values, page: values.page ?? 1 });

  const clearFilters = () =>
    setState({
      q: "",
      category: [],
      level: [],
      subject: [],
      tags: [],
      pricing: "",
      minPrice: null,
      maxPrice: null,
      sort: "newest",
      page: 1,
    });

  const activeFilterCount = [
    state.q,
    ...state.category,
    ...state.level,
    ...state.subject,
    ...state.tags,
    state.pricing,
    state.minPrice,
    state.maxPrice,
  ].filter((value) => value !== "" && value !== null).length;

  return { state, setFilter, clearFilters, activeFilterCount };
}
