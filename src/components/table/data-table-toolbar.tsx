"use client";

import { type Table } from "@tanstack/react-table";
import { PlusIcon, X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import ProductForm from "../ui/product-form";
import { Modal } from "../ui/modal";

interface FilterOption {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by title or brand..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="default"
        size="sm"
        className="mx-4 h-8 cursor-pointer px-3"
        onClick={() => setPopoverOpen(!isPopoverOpen)}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Product
      </Button>
      <DataTableViewOptions table={table} />
      {isPopoverOpen && (
        <Modal
          title="Create Product"
          isOpen={isPopoverOpen}
          onClose={() => setPopoverOpen(false)}
          className="sm:max-w-[425px]"
        >
          <ProductForm type="create" onSuccess={() => setPopoverOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
