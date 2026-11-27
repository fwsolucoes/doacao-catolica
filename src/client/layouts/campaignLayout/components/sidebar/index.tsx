import {
  BarChart2,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Ticket,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { useMatches, useParams } from "react-router";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";
import { useCampaignLayout } from "~/client/hooks/useCampaignLayout";
import { useRoot } from "~/client/hooks/useRoot";
import { SidebarHelpLink } from "~/client/components/sidebarHelpLink";
import { SidebarUserMenu } from "~/client/components/sidebarUserMenu";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
} from "~/client/components/ui/sidebar";
import {
  SidebarNav,
  type SidebarNavSection,
} from "~/client/components/ui/sidebar-nav";

type Permission = (typeof PROJECT_ALL_PERMISSIONS)[number];

const SHALOM_ACCOUNT_ID = 94699;

const sections: SidebarNavSection[] = [
  {
    title: "Campanha",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "home" },
      { icon: Heart, label: "Doações", path: "donations" },
      { icon: Users, label: "Doadores", path: "donors" },
      {
        icon: Wallet,
        label: "Financeiro",
        subItems: [
          {
            label: "Transferências",
            path: "transfers",
            permission: "VIEW_FINANCIAL_TRANSFERS" satisfies Permission,
          },
          { label: "Métodos de pagamento", path: "payment-methods" },
          { label: "Pix Automático", path: "automatic-pix" },
          {
            label: "Métricas Shalom",
            path: "shalom-metrics",
            permission: "VIEW_FINANCIAL_STATEMENTS" satisfies Permission,
          },
        ],
      },
      { icon: BarChart2, label: "Relatórios", path: "reports" },
      {
        icon: MessageSquare,
        label: "Mensagens",
        subItems: [
          { label: "Régua de mensagens", path: "message-rules" },
          { label: "Templates META", path: "meta-templates" },
          { label: "Mensagens enviadas", path: "notifications" },
        ],
      },
      { icon: Ticket, label: "Sorteios", path: "raffles", matchNested: true },
      {
        icon: UserCog,
        label: "Usuários",
        subItems: [
          { label: "Colaboradores", path: "collaborators" },
          { label: "Embaixadores", path: "fundraisers" },
        ],
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      { icon: Settings, label: "Configurações", path: "settings/general-info" },
    ],
  },
];

function AppSidebar() {
  const { LIGHT_LOGO } = useRoot().environmentVariables;
  const { campaignId } = useParams<{ campaignId: string }>();
  const basePath = `/campaign/${campaignId}`;
  const matches = useMatches();
  const campaignData = matches.find(
    (m) => m.loaderData && typeof m.loaderData === "object" && "campaign" in m.loaderData,
  )?.loaderData as
    | { campaign: { accountId: number }; whatsappSettings: { type: string | null } | null }
    | undefined;
  const campaignAccountId = campaignData?.campaign?.accountId ?? null;
  const showShalomMetrics = campaignAccountId === SHALOM_ACCOUNT_ID;
  const isOfficialDoacaoCatolica = campaignData?.whatsappSettings?.type !== "custom";
  const { isPermissionGranted } = useCampaignLayout();

  const visibleSections: SidebarNavSection[] = sections.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.subItems
        ? {
            ...item,
            subItems: item.subItems.filter((sub) => {
              if (sub.label === "Métricas Shalom" && !showShalomMetrics) return false;
              if (sub.label === "Templates META") return !isOfficialDoacaoCatolica;
              if (sub.permission) return isPermissionGranted(sub.permission as Permission);
              return true;
            }),
          }
        : item,
    ),
  }));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-6">
        <img
          src={LIGHT_LOGO}
          alt="Logo"
          className="h-10 w-auto shrink-0 group-data-[collapsible=icon]:hidden"
        />
        <img
          src="/small-logo-icon.svg"
          alt="Logo"
          className="h-8 w-auto shrink-0 hidden group-data-[collapsible=icon]:block"
        />
      </SidebarHeader>

      <SidebarNav sections={visibleSections} basePath={basePath} />

      <SidebarHelpLink to={`${basePath}/help`} />

      <SidebarFooter className="pb-3">
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
