import { Eye, FileDown, FileSymlink, Mail, Plus } from "lucide-react";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Pagination } from "~/client/components/ui/pagination";
import { Table } from "~/client/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/client/components/ui/tooltip";

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

function WhatsAppIcon({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
  return (
    <Card.Root className="gap-4 p-6">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          className="h-9 min-h-0 w-auto gap-1.5 rounded-md px-4 text-sm"
        >
          <Plus size={14} />
          Adicionar pagamento
        </Button>
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

      <Card.Footer className="justify-between">
        <p className="flex-1 text-sm text-(--text-muted)">
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
