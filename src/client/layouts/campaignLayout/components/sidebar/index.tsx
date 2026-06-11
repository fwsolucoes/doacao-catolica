import {
  BarChart,
  BarChart2,
  Calendar,
  FileCheck,
  FileText,
  Heart,
  LayoutDashboard,
  Megaphone,
  Plug,
  Receipt,
  ScrollText,
  Settings,
  UserCheck,
  Users,
  Users2,
} from "lucide-react";
import { useRoot } from "~/client/hooks/useRoot";
import { cn } from "~/lib/utils";

type NavItem = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "",
    items: [{ icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    title: "GESTÃO",
    items: [
      { icon: Heart, label: "Doações", active: true },
      { icon: Megaphone, label: "Campanhas" },
      { icon: UserCheck, label: "Doadores" },
      { icon: Calendar, label: "Eventos" },
      { icon: Users, label: "Voluntários" },
    ],
  },
  {
    title: "FINANCEIRO",
    items: [
      { icon: Receipt, label: "Repasses" },
      { icon: FileText, label: "Despesas" },
      { icon: FileCheck, label: "Prestação de contas" },
    ],
  },
  {
    title: "RELATÓRIOS",
    items: [
      { icon: BarChart, label: "Relatório mensal" },
      { icon: BarChart2, label: "Relatório anual" },
      { icon: ScrollText, label: "Recibos" },
    ],
  },
  {
    title: "CONFIGURAÇÕES",
    items: [
      { icon: Settings, label: "Geral" },
      { icon: Users2, label: "Equipe" },
      { icon: Plug, label: "Integrações" },
    ],
  },
];

function NavItemRow({ icon: Icon, label, active }: NavItem) {
  return (
    <div className="flex items-center gap-2 py-px pr-3">
      <div
        className={cn(
          "h-[30px] w-[3px] rounded-br rounded-tr shrink-0",
          active ? "bg-[#60a5fa]" : "bg-transparent"
        )}
      />
      <div
        className={cn(
          "flex flex-1 items-center gap-2.5 rounded-lg px-3 h-10",
          active ? "bg-white/10" : ""
        )}
      >
        <Icon
          size={18}
          className={active ? "text-[#f1f5f9]" : "text-[#94a3b8]"}
        />
        <span
          className={cn(
            "text-sm whitespace-nowrap",
            active ? "font-semibold text-[#f1f5f9]" : "font-normal text-[#94a3b8]"
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function Sidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;

  return (
    <nav className="fixed left-0 top-0 flex h-screen w-68 flex-col bg-[#0f172a] pb-4 z-40">
      <div className="flex h-16 shrink-0 items-center px-5">
        <img src={LIGHT_LOGO} alt="Sancton" className="h-8 w-auto shrink-0" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        {sections.map((section) => (
          <div key={section.title || "__root__"} className="flex flex-col gap-1">
            {section.title ? (
              <span className="px-5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]/60">
                {section.title}
              </span>
            ) : null}
            {section.items.map((item) => (
              <NavItemRow key={item.label} {...item} />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}

export { Sidebar };
