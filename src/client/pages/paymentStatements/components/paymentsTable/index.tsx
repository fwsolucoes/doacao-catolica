import {
  Eye,
  FileText,
  Mail,
  MoreHorizontal,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router";
import { Avatar, AvatarFallback } from "~/client/components/ui/avatar";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Input } from "~/client/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Card } from "~/client/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/client/components/ui/popover";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import type { PaymentStatementsLoader } from "~/client/types/paymentStatementsLoader";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "violet"
  | "emerald"
  | "navy"
  | "amber";

const STATUS_BADGE: Record<string, BadgeVariant> = {
  "Disponível para saque": "emerald",
  "Pagamento confirmado": "emerald",
  Recebido: "emerald",
  "Aguardando pagamento": "amber",
  Estornado: "neutral",
  Cancelado: "danger",
  Vencido: "danger",
  "Falha no pagamento": "danger",
  Excluído: "danger",
  Processando: "info",
};

const ORIGIN_BADGE: Record<string, BadgeVariant> = {
  Recorrente: "violet",
  Pontual: "neutral",
};

const PAYMENT_TYPE_BADGE: Record<string, BadgeVariant> = {
  Pix: "emerald",
  "Pix automático": "emerald",
  Boleto: "amber",
  "Cartão de crédito": "navy",
};

// Always uses first and last word — e.g. "João Paulo Silva" → "JS"
function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  const parts = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return parts.map((w) => w[0].toUpperCase()).join("");
}

function ActionsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl text-muted-foreground"
        >
          <MoreHorizontal size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1.5" align="end" sideOffset={4}>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
        >
          <Eye size={16} />
          Ver detalhes
        </Button>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
        >
          <FileText size={16} />
          Acessar fatura
        </Button>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
        >
          <Receipt size={16} />
          Emitir recibo
        </Button>
        <div className="my-1 h-px bg-muted" />
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-5 rounded-lg px-2.5 py-2 text-sm font-normal text-muted-foreground hover:bg-muted"
        >
          <WhatsAppIcon size={16} />
          Enviar Lembrete
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function PaymentsTable() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { payments } = useLoaderData<PaymentStatementsLoader>();

  const { data, meta } = payments;

  return (
    <Card.Root className="gap-4 p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex-1">
          <Input
            leftIcon={Search}
            placeholder="Buscar por nome, telefone, e-mail ou CPF..."
            className="h-11 rounded-xl border-transparent bg-muted/50"
          />
        </div>
        <Button
          variant="outline"
          className="h-11 min-h-0 shrink-0 gap-2 rounded-xl px-4 text-sm"
        >
          <SlidersHorizontal size={16} />
          Filtros
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-11 min-h-0 shrink-0 gap-2 rounded-xl px-4 text-sm">
              <Plus size={16} />
              Adicionar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/campaign/${campaignId}/create-recurrence`}>
                <RefreshCw size={16} className="text-foreground" />
                Criar recorrência
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Zap size={16} className="text-foreground" />
              Criar pagamento avulso
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Doador</Table.Head>
            <Table.Head>Tipo</Table.Head>
            <Table.Head>Valor</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-center">Notificado por</Table.Head>
            <Table.Head>Método</Table.Head>
            <Table.Head>Vencimento</Table.Head>
            <Table.Head>Pagamento</Table.Head>
            <Table.Head className="text-right">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((payment) => (
            <Table.Row key={payment.id}>
              <Table.Cell>
                <div className="flex items-center gap-3.5">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-sidebar-accent-foreground/10 text-xs font-bold text-sidebar-accent-foreground">
                      {getInitials(payment.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">
                      {payment.customerName}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {payment.customerDocument ?? "—"}
                    </span>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  className="py-3"
                  variant={ORIGIN_BADGE[payment.origin] ?? "neutral"}
                >
                  {payment.origin === "Recorrente" && (
                    <RefreshCw size={11} className="shrink-0" />
                  )}
                  {payment.origin}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-secondary-foreground font-semibold">
                {payment.amount}
              </Table.Cell>
              <Table.Cell>
                <Badge
                  className="py-3"
                  variant={STATUS_BADGE[payment.status] ?? "neutral"}
                >
                  {payment.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-center gap-2">
                  <Mail
                    size={16}
                    className={
                      payment.notifiedByEmail
                        ? "text-muted-foreground"
                        : "text-muted-foreground/30"
                    }
                  />
                  <WhatsAppIcon
                    size={16}
                    className={
                      payment.notifiedByWhatsApp
                        ? "text-[rgb(var(--spotlight-success))]"
                        : "text-muted-foreground/30"
                    }
                  />
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  className="py-3"
                  variant={PAYMENT_TYPE_BADGE[payment.paymentType] ?? "neutral"}
                >
                  {payment.paymentType}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-sm text-muted-foreground">
                {payment.dueDate}
              </Table.Cell>
              <Table.Cell className="text-sm text-muted-foreground">
                {payment.paidDate ?? "—"}
              </Table.Cell>
              <Table.Cell className="text-right">
                <ActionsPopover />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <TablePagination currentPage={meta.page} totalPages={meta.totalPages} />
      </Card.Footer>
    </Card.Root>
  );
}

export { PaymentsTable };
