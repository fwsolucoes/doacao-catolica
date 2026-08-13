import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import { cn } from "~/lib/utils";
import { AddFundraiserModal } from "./components/addFundraiserModal";

type Fundraiser = {
  id: string;
  initials: string;
  name: string;
  email: string;
  commission: string;
  referrals: number;
};

const MOCK_FUNDRAISERS: Fundraiser[] = [
  {
    id: "1",
    initials: "AB",
    name: "Ana Beatriz Lima",
    email: "ana@parceiro.org",
    commission: "5%",
    referrals: 128,
  },
  {
    id: "2",
    initials: "JP",
    name: "João Pedro Souza",
    email: "joao@parceiro.org",
    commission: "3,5%",
    referrals: 76,
  },
  {
    id: "3",
    initials: "LP",
    name: "Luciana Prado",
    email: "luciana@parceiro.org",
    commission: "—",
    referrals: 41,
  },
  {
    id: "4",
    initials: "MV",
    name: "Marcos Vinícius",
    email: "marcos@parceiro.org",
    commission: "7%",
    referrals: 19,
  },
];

function FundraisersPage() {
  const [tab, setTab] = useState<"active" | "pending">("active");
  const [addOpen, setAddOpen] = useState(false);
  const isActiveTab = tab === "active";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Arrecadadores
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os arrecadadores, suas comissões e as indicações de doadores.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus size={16} />
          Adicionar arrecadador
        </Button>
      </div>

      <AddFundraiserModal open={addOpen} onClose={() => setAddOpen(false)} />

      <div className="flex flex-col gap-4">
        <div className="flex w-fit items-center gap-1 rounded-[13px] border border-border bg-muted/60 p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-xl",
              isActiveTab
                ? "bg-[#e6e6ed] text-foreground hover:bg-[#e6e6ed] hover:text-foreground"
                : "text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
            )}
            onClick={() => setTab("active")}
          >
            <Users size={15} />
            Ativos
            <span className="rounded-full bg-muted-foreground/15 px-2 text-xs">
              {MOCK_FUNDRAISERS.length}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-xl",
              !isActiveTab
                ? "bg-[#e6e6ed] text-foreground hover:bg-[#e6e6ed] hover:text-foreground"
                : "text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
            )}
            onClick={() => setTab("pending")}
          >
            <Send size={15} />
            Convites pendentes
            <span className="rounded-full bg-muted-foreground/15 px-2 text-xs">
              1
            </span>
          </Button>
        </div>

        <Card.Root className="gap-4 pt-7">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nome</Table.Head>
                <Table.Head>E-mail</Table.Head>
                <Table.Head>Comissão</Table.Head>
                <Table.Head>Indicações</Table.Head>
                <Table.Head className="text-right">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isActiveTab ? (
                MOCK_FUNDRAISERS.map((fundraiser) => (
                  <Table.Row key={fundraiser.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3.5">
                        <Avatar size="lg">
                          <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                            {fundraiser.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">
                          {fundraiser.name}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-mono text-xs text-muted-foreground">
                      {fundraiser.email}
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      {fundraiser.commission}
                    </Table.Cell>
                    <Table.Cell className="text-muted-foreground">
                      <span className="text-foreground">{fundraiser.referrals}</span>
                      {" doadores"}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 rounded-xl text-xs"
                        >
                          <BarChart2 size={14} />
                          Detalhes
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 text-muted-foreground"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Empty title="Nenhum convite pendente." />
              )}
            </Table.Body>
          </Table.Root>

          <div className="flex items-center justify-between border-t border-border px-7 py-5">
            <p className="text-sm text-muted-foreground">
              Total de{" "}
              <span className="text-foreground">{MOCK_FUNDRAISERS.length}</span>{" "}
              registros
            </p>
            <div className="flex items-center gap-2.5">
              <p className="text-sm text-muted-foreground">
                Página <span className="text-foreground">1</span> de{" "}
                <span className="text-foreground">1</span>
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-xl opacity-50"
                  disabled
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-xl"
                  disabled
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </Card.Root>
      </div>
    </div>
  );
}

export { FundraisersPage };
