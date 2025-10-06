
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import {
  Eye,
  EyeOff,
  GripVertical,
  Pin,
  PinOff,
} from "lucide-react";
import * as React from "react";
import type { Density, GridSettingsSnapshot, WidthKey } from "./adg-types";

// DnD Kit
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({
  id,
  children,
  disabled,
}: {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id, disabled});
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <li ref={setNodeRef} style={style} className="rounded-lg border bg-card">
      <div className="flex items-center gap-3 p-2">{children}
        <div className="ml-1 cursor-grab active:cursor-grabbing text-muted-foreground"
             {...attributes} {...listeners} aria-label="Drag handle">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </li>
  );
}

export default function AdgSettingsDnd<T>({
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
  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 6}}));

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

  const headerLabel = (id: string) => table.getColumn(id)?.columnDef.header;

  const onDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (!over || active.id === over.id) return;
    const items = [...draft.columns].sort((a,b)=>a.order-b.order);
    const oldIndex = items.findIndex(c => c.id === String(active.id));
    const newIndex = items.findIndex(c => c.id === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const [moved] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, moved);
    // Re-number order
    items.forEach((c, i) => c.order = i);
    setDraft({ ...draft, columns: items });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Manage Columns</DialogTitle>
        </DialogHeader>

        {/* Density & palette */}
        <div className="flex flex-wrap gap-3 items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Row height</span>
            <div className="flex rounded-md border overflow-hidden">
              {(["compact","medium","large"] as Density[]).map((d) => (
                <button key={d}
                  className={cn("px-3 py-1 text-sm",
                    draft.density===d? "bg-primary text-primary-foreground":"bg-background hover:bg-accent")}
                  onClick={() => setDraft({ ...draft, density: d })}
                >{d}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Palette</span>
            <div className="flex rounded-md border overflow-hidden">
              {["blue","gray","yellow"].map((p) => (
                <button key={p}
                  className={cn("px-3 py-1 text-sm capitalize",
                    draft.palette===p? "bg-primary text-primary-foreground":"bg-background hover:bg-accent")}
                  onClick={() => setDraft({ ...draft, palette: p as any })}
                >{p}</button>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAllVisibility(true)}>Show all</Button>
            <Button variant="ghost" size="sm" onClick={unpinAll}>Unfreeze all</Button>
          </div>
        </div>

        <div className="max-h-[50dvh] overflow-y-auto pr-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={draft.columns.sort((a,b)=>a.order-b.order).map(c => c.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {draft.columns.sort((a,b)=>a.order-b.order).map((c) => (
                  <SortableRow key={c.id} id={c.id}>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {typeof headerLabel(c.id) === "string" ? (headerLabel(c.id) as string) : c.label}
                      </div>
                    </div>

                    {/* Show/Hide */}
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
                      {c.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>

                    {/* Freeze */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" title="Freeze/Pin">
                          {c.pin ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Pin</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setDraft({ ...draft, columns: draft.columns.map((x)=> x.id===c.id?{...x, pin:"left"}:x) })}>Left</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDraft({ ...draft, columns: draft.columns.map((x)=> x.id===c.id?{...x, pin:false}:x) })}>None</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Width */}
                    <div className="flex items-center gap-1 rounded-md border p-1">
                      {(["S","M","L"] as WidthKey[]).map((w)=> (
                        <button key={w}
                          className={cn("h-8 w-8 text-xs rounded",
                            c.widthKey===w? "bg-primary text-primary-foreground":"hover:bg-accent")}
                          onClick={()=> setDraft({ ...draft, columns: draft.columns.map(x=> x.id===c.id?{...x, widthKey:w}:x) })}
                        >{w}</button>
                      ))}
                    </div>
                  </SortableRow>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
