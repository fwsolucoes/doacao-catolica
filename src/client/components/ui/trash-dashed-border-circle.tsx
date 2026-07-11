import { Trash2 } from "lucide-react";

function TrashDashedBorderCircle() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex size-30 items-center justify-center rounded-full border border-dashed border-(--border) bg-muted p-[15px]">
        <div className="flex size-[90px] items-center justify-center rounded-full bg-destructive">
          <Trash2 className="size-12 text-white" />
        </div>
      </div>
    </div>
  );
}

export { TrashDashedBorderCircle };
