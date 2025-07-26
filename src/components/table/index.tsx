"use client";
import { useProducts } from "@/hooks/useProduct";
import React from "react";
import { DataTable } from "./data-table";
import { type PaginationState, type Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

const Table = () => {
  const router = useRouter();
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isPending, isError, error } = useProducts({
    limit: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  });

  const products = data?.products ?? [];
  const totalProducts = data?.total ?? 0;

  const pageCount = React.useMemo(() => {
    return Math.ceil(totalProducts / pagination.pageSize);
  }, [totalProducts, pagination.pageSize]);

  const columns = React.useMemo(
    () =>
      Object.keys(data?.products[0] || {}).map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      })),
    [products],
  );

  const handleRowClick = (row: Row<(typeof products)[0]>) => {
    if (row.id) {
      router.push(`/product/${row.id}`);
    }
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <main className="mb-12">
      <DataTable
        data={data?.products}
        columns={columns}
        filters={[]}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onRowClick={handleRowClick}
      />
    </main>
  );
};

export default Table;
