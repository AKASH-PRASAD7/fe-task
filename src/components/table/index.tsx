"use client";
import { useProducts } from "@/hooks/useProduct";
import React from "react";
import { DataTable } from "./data-table";

const Table = () => {
  const { data, isPending, isError, error } = useProducts({
    limit: 10,
    skip: 0,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <DataTable
      data={data}
      columns={Object.keys(data[0] || {}).map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      }))}
      filters={[]}
    />
  );
};

export default Table;
