import { Eye, FileDown, FileSymlink, Mail, Plus } from "lucide-react";
import { Link, useParams } from "react-router";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { Card } from "~/client/components/ui/card";
import { Pagination } from "~/client/components/ui/pagination";
import { Table } from "~/client/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";

const TOTAL_PAGES = 12;
const CURRENT_PAGE = 1;
const VISIBLE_PAGES = [1, 2, 3, 4];

type BadgeVariant = "success" | "danger" | "warning" | "info";
type PaymentTipo = "Recorrente" | "Pontual";
type PaymentStatus =
  | "Disponível para saque"
  | "Aguardando pagamento"
  | "Cancelado"
  | "Vencido"
  | "Falha no pagamento"
  | "Estornado"
  | "Pagamento confirmado"
  | "Excluído"
  | "Recebido";
type NotificadoPor = "email" | "whatsapp";
type PaymentType = "Pix" | "Pix automático" | "Boleto";

type Payment = {
  id: number;
  nome: string;
  tipo: PaymentTipo;
  valor: string;
  status: PaymentStatus;
  notificadoPor?: NotificadoPor;
  paymentType: PaymentType;
  vencimento: string;
  pago: string;
};

const payments: Payment[] = [
  {
    id: 1,
    nome: "João Silva",
    tipo: "Recorrente",
    valor: "R$ 50,00",
    status: "Vencido",
    notificadoPor: "email",
    paymentType: "Pix",
    vencimento: "10/06/2026",
    pago: "",
  },
  {
    id: 2,
    nome: "Maria Santos",
    tipo: "Recorrente",
    valor: "R$ 30,00",
    status: "Aguardando pagamento",
    notificadoPor: "whatsapp",
    paymentType: "Pix automático",
    vencimento: "08/06/2026",
    pago: "",
  },
  {
    id: 3,
    nome: "Pedro Costa",
    tipo: "Pontual",
    valor: "R$ 100,00",
    status: "Pagamento confirmado",
    notificadoPor: "email",
    paymentType: "Boleto",
    vencimento: "05/06/2026",
    pago: "05/06/2026",
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    tipo: "Recorrente",
    valor: "R$ 25,00",
    status: "Cancelado",
    paymentType: "Pix",
    vencimento: "01/06/2026",
    pago: "",
  },
  {
    id: 5,
    nome: "Carlos Mendes",
    tipo: "Pontual",
    valor: "R$ 200,00",
    status: "Disponível para saque",
    notificadoPor: "whatsapp",
    paymentType: "Pix automático",
    vencimento: "03/06/2026",
    pago: "03/06/2026",
  },
  {
    id: 6,
    nome: "Fernanda Lima",
    tipo: "Recorrente",
    valor: "R$ 5,00",
    status: "Falha no pagamento",
    notificadoPor: "email",
    paymentType: "Pix",
    vencimento: "01/06/2026",
    pago: "",
  },
  {
    id: 7,
    nome: "Roberto Nunes",
    tipo: "Pontual",
    valor: "R$ 75,00",
    status: "Estornado",
    paymentType: "Boleto",
    vencimento: "28/05/2026",
    pago: "28/05/2026",
  },
  {
    id: 8,
    nome: "Juliana Rocha",
    tipo: "Recorrente",
    valor: "R$ 45,00",
    status: "Recebido",
    notificadoPor: "whatsapp",
    paymentType: "Pix",
    vencimento: "07/06/2026",
    pago: "07/06/2026",
  },
  {
    id: 9,
    nome: "Marcos Alves",
    tipo: "Pontual",
    valor: "R$ 300,00",
    status: "Excluído",
    notificadoPor: "email",
    paymentType: "Boleto",
    vencimento: "15/05/2026",
    pago: "",
  },
];

const STATUS_BADGE: Record<PaymentStatus, BadgeVariant> = {
  "Disponível para saque": "success",
  "Pagamento confirmado": "success",
  Recebido: "success",
  "Aguardando pagamento": "warning",
  Estornado: "warning",
  Cancelado: "danger",
  Vencido: "danger",
  "Falha no pagamento": "danger",
  Excluído: "danger",
};

const TIPO_BADGE: Record<PaymentTipo, BadgeVariant> = {
  Recorrente: "success",
  Pontual: "warning",
};

const PAYMENT_TYPE_BADGE: Record<PaymentType, BadgeVariant> = {
  Pix: "info",
  "Pix automático": "info",
  Boleto: "warning",
};

function ActionButton({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-(--secondary)"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function PaymentsTable() {
  const { campaignId } = useParams<{ campaignId: string }>();

  return (
    <Card.Root className="gap-4 p-6">
      <div className="flex justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 min-h-0 w-auto gap-1.5 rounded-md px-4 text-sm"
            >
              <Plus size={14} />
              Adicionar pagamento
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/campaign/${campaignId}/create-recurrence`}>
                Criar recorrência
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Criar pagamento avulso</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          className="h-9 min-h-0 w-auto gap-1.5 rounded-md px-4 text-sm"
        >
          <FileDown size={14} />
          Exportar relatório
        </Button>
      </div>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nome</Table.Head>
            <Table.Head>Tipo</Table.Head>
            <Table.Head>Valor</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-center">Notificado por</Table.Head>
            <Table.Head>Tipo</Table.Head>
            <Table.Head>Vencimento</Table.Head>
            <Table.Head>Pago em</Table.Head>
            <Table.Head className="text-center">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {payments.map((payment) => (
            <Table.Row key={payment.id}>
              <Table.Cell>{payment.nome}</Table.Cell>
              <Table.Cell>
                <Badge variant={TIPO_BADGE[payment.tipo]}>{payment.tipo}</Badge>
              </Table.Cell>
              <Table.Cell>{payment.valor}</Table.Cell>
              <Table.Cell>
                <Badge variant={STATUS_BADGE[payment.status]}>
                  {payment.status}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-center">
                {payment.notificadoPor === "email" ? (
                  <Mail size={16} className="inline text-(--text-muted)" />
                ) : payment.notificadoPor === "whatsapp" ? (
                  <WhatsAppIcon
                    size={16}
                    className="inline text-[rgb(var(--spotlight-success))]"
                  />
                ) : null}
              </Table.Cell>
              <Table.Cell>
                <Badge variant={PAYMENT_TYPE_BADGE[payment.paymentType]}>
                  {payment.paymentType}
                </Badge>
              </Table.Cell>
              <Table.Cell>{payment.vencimento}</Table.Cell>
              <Table.Cell>{payment.pago || "—"}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-center gap-0.5">
                  <ActionButton tooltip="Visualizar detalhes">
                    <Eye size={16} className="text-[rgb(var(--spotlight-info))]" />
                  </ActionButton>
                  <ActionButton tooltip="Link da fatura">
                    <FileSymlink
                      size={16}
                      className="text-[rgb(var(--spotlight-warning))]"
                    />
                  </ActionButton>
                  <ActionButton tooltip="Enviar lembrete">
                    <WhatsAppIcon
                      size={16}
                      className="text-[rgb(var(--spotlight-success))]"
                    />
                  </ActionButton>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-(--text-muted)">
          Exibindo {CURRENT_PAGE} de {TOTAL_PAGES} páginas
        </p>
        <Pagination.Root>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous href="#" />
            </Pagination.Item>
            {VISIBLE_PAGES.map((page) => (
              <Pagination.Item key={page}>
                <Pagination.Link href="#" isActive={page === CURRENT_PAGE}>
                  {page}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Link href="#">{TOTAL_PAGES}</Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Next href="#" />
            </Pagination.Item>
          </Pagination.Content>
        </Pagination.Root>
      </Card.Footer>
    </Card.Root>
  );
}

export { PaymentsTable };
