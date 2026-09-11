import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  CircleDollarSign,
  Download,
  FileText,
  MessageCircle,
  Search,
  UserX,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { InputGroup } from "~/client/components/ui/input-group";
import { Select } from "~/client/components/ui/select";
import { Table } from "~/client/components/ui/table";

type Defaulter = {
  name: string;
  phone: string;
  email: string;
  overdueMonths: number;
  pendingAmount: string;
  registrationDate: string;
  campaignTotal: string;
  campaignCount: number;
};

const DEFAULTERS: Defaulter[] = [
  { name: "Marcos Vinícius Teixeira", phone: "(11) 98871-2245", email: "marcos.teixeira@gmail.com", overdueMonths: 7, pendingAmount: "R$ 735,00", registrationDate: "14/03/2024", campaignTotal: "R$ 1.240,00", campaignCount: 12 },
  { name: "Rita de Cássia Almeida", phone: "(21) 99120-8834", email: "rita.almeida@outlook.com", overdueMonths: 5, pendingAmount: "R$ 250,00", registrationDate: "02/07/2024", campaignTotal: "R$ 890,00", campaignCount: 18 },
  { name: "José Antônio Ribeiro", phone: "(31) 98455-1190", email: "jose.ribeiro@uol.com.br", overdueMonths: 11, pendingAmount: "R$ 1.650,00", registrationDate: "27/01/2025", campaignTotal: "R$ 450,00", campaignCount: 5 },
  { name: "Sandra Maria Lopes", phone: "(41) 99677-4412", email: "sandra.lopes@gmail.com", overdueMonths: 3, pendingAmount: "R$ 180,00", registrationDate: "19/09/2024", campaignTotal: "R$ 2.310,00", campaignCount: 27 },
  { name: "Paulo Henrique Costa", phone: "(51) 98330-7761", email: "paulo.costa@empresa.com.br", overdueMonths: 9, pendingAmount: "R$ 1.080,00", registrationDate: "05/11/2023", campaignTotal: "R$ 3.120,00", campaignCount: 41 },
  { name: "Célia Fernandes", phone: "(62) 98214-3387", email: "celia.fernandes@gmail.com", overdueMonths: 4, pendingAmount: "R$ 320,00", registrationDate: "23/04/2025", campaignTotal: "R$ 640,00", campaignCount: 8 },
  { name: "Roberto Carlos Dias", phone: "(85) 99502-6673", email: "roberto.dias@gmail.com", overdueMonths: 12, pendingAmount: "R$ 2.400,00", registrationDate: "12/12/2024", campaignTotal: "R$ 1.500,00", campaignCount: 15 },
  { name: "Adriana Nogueira", phone: "(71) 98844-2019", email: "adriana.nogueira@hotmail.com", overdueMonths: 2, pendingAmount: "R$ 120,00", registrationDate: "30/05/2025", campaignTotal: "R$ 380,00", campaignCount: 6 },
  { name: "Eduardo Menezes", phone: "(48) 99311-5540", email: "eduardo.menezes@gmail.com", overdueMonths: 6, pendingAmount: "R$ 540,00", registrationDate: "08/02/2024", campaignTotal: "R$ 970,00", campaignCount: 11 },
  { name: "Vera Lúcia Barros", phone: "(27) 98726-1103", email: "vera.barros@gmail.com", overdueMonths: 8, pendingAmount: "R$ 960,00", registrationDate: "16/08/2023", campaignTotal: "R$ 4.180,00", campaignCount: 52 },
];

function DefaultersReportPage() {
  const [months, setMonths] = useState("4");
  const [search, setSearch] = useState("");

  const filtered = DEFAULTERS.filter(
    (d) =>
      search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            to="../reports"
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft size={16} />
            Relatórios
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-heading)">
            Doadores Inadimplentes
          </h1>
          <p className="text-sm text-muted-foreground">
            Doadores com doações sem pagamento nos últimos 12 meses e valores pendentes na campanha.
          </p>
        </div>
        <Button variant="outline">
          <Download size={16} />
          Exportar XLS
        </Button>
      </div>

      <Card.Root className="p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-foreground">
              Quantidade de últimos meses sem pagamento
            </span>
            <Select.Root value={months} onValueChange={setMonths}>
              <Select.Trigger className="w-52">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                  <Select.Item key={n} value={String(n)}>
                    {n} {n === 1 ? "mês" : "meses"}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <Button>Atualizar</Button>
        </div>
      </Card.Root>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card.Root className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--spotlight-danger),0.16)] text-[rgb(var(--spotlight-danger))]">
              <UserX size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total de inadimplentes</p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">12</p>
              <p className="text-xs text-muted-foreground">Doadores com pagamentos em aberto</p>
            </div>
          </div>
        </Card.Root>

        <Card.Root className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--spotlight-warning),0.24)] text-[rgb(var(--spotlight-warning))]">
              <CalendarDays size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total médio por mês</p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">R$ 2.426,25</p>
              <p className="text-xs text-muted-foreground">Média mensal do valor pendente (12 meses)</p>
            </div>
          </div>
        </Card.Root>

        <Card.Root className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--badge-violet-bg) text-(--badge-violet-text)">
              <CircleDollarSign size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total médio por doador</p>
              <p className="text-xl font-semibold tracking-tight text-(--text-heading)">R$ 808,75</p>
              <p className="text-xs text-muted-foreground">Total pendente: R$ 9.705,00</p>
            </div>
          </div>
        </Card.Root>
      </div>

      <Card.Root className="gap-0 overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 p-7">
          <p className="text-sm font-semibold text-(--text-heading)">
            Doadores inadimplentes ({DEFAULTERS.length}) — Últimos {months} meses
          </p>
          <Button variant="outline" size="sm">
            <Download size={14} />
            Exportar XLS
          </Button>
        </div>

        <div className="px-7 pb-5">
          <InputGroup.Root className="max-w-80">
            <InputGroup.Addon>
              <Search size={16} />
            </InputGroup.Addon>
            <InputGroup.Input
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </InputGroup.Root>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Nome</Table.Head>
              <Table.Head>Telefone</Table.Head>
              <Table.Head>E-mail</Table.Head>
              <Table.Head className="text-right">Doações sem pagamento (12m)</Table.Head>
              <Table.Head className="text-right">Valor pendente</Table.Head>
              <Table.Head>Cadastro</Table.Head>
              <Table.Head className="text-right">Doações na campanha</Table.Head>
              <Table.Head className="text-center">Ações</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.length === 0 ? (
              <Table.Empty
                title="Nenhum doador encontrado."
                description="Tente ajustar o filtro de busca."
              />
            ) : (
              filtered.map((defaulter) => (
                <Table.Row key={defaulter.email}>
                  <Table.Cell className="font-semibold">{defaulter.name}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {defaulter.phone}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-6 p-0 text-[#25d366] hover:bg-transparent hover:text-[#25d366] hover:opacity-75"
                        title="WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">{defaulter.email}</Table.Cell>
                  <Table.Cell className="text-right">
                    <span className="inline-flex items-center justify-center rounded-full bg-destructive/15 px-3 py-0.5 text-xs font-semibold text-destructive">
                      {defaulter.overdueMonths}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-right font-semibold">{defaulter.pendingAmount}</Table.Cell>
                  <Table.Cell className="text-muted-foreground">{defaulter.registrationDate}</Table.Cell>
                  <Table.Cell className="text-right">
                    <span className="font-semibold">{defaulter.campaignTotal}</span>
                    <span className="text-muted-foreground"> · {defaulter.campaignCount}</span>
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <FileText size={14} />
                      Extrato
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>

        <div className="flex items-center justify-between border-t border-border px-7 py-4">
          <p className="text-sm text-muted-foreground">
            Página 1 de 2 — exibindo {Math.min(10, filtered.length)} de {DEFAULTERS.length} doadores
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próxima
            </Button>
          </div>
        </div>
      </Card.Root>
    </div>
  );
}

export { DefaultersReportPage };
