"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search({
  placeholder = "Search...",
}: {
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = useMemo(() => {
    return new URLSearchParams(searchParams);
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setValue(term);
    debounce(term);
  };

  const debounce = useDebouncedCallback((str: string) => {
    params.set("page", "1");
    if (str) {
      params.set("query", str);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    if (!params.has("query")) {
      setValue("");
    }
  }, [params]);

  return (
    <div className="relative ml-auto mr-2 flex-1 md:grow-0">
      <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        value={value}
        defaultValue={searchParams.get("query")?.toString()}
        className="w-full rounded-lg border-zinc-300 bg-background pl-8 md:w-[200px] lg:w-[320px]"
      />
    </div>
  );
}
