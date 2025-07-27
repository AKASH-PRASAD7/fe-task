"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Badge } from "./badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  value = [],
  onChange,
  placeholder,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = (tag: string) => {
    const newTag = tag.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }

    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "") {
      removeTag(value[value.length - 1] ?? "");
    }
  };

  return (
    <div
      className={cn(
        "border-input bg-background ring-offset-background flex flex-wrap items-center gap-2 rounded-md border p-2 text-sm",
        className,
      )}
    >
      {value.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
          <button
            type="button"
            className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
          >
            <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? "Add a tag..."}
        className="h-auto flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
