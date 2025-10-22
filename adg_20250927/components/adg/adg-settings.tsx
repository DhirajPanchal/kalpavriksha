"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, GripVertical, Pin, PinOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GridSettingsSnapshot } from "./adg-types";

type Density = "compact" | "medium" | "large";
type WidthKey = "S" | "M" | "L";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "../ui/switch";

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <li ref={setNodeRef} style={style} className="rounded-lg border bg-card">
      <div className="flex items-center gap-3 p-2">
        {children}
        <div
          className="ml-1 cursor-grab active:cursor-grabbing text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </li>
  );
}

export default function AdgSettings<T>({
  open,
  onOpenChange,
  table,
  draft,
  setDraft,
  onApply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  table: Table<T>;
  draft: GridSettingsSnapshot;
  setDraft: (s: GridSettingsSnapshot) => void;
  onApply: () => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const setAllVisibility = (v: boolean) =>
    setDraft({
      ...draft,
      columns: draft.columns.map((c) => ({ ...c, visible: v })),
    });
  const unpinAll = () =>
    setDraft({
      ...draft,
      columns: draft.columns.map((c) => ({ ...c, pin: false })),
    });

  const headerLabel = (id: string) => {
    const col =
      table
        .getAllColumns()
        .find(
          (c) =>
            c.id === id ||
            ((c.columnDef as any)?.accessorKey as string | undefined) === id
        ) ?? null;
    return col?.columnDef.header ?? id;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const items = [...draft.columns].sort((a, b) => a.order - b.order);
    const oldIndex = items.findIndex((c) => c.id === String(active.id));
    const newIndex = items.findIndex((c) => c.id === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const [moved] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, moved);
    items.forEach((c, i) => (c.order = i));
    setDraft({ ...draft, columns: items });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[860px]">
        <DialogHeader>
          <DialogTitle>Manage Columns</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Row height</span>
            <div className="flex rounded-md border overflow-hidden">
              {(["compact", "medium", "large"] as Density[]).map((d) => (
                <button
                  key={d}
                  className={cn(
                    "px-3 py-1 text-sm",
                    draft.density === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  )}
                  onClick={() => setDraft({ ...draft, density: d })}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Header wrap</span>
            <div className="flex rounded-md border overflow-hidden">
              {(["single", "multi"] as const).map((w) => (
                <button
                  key={w}
                  className={cn(
                    "px-3 py-1 text-sm capitalize",
                    (draft.headerWrap ?? "single") === w
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  )}
                  onClick={() => setDraft({ ...draft, headerWrap: w })}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cell wrap</span>
            <div className="flex rounded-md border overflow-hidden">
              {(["single", "multi"] as const).map((w) => (
                <button
                  key={w}
                  className={cn(
                    "px-3 py-1 text-sm capitalize",
                    (draft.wrap ?? "single") === w
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  )}
                  onClick={() => setDraft({ ...draft, wrap: w })}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Column hover highlight</div>
              <div className="text-xs text-muted-foreground">
                Show a subtle glass effect on the column under the pointer (body
                only).
              </div>
            </div>
            <Switch
              checked={!!draft.enableColumnHover}
              onCheckedChange={(checked) =>
                setDraft({
                  ...draft,
                  enableColumnHover: checked,
                })
              }
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAllVisibility(true)}
            >
              Show all
            </Button>
            <Button variant="ghost" size="sm" onClick={unpinAll}>
              Unfreeze all
            </Button>
          </div>
        </div>

        <div className="max-h-[50dvh] overflow-y-auto pr-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={draft.columns
                .sort((a, b) => a.order - b.order)
                .map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {draft.columns
                  .sort((a, b) => a.order - b.order)
                  .map((c) => (
                    <SortableRow key={c.id} id={c.id}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {typeof headerLabel(c.id) === "string"
                            ? (headerLabel(c.id) as string)
                            : c.label}
                        </div>
                      </div>

                      <Button
                        variant={c.visible ? "secondary" : "outline"}
                        size="icon"
                        title={c.visible ? "Visible" : "Hidden"}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            columns: draft.columns.map((x) =>
                              x.id === c.id ? { ...x, visible: !x.visible } : x
                            ),
                          })
                        }
                      >
                        {c.visible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Freeze/Pin"
                          >
                            {c.pin ? (
                              <Pin className="h-4 w-4" />
                            ) : (
                              <PinOff className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Pin</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              setDraft({
                                ...draft,
                                columns: draft.columns.map((x) =>
                                  x.id === c.id ? { ...x, pin: true } : x
                                ),
                              })
                            }
                          >
                            Left
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDraft({
                                ...draft,
                                columns: draft.columns.map((x) =>
                                  x.id === c.id ? { ...x, pin: false } : x
                                ),
                              })
                            }
                          >
                            None
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <div className="flex items-center gap-1 rounded-md border p-1">
                        {(["S", "M", "L"] as WidthKey[]).map((w) => (
                          <button
                            key={w}
                            className={cn(
                              "h-8 w-8 text-xs rounded",
                              c.widthKey === w
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            )}
                            onClick={() =>
                              setDraft({
                                ...draft,
                                columns: draft.columns.map((x) =>
                                  x.id === c.id ? { ...x, widthKey: w } : x
                                ),
                              })
                            }
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </SortableRow>
                  ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
