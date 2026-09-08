import { Check } from "lucide-react";

function ActiveBadge() {
  return (
    <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-xl bg-sidebar-primary px-3 py-1 text-xs font-semibold text-white">
      <Check size={11} strokeWidth={3} />
      Ativo
    </div>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
      <span className="text-base text-muted-foreground">{text}</span>
    </div>
  );
}

function SelectedButton() {
  return (
    <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e6e6ed] text-sm font-semibold text-foreground dark:bg-card">
      <Check size={15} />
      Selecionado
    </div>
  );
}

export { ActiveBadge, BulletItem, SelectedButton };
