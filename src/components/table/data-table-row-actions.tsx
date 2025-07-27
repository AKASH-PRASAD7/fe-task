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

interface LabelOption {
  label: string;
  value: string;
}

interface DataTableRowActionsProps<TData extends { label?: string }> {
  row: TData;
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
            initialData={row.original}
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
              onEdit?.(row);
              setType("edit");
            }}
          >
            Edit
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}

          {labels && typeof row.label === "string" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.label}
                    onValueChange={(value) => onLabelChange?.(row, value)}
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
              onDelete?.(row);
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
