import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";
import { NavLink, useLocation, useMatch } from "react-router";
import { cn } from "~/lib/utils";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/client/components/ui/sidebar";

type SidebarNavSubItem = {
  label: string;
  path?: string;
};

type SidebarNavItem = {
  icon: ComponentType<{ size?: number }>;
  label: string;
  path?: string;
  subItems?: SidebarNavSubItem[];
};

type SidebarNavSection = {
  title: string;
  items: SidebarNavItem[];
};

type SidebarNavProps = {
  sections: SidebarNavSection[];
  basePath?: string;
};

function resolvePath(basePath: string, path?: string) {
  if (!path) return null;
  return basePath ? `${basePath}/${path}` : path;
}

function SimpleNavItem({
  icon: Icon,
  label,
  path,
  basePath,
}: SidebarNavItem & { basePath: string }) {
  const to = resolvePath(basePath, path);
  const match = useMatch(to ?? "/__no_route__");
  const isActive = !!match && !!to;

  return (
    <SidebarMenuItem>
      {to ? (
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={label}
          size="lg"
          className="rounded-xl hover:bg-accent data-[active=true]:bg-accent"
        >
          <NavLink to={to} end>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip={label}
          size="lg"
          className="cursor-default opacity-60 rounded-xl"
        >
          <Icon size={20} />
          <span>{label}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

function CollapsibleNavItem({
  icon: Icon,
  label,
  subItems,
  basePath,
}: {
  icon: ComponentType<{ size?: number }>;
  label: string;
  subItems: SidebarNavSubItem[];
  basePath: string;
}) {
  const { pathname } = useLocation();
  const hasActiveChild = subItems.some(
    (item) => item.path && pathname === resolvePath(basePath, item.path),
  );
  const [open, setOpen] = useState(hasActiveChild);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={hasActiveChild}
        tooltip={label}
        onClick={() => setOpen((o) => !o)}
        size="lg"
        className="rounded-xl hover:bg-accent data-[active=true]:bg-accent"
      >
        <Icon size={20} />
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "ml-auto shrink-0 transition-transform duration-200",
            open && "-rotate-180",
          )}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {subItems.map((item) => {
            const to = resolvePath(basePath, item.path);
            const isActive = !!to && pathname === to;
            return (
              <SidebarMenuSubItem key={item.label}>
                {to ? (
                  <SidebarMenuSubButton asChild isActive={isActive}>
                    <NavLink to={to} end>
                      {item.label}
                    </NavLink>
                  </SidebarMenuSubButton>
                ) : (
                  <SidebarMenuSubButton className="cursor-default opacity-60">
                    {item.label}
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

function SidebarNav({ sections, basePath = "" }: SidebarNavProps) {
  return (
    <SidebarContent>
      {sections.map((section) => (
        <SidebarGroup key={section.title}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {section.items.map((item) =>
              item.subItems ? (
                <CollapsibleNavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  subItems={item.subItems}
                  basePath={basePath}
                />
              ) : (
                <SimpleNavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  basePath={basePath}
                />
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

export { SidebarNav };
export type { SidebarNavItem, SidebarNavSection, SidebarNavSubItem };
