import { Table } from "@tanstack/react-table";
import {
  Density,
  GridSettingsSnapshot,
  WidthKey,
} from "@/components/adg-v1/adg-types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  GripVertical,
  MoveVertical,
  Pin,
  PinOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const move = (id: string, dir: "up" | "down") => {
    const arr = [...draft.columns];
    const idx = arr.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= arr.length) return;
    const tmp = arr[idx].order;
    arr[idx].order = arr[swapWith].order;
    arr[swapWith].order = tmp;
    arr.sort((a, b) => a.order - b.order);
    setDraft({ ...draft, columns: arr });
  };

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
    return table.getColumn(id)?.columnDef.header;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Manage ADG</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Reorder, resize, freeze, hide/show
          </div>
          <div className="flex items-center gap-2">
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
        <Separator className="my-2" />

        {/* Density & palette */}
        <div className="flex flex-wrap gap-3 items-center">
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
            <span className="text-sm text-muted-foreground">Palette</span>
            <div className="flex rounded-md border overflow-hidden">
              {["blue", "gray"].map((p) => (
                <button
                  key={p}
                  className={cn(
                    "px-3 py-1 text-sm capitalize",
                    draft.palette === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  )}
                  onClick={() => setDraft({ ...draft, palette: p as any })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-h-[50dvh] overflow-y-auto mt-3 pr-1 border border-blue-600">
          <ul className="space-y-2">
            {draft.columns
              .sort((a, b) => a.order - b.order)
              .map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {typeof headerLabel(c.id) === "string"
                        ? (headerLabel(c.id) as string)
                        : c.label}
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
                    {c.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Freeze */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" title="Freeze/Pin">
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
                              x.id === c.id ? { ...x, pin: "left" } : x
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
                              x.id === c.id ? { ...x, pin: "right" } : x
                            ),
                          })
                        }
                      >
                        Right
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

                  {/* Width */}
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

                  {/* Order */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => move(c.id, "up")}
                      title="Move up"
                    >
                      <MoveVertical className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => move(c.id, "down")}
                      title="Move down"
                    >
                      <MoveVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* drag handle placeholder */}
                  <div className="px-1 text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                </li>
              ))}
          </ul>
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
