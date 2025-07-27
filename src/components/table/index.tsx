"use client";
import { useProducts, useUpdateProduct } from "@/hooks/useProduct";
import React, { useMemo, useState } from "react";
import { DataTable } from "./data-table";
import {
  type ColumnDef,
  type PaginationState,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/validators";
import { DataTableRowActions } from "./data-table-row-actions";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { DataTableSkeleton } from "../ui/skeletal-loader-table";

const Table = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const sortParams = useMemo(() => {
    const [sort] = sorting;
    if (!sort) return {};
    return { sortBy: sort.id, order: sort.desc ? "desc" : "asc" };
  }, [sorting]);

  const { data, isPending, isError, error } = useProducts({
    limit: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
    sortBy: sortParams.sortBy,
    order: sortParams.order,
  });

  const products = data?.products ?? [];
  const totalProducts = data?.total ?? 0;

  const pageCount = useMemo(() => {
    return Math.ceil(totalProducts / pagination.pageSize);
  }, [totalProducts, pagination.pageSize]);

  const columns = useMemo<ColumnDef<Product>[]>(() => {
    const sortableKeys = ["title", "price", "rating", "stock"];

    const dynamicColumns = Object.keys(products[0] || {})
      .filter((key) => key !== "tags")
      .map((key) => {
        const isSortable = sortableKeys.includes(key);

        return {
          accessorKey: key,
          header: ({ column }) => {
            if (!isSortable) {
              return <>{key.charAt(0).toUpperCase() + key.slice(1)}</>;
            }
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        };
      });

    return [
      ...dynamicColumns,
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => {
          const tags = row.getValue("tags") as string[];

          if (!tags || tags.length === 0) {
            return <span className="text-muted-foreground">-</span>;
          }

          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ];
  }, [products]);

  const handleRowClick = (row: Row<(typeof products)[0]>) => {
    if (row.id) {
      router.push(`/product/${row.original.id}`);
    }
  };

  if (isPending)
    return (
      <main className="mb-12 px-6">
        <DataTableSkeleton columnCount={8} rowCount={pagination.pageSize} />
      </main>
    );
  if (isError)
    return (
      <main className="flex h-96 items-center justify-center text-red-500">
        Error: {error.message}
      </main>
    );

  return (
    <main className="mb-12 px-6">
      <DataTable
        data={data?.products}
        columns={columns}
        filters={[]}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onRowClick={handleRowClick}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    </main>
  );
};

export default Table;
