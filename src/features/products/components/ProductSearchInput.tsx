"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProductQuery } from "@/features/products/hooks/use-product-query";

const SEARCH_DEBOUNCE_MS = 300;

export function ProductSearchInput() {
  const { query, updateQuery } = useProductQuery();
  const [inputValue, setInputValue] = useState(query.search);
  // The search value the input last agreed with. When the query's search
  // changes to anything else (e.g. "Clear all"), the input adopts it. The
  // query catching up to what was just typed is not treated as a change, so
  // characters typed while results load are never overwritten.
  const [syncedSearch, setSyncedSearch] = useState(query.search);

  if (query.search !== syncedSearch) {
    setSyncedSearch(query.search);
    setInputValue(query.search);
  }

  const submitSearch = (value: string) => {
    const search = value.trim();
    if (search === query.search) return;
    setSyncedSearch(search);
    updateQuery({ search });
  };

  const submitDebouncedSearch = useEffectEvent((value: string) =>
    submitSearch(value),
  );

  useEffect(() => {
    const timeout = setTimeout(
      () => submitDebouncedSearch(inputValue),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <form
      role="search"
      className="relative min-w-0 basis-full sm:basis-0 sm:flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch(inputValue);
      }}
    >
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="product-search"
        type="search"
        autoComplete="off"
        placeholder="Search products, brands, categories…"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {inputValue && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setInputValue("");
            submitSearch("");
          }}
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <XIcon className="size-3.5" aria-hidden />
        </button>
      )}
    </form>
  );
}
