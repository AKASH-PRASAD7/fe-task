"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "../ui/dropdown-menu";
import { useState } from "react";
import ProductForm from "../ui/product-form";
import { Modal } from "../ui/modal";
import type { Row } from "@tanstack/react-table";
import type { Product } from "@/types";

interface LabelOption {
  label: string;
  value: string;
}

interface DataTableRowActionsProps<TData extends { label?: string }> {
  row: Row<TData>;
  labels?: LabelOption[];
  onDelete?: (task: TData) => void;
  onEdit?: (task: TData) => void;
  onLabelChange?: (task: TData, newLabel: string) => void;
}

export function DataTableRowActions<
  TData extends { label?: string | undefined },
>({
  row,
  labels,
  onDelete,
  onEdit,
  onLabelChange,
}: DataTableRowActionsProps<TData>) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [type, setType] = useState<"edit" | "delete">("edit");

  return (
    <>
      {isPopoverOpen && (
        <Modal
          title={type === "edit" ? "Edit Product" : "Delete Product"}
          isOpen={isPopoverOpen}
          onClose={() => setPopoverOpen(false)}
          className="sm:max-w-[425px]"
        >
          <ProductForm
            type={type}
            initialData={row.original as Partial<Product>}
            onSuccess={() => setPopoverOpen(false)}
          />
        </Modal>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 cursor-pointer p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setPopoverOpen(true);
              onEdit?.(row.original);
              setType("edit");
            }}
          >
            Edit
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}

          {labels && typeof row.original.label === "string" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.label}
                    onValueChange={(value) =>
                      onLabelChange?.(row.original, value)
                    }
                  >
                    {labels.map((label) => (
                      <DropdownMenuRadioItem
                        key={label.value}
                        value={label.value}
                      >
                        {label.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setPopoverOpen(true);
              onDelete?.(row.original);
              setType("delete");
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
