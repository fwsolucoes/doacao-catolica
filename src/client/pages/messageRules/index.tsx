import { useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Ellipsis,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Smartphone,
  Radio,
  Search,
  Send,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { Tabs } from "radix-ui";
import { cn } from "~/lib/utils";
import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/client/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/client/components/ui/popover";
import { FormField } from "~/client/components/ui/form-field";
import { ImageUpload } from "~/client/components/ui/image-upload";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";
import { Switch } from "~/client/components/ui/switch";
import { Table } from "~/client/components/ui/table";
import { Textarea } from "~/client/components/ui/textarea";
import { WhatsAppIcon } from "~/client/components/ui/whatsapp-icon";
import { NOTIFICATION_TYPES } from "~/client/constants/notificationTypes";

type Channel = "email" | "whatsapp" | "sms" | "ligacao";
type PaymentMethod = "pix" | "boleto" | "cartao";

type BillingRule = {
  id: string;
  name: string;
  description: string;
  channels: Channel[];
  paymentMethods: PaymentMethod[];
  active: boolean;
};

const BILLING_RULES: BillingRule[] = [
  {
    id: "1",
    name: "Cobrança - 3 dias antes",
    description: "Lembrete X dias antes do vencimento (3 dias)",
    channels: ["email", "whatsapp"],
    paymentMethods: ["pix", "boleto"],
    active: true,
  },
  {
    id: "2",
    name: "Cobrança - 1º aviso",
    description: "Cobrança X dias após vencimento (no dia)",
    channels: ["email", "whatsapp", "sms"],
    paymentMethods: ["pix", "cartao", "boleto"],
    active: true,
  },
  {
    id: "3",
    name: "Cobrança - 2º aviso",
    description: "Cobrança X dias após vencimento (3 dias)",
    channels: ["whatsapp", "sms"],
    paymentMethods: ["pix", "boleto"],
    active: true,
  },
  {
    id: "4",
    name: "Cobrança - 3º aviso",
    description: "Cobrança X dias após vencimento (7 dias)",
    channels: ["email", "whatsapp", "ligacao"],
    paymentMethods: ["pix", "cartao", "boleto"],
    active: false,
  },
];

const CHANNEL_BADGE: Record<Channel, { label: string; className: string }> = {
  email: { label: "E-mail", className: "bg-[#ede0ff] text-[#6b21a8]" },
  whatsapp: { label: "WhatsApp", className: "bg-[#d4f5e2] text-[#1f7a4d]" },
  sms: { label: "SMS", className: "bg-[#dbe8ff] text-[#1e40af]" },
  ligacao: { label: "Ligação", className: "bg-[#fef3c6] text-[#bb4d00]" },
};

const PAYMENT_BADGE: Record<
  PaymentMethod,
  { label: string; className: string }
> = {
  pix: { label: "Pix", className: "bg-[#cbfbf1] text-[#00786f]" },
  boleto: { label: "Boleto", className: "bg-[#e2e8f0] text-[#314158]" },
  cartao: { label: "Cartão", className: "bg-[#e0e7ff] text-[#432dd7]" },
};

function ChannelBadge({ channel }: { channel: Channel }) {
  const style = CHANNEL_BADGE[channel];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}

function PaymentBadge({ method }: { method: PaymentMethod }) {
  const style = PAYMENT_BADGE[method];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  iconBg,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: number;
  subtitle: string;
  iconBg: string;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <Card.Root className="gap-0 p-0">
      <div className="flex items-center justify-between px-7 pb-3 pt-7">
        <span className="text-sm font-semibold text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-7 pb-7">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Card.Root>
  );
}

const TEMPLATE_VARIABLES = [
  { label: "Nome do Contato", value: "{{nome}}" },
  { label: "Razão Social", value: "{{razao_social}}" },
  { label: "Nome Fantasia", value: "{{nome_fantasia}}" },
  { label: "CPF / CNPJ", value: "{{cpf_cnpj}}" },
  { label: "Código do Cliente", value: "{{codigo_cliente}}" },
  { label: "Email do Cliente", value: "{{email_cliente}}" },
  { label: "Telefone do Cliente", value: "{{telefone_cliente}}" },
  { label: "Valor Total", value: "{{valor_total}}" },
  { label: "Valor em Aberto", value: "{{valor_aberto}}" },
  { label: "Valor Pago", value: "{{valor_pago}}" },
  { label: "Valor com Desconto", value: "{{valor_desconto}}" },
  { label: "Data de Vencimento", value: "{{data_vencimento}}" },
  { label: "Vencimento Ajustado", value: "{{vencimento_ajustado}}" },
  { label: "Dias p/ Vencimento", value: "{{dias_vencimento}}" },
  { label: "Nome da Conta", value: "{{account_name}}" },
  { label: "Link WhatsApp", value: "{{link_whatsapp}}" },
];

const EMAIL_BODY_DEFAULT =
  "Olá {{nome}},\n\nEste é um lembrete do seu pagamento.\n\nAtenciosamente.";

function VariablePopover({
  onInsert,
  disabled,
}: {
  onInsert: (variable: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = TEMPLATE_VARIABLES.filter((v) =>
    v.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-fit" disabled={disabled}>
          <Plus size={14} />
          Inserir variável
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b border-border p-2">
          <Input
            leftIcon={Search}
            placeholder="Buscar variável..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length > 0 ? (
            filtered.map((v) => (
              <Button
                key={v.value}
                variant="ghost"
                className="h-auto w-full justify-between px-3 py-2 font-normal"
                onClick={() => {
                  onInsert(v.value);
                  setOpen(false);
                }}
              >
                <span className="text-sm">{v.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {v.value}
                </span>
              </Button>
            ))
          ) : (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Nenhuma variável encontrada.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const SMS_DEFAULT =
  `Caro cliente, consta débito vencido em: {{data_vencimento}}, R$ {{valor_aberto}}, Att,` +
  `\n{{account_name}}-Tel.{{telefone_contato}}-{{email_contato}}`;

const WHATSAPP_PREVIEW_TEXT = `Lembrete de vencimento
Olá {{nome}},
Gostaríamos de lembrar que vencerá em {{data_vencimento}} o título no valor de R$ {{valor_aberto}} ref. {{account_name}}.
Estamos à disposição, entre em contato conosco pelo link abaixo:
https://wa.me/55{{link_whatsapp}}
Obrigado`;

function NewBillingRuleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeChannel, setActiveChannel] = useState("whatsapp");
  const [messageType, setMessageType] = useState("");
  const [paymentMethods, setPaymentMethods] = useState({
    pix: true,
    cartao: true,
    boleto: true,
  });
  const [whatsappMessage, setWhatsappMessage] = useState(WHATSAPP_PREVIEW_TEXT);
  const whatsappCursorRef = useRef(WHATSAPP_PREVIEW_TEXT.length);
  const [emailSubject, setEmailSubject] = useState(
    "Lembrete de Vencimento - {{nome}}",
  );
  const [emailBody, setEmailBody] = useState(EMAIL_BODY_DEFAULT);
  const emailSubjectCursorRef = useRef(0);
  const emailBodyCursorRef = useRef(EMAIL_BODY_DEFAULT.length);
  const [smsMessage, setSmsMessage] = useState(SMS_DEFAULT);
  const smsCursorRef = useRef(SMS_DEFAULT.length);

  function insertSmsVariable(variable: string) {
    const pos = smsCursorRef.current;
    setSmsMessage((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    smsCursorRef.current = pos + variable.length;
  }

  function insertWhatsappVariable(variable: string) {
    const pos = whatsappCursorRef.current;
    const before = whatsappMessage.slice(0, pos);
    const after = whatsappMessage.slice(pos);
    setWhatsappMessage(before + variable + after);
    whatsappCursorRef.current = pos + variable.length;
  }

  function insertEmailSubjectVariable(variable: string) {
    const pos = emailSubjectCursorRef.current;
    setEmailSubject((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    emailSubjectCursorRef.current = pos + variable.length;
  }

  function insertEmailBodyVariable(variable: string) {
    const pos = emailBodyCursorRef.current;
    setEmailBody((prev) => prev.slice(0, pos) + variable + prev.slice(pos));
    emailBodyCursorRef.current = pos + variable.length;
  }

  function togglePayment(method: "pix" | "cartao" | "boleto") {
    setPaymentMethods((prev) => ({ ...prev, [method]: !prev[method] }));
  }

  const channelTabs = [
    { value: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon size={16} /> },
    { value: "email", label: "E-mail", icon: <Mail size={16} /> },
    { value: "sms", label: "SMS", icon: <MessageSquare size={16} /> },
    { value: "ligacao", label: "Ligação", icon: <Phone size={16} /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-[90vw] sm:max-w-[90vw] flex-col gap-0 p-0">
        <DialogHeader className="shrink-0 px-7 pt-7 pb-5">
          <DialogTitle>Nova régua de cobrança</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-7 pb-7">
          <div className="grid grid-cols-2 gap-5">
            <FormField name="name" label="Nome da mensagem" required>
              <Input name="name" placeholder="Ex.: Lembrete 3 dias antes" />
            </FormField>
            <FormField name="messageType" label="Tipo de mensagem" required>
              <Select.Root value={messageType} onValueChange={setMessageType}>
                <Select.Trigger>
                  <Select.Value placeholder="Selecione o tipo" />
                </Select.Trigger>
                <Select.Content>
                  {Object.entries(NOTIFICATION_TYPES).map(([value, label]) => (
                    <Select.Item key={value} value={value}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </FormField>
          </div>

          {(messageType === "payment_before_due_date" ||
            messageType === "payment_after_due_date") && (
            <div className="max-w-80">
              <FormField name="daysBefore" label="Dias antes do vencimento">
                <Input
                  name="daysBefore"
                  type="number"
                  defaultValue="3"
                  min={1}
                  max={1000}
                />
              </FormField>
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-foreground">
                Formas de pagamento ativas
              </p>
              <p className="text-xs text-muted-foreground">
                Esta mensagem será enviada apenas para doações com as formas
                selecionadas.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {(["pix", "cartao", "boleto"] as const).map((method) => {
                const label =
                  method === "cartao"
                    ? "Cartão"
                    : method.charAt(0).toUpperCase() + method.slice(1);
                return (
                  <div
                    key={method}
                    className={cn(
                      "flex items-center justify-between rounded-xl border bg-muted px-4 py-2.5",
                      paymentMethods[method]
                        ? "border-primary/40"
                        : "border-border",
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {label}
                    </span>
                    <Switch
                      checked={paymentMethods[method]}
                      onCheckedChange={() => togglePayment(method)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-5">
            <p className="text-sm font-semibold text-foreground">
              Mensagens por canal
            </p>

            <Tabs.Root value={activeChannel} onValueChange={setActiveChannel}>
              <Tabs.List className="inline-flex gap-1.5 rounded-2xl border border-border bg-muted/60 p-1.5">
                {channelTabs.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
                      "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
                      "hover:text-foreground",
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <Tabs.Content value="whatsapp" className="mt-5">
                <div className="grid grid-cols-5 gap-7">
                  <div className="col-span-3 flex flex-col gap-4">
                    {/* <FormField name="template" label="Template aprovado">
                      <Select.Root defaultValue="lembrete_vencimento">
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="lembrete_vencimento">
                            Lembrete de vencimento
                          </Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </FormField> */}
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground">
                        Inserir variável
                      </p>
                      <VariablePopover onInsert={insertWhatsappVariable} />
                    </div>
                    <FormField name="whatsappMessage" label="Mensagem WhatsApp">
                      <Textarea
                        name="whatsappMessage"
                        className="min-h-40 font-mono text-xs"
                        value={whatsappMessage}
                        onChange={(e) => {
                          setWhatsappMessage(e.target.value);
                          whatsappCursorRef.current = e.target.selectionStart;
                        }}
                        onSelect={(e) => {
                          whatsappCursorRef.current = (
                            e.target as HTMLTextAreaElement
                          ).selectionStart;
                        }}
                        onBlur={(e) => {
                          whatsappCursorRef.current = e.target.selectionStart;
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-span-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        Prévia
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Variáveis serão preenchidas no envio
                      </p>
                    </div>
                    <div className="overflow-clip rounded-2xl border border-border">
                      <div className="bg-[#007a55] px-5 py-3">
                        <span className="text-sm font-semibold text-white">
                          Empresa Demo
                        </span>
                      </div>
                      <div className="bg-[#ecfdf5] p-5">
                        <p className="whitespace-pre-wrap text-sm text-[#002c22]">
                          {whatsappMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="email" className="mt-5">
                <div className="grid grid-cols-5 gap-7">
                  <div className="col-span-3 flex flex-col gap-4">
                    <FormField name="emailLayout" label="Layout HTML">
                      <Select.Root defaultValue="basico">
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="basico">
                            Layout básico
                          </Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </FormField>

                    <FormField name="emailImage1" label="Imagem 1 (Topo)">
                      <ImageUpload
                        name="emailImage1"
                        width={600}
                        height={200}
                      />
                    </FormField>
                    {/* <FormField
                      name="emailImage2"
                      label="Imagem 2 (Rodapé - opcional)"
                    >
                      <ImageUpload
                        name="emailImage2"
                        width={600}
                        height={150}
                      />
                    </FormField> */}

                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground">
                        Assunto
                      </p>
                      <div className="flex w-full items-center gap-2.5">
                        <div className="min-w-0 flex-1">
                          <Input
                            value={emailSubject}
                            onChange={(e) => {
                              setEmailSubject(e.target.value);
                              emailSubjectCursorRef.current =
                                e.target.selectionStart ??
                                e.target.value.length;
                            }}
                            onSelect={(e) => {
                              emailSubjectCursorRef.current =
                                (e.target as HTMLInputElement).selectionStart ??
                                emailSubject.length;
                            }}
                            onBlur={(e) => {
                              emailSubjectCursorRef.current =
                                e.target.selectionStart ?? emailSubject.length;
                            }}
                          />
                        </div>
                        <VariablePopover
                          onInsert={insertEmailSubjectVariable}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground">
                        Corpo do e-mail
                      </p>
                      <VariablePopover onInsert={insertEmailBodyVariable} />
                      <Textarea
                        className="min-h-40 text-sm"
                        value={emailBody}
                        onChange={(e) => {
                          setEmailBody(e.target.value);
                          emailBodyCursorRef.current = e.target.selectionStart;
                        }}
                        onSelect={(e) => {
                          emailBodyCursorRef.current = (
                            e.target as HTMLTextAreaElement
                          ).selectionStart;
                        }}
                        onBlur={(e) => {
                          emailBodyCursorRef.current = e.target.selectionStart;
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        Prévia
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Variáveis serão preenchidas no envio
                      </p>
                    </div>
                    <div className="overflow-clip rounded-2xl border border-border">
                      <div className="border-b border-border bg-muted px-4 py-3">
                        <p className="text-xs text-muted-foreground">
                          Para: cliente@email.com
                        </p>
                        <p className="text-xs font-semibold text-foreground">
                          {emailSubject}
                        </p>
                      </div>
                      <div className="flex h-28 items-center justify-center bg-muted/50">
                        <span className="text-xs text-muted-foreground">
                          Imagem 1
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="whitespace-pre-wrap text-sm text-foreground">
                          {emailBody}
                        </p>
                      </div>
                      {/* <div className="flex h-24 items-center justify-center bg-muted/50">
                        <span className="text-xs text-muted-foreground">
                          Imagem 2 (opcional)
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="sms" className="mt-5">
                <div className="grid grid-cols-5 gap-7">
                  <div className="col-span-3 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground">
                        Inserir variável
                      </p>
                      <VariablePopover
                        onInsert={insertSmsVariable}
                        disabled={smsMessage.length >= 160}
                      />
                    </div>
                    <FormField name="smsMessage" label="Mensagem SMS">
                      <Textarea
                        name="smsMessage"
                        className="min-h-40 font-mono text-xs"
                        maxLength={160}
                        value={smsMessage}
                        onChange={(e) => {
                          setSmsMessage(e.target.value);
                          smsCursorRef.current = e.target.selectionStart;
                        }}
                        onSelect={(e) => {
                          smsCursorRef.current = (
                            e.target as HTMLTextAreaElement
                          ).selectionStart;
                        }}
                        onBlur={(e) => {
                          smsCursorRef.current = e.target.selectionStart;
                        }}
                      />
                    </FormField>
                    <p className="text-xs text-muted-foreground">
                      SMS limitado a 160 caracteres · {smsMessage.length} / 160
                    </p>
                  </div>

                  <div className="col-span-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        Prévia
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Variáveis serão preenchidas no envio
                      </p>
                    </div>
                    <div className="overflow-clip rounded-2xl border border-border bg-muted/30">
                      <div className="flex items-center justify-between px-5 py-4">
                        <span className="text-xs font-semibold text-foreground">
                          SMS
                        </span>
                        <Smartphone size={16} className="text-muted-foreground" />
                      </div>
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        <p className="whitespace-pre-wrap text-sm text-foreground">
                          {smsMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="ligacao" className="mt-5">
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Configuração de Ligação em breve.
                </p>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-border px-7 py-5">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BillingRulesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const activeCount = BILLING_RULES.filter((r) => r.active).length;
  const inactiveCount = BILLING_RULES.filter((r) => !r.active).length;
  const channelSet = new Set(BILLING_RULES.flatMap((r) => r.channels));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          label="Total"
          value={BILLING_RULES.length}
          subtitle="Templates cadastrados"
          iconBg="bg-blue-100"
          icon={Send}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Ativas"
          value={activeCount}
          subtitle="Em operação"
          iconBg="bg-emerald-100"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Inativas"
          value={inactiveCount}
          subtitle="Pausadas"
          iconBg="bg-rose-100"
          icon={XCircle}
          iconColor="text-rose-500"
        />
        <StatCard
          label="Canais"
          value={channelSet.size}
          subtitle="Canais utilizados"
          iconBg="bg-purple-100"
          icon={Radio}
          iconColor="text-purple-600"
        />
      </div>

      <Card.Root className="gap-0 p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-5">
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-semibold text-foreground">
              Réguas de cobrança
            </p>
            <p className="text-xs text-muted-foreground">
              Mensagens automáticas antes e após o vencimento.
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={18} />
            Nova régua de cobrança
          </Button>
        </div>

        <div className="p-7">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nome</Table.Head>
                <Table.Head>Canais</Table.Head>
                <Table.Head>Formas de pagamento</Table.Head>
                <Table.Head className="w-28">Ativo</Table.Head>
                <Table.Head className="w-16 text-right">Ações</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {BILLING_RULES.map((rule) => (
                <Table.Row key={rule.id}>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{rule.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {rule.description}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.channels.map((ch) => (
                        <ChannelBadge key={ch} channel={ch} />
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.paymentMethods.map((m) => (
                        <PaymentBadge key={m} method={m} />
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Switch checked={rule.active} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-xl"
                      >
                        <Ellipsis size={18} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </Card.Root>

      <NewBillingRuleDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

const HISTORY_CHANNEL_STYLE: Record<
  string,
  { label: string; className: string }
> = {
  whatsapp: { label: "WhatsApp", className: "bg-[#d4f5e2] text-[#1f7a4d]" },
  sms: { label: "SMS", className: "bg-[#dbe8ff] text-[#1447e6]" },
  email: { label: "E-mail", className: "bg-[#fef3c6] text-[#bb4d00]" },
};

const HISTORY_STATUS_BADGE: Record<
  string,
  { variant: "emerald" | "info" | "danger" | "neutral"; label: string }
> = {
  delivered: { variant: "emerald", label: "Entregue" },
  sent: { variant: "info", label: "Enviado" },
  failed: { variant: "danger", label: "Falha" },
};

type NotificationHistory = {
  id: string;
  customerName: string;
  contact: string;
  channel: string;
  message: string;
  errorMessage?: string;
  date: string;
  time: string;
  status: string;
};

const NOTIFICATION_HISTORY: NotificationHistory[] = [
  {
    id: "1",
    customerName: "João Silva",
    contact: "(11) 98765-4321",
    channel: "whatsapp",
    message: "Cobrança - 3 dias antes",
    date: "19/05/2026",
    time: "05:00:00",
    status: "delivered",
  },
  {
    id: "2",
    customerName: "Maria Santos",
    contact: "(21) 99123-4567",
    channel: "whatsapp",
    message: "Agradecimento (recorrência)",
    date: "20/05/2026",
    time: "11:30:00",
    status: "delivered",
  },
  {
    id: "3",
    customerName: "Pedro Oliveira",
    contact: "(31) 98888-7777",
    channel: "sms",
    message: "Cobrança - 2º aviso",
    date: "21/05/2026",
    time: "06:15:00",
    status: "delivered",
  },
  {
    id: "4",
    customerName: "João Silva",
    contact: "joao.silva@email.com",
    channel: "email",
    message: "Cobrança - 3 dias antes",
    date: "21/05/2026",
    time: "07:00:00",
    status: "sent",
  },
  {
    id: "5",
    customerName: "Ana Costa",
    contact: "(41) 97777-6666",
    channel: "sms",
    message: "Cobrança - 1º aviso",
    errorMessage: "Número de telefone inválido",
    date: "22/05/2026",
    time: "08:00:00",
    status: "failed",
  },
];

function HistoryChannelBadge({ channel }: { channel: string }) {
  const style = HISTORY_CHANNEL_STYLE[channel] ?? {
    label: channel,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        style.className,
      )}
    >
      {channel === "whatsapp" && <WhatsAppIcon size={14} />}
      {channel === "sms" && <MessageSquare size={14} />}
      {channel === "email" && <Mail size={14} />}
      {style.label}
    </span>
  );
}

function OtherMessagesTab() {
  const total = NOTIFICATION_HISTORY.length;
  const delivered = NOTIFICATION_HISTORY.filter(
    (n) => n.status === "delivered",
  ).length;
  const pending = NOTIFICATION_HISTORY.filter(
    (n) => n.status === "sent",
  ).length;
  const failed = NOTIFICATION_HISTORY.filter(
    (n) => n.status === "failed",
  ).length;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Histórico de notificações
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todas as notificações enviadas.
          </p>
        </div>
        <Button>
          <Download size={18} />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <StatCard
          label="Total"
          value={total}
          subtitle="Notificações enviadas"
          iconBg="bg-blue-100"
          icon={Send}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Entregues"
          value={delivered}
          subtitle="Confirmadas pelo canal"
          iconBg="bg-emerald-100"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Pendentes"
          value={pending}
          subtitle="Aguardando confirmação"
          iconBg="bg-amber-100"
          icon={Clock}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Falhas"
          value={failed}
          subtitle="Necessitam atenção"
          iconBg="bg-rose-100"
          icon={XCircle}
          iconColor="text-rose-500"
        />
      </div>

      <Card.Root className="gap-4 p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 max-w-lg flex-1">
            <Input
              leftIcon={Search}
              placeholder="Buscar por cliente, telefone, e-mail ou mensagem..."
            />
          </div>
          <Button variant="outline">
            <SlidersHorizontal size={18} />
            Filtros
          </Button>
        </div>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Cliente</Table.Head>
              <Table.Head>Contato</Table.Head>
              <Table.Head>Canal</Table.Head>
              <Table.Head>Mensagem</Table.Head>
              <Table.Head>Data/Hora</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {NOTIFICATION_HISTORY.map((item) => {
              const statusConfig = HISTORY_STATUS_BADGE[item.status];
              return (
                <Table.Row key={item.id}>
                  <Table.Cell className="font-semibold">
                    {item.customerName}
                  </Table.Cell>
                  <Table.Cell className="text-muted-foreground">
                    {item.contact}
                  </Table.Cell>
                  <Table.Cell>
                    <HistoryChannelBadge channel={item.channel} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{item.message}</span>
                      {item.status === "failed" && item.errorMessage && (
                        <span className="text-xs text-destructive">
                          {item.errorMessage}
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-0.5">
                      <span>{item.date}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={statusConfig?.variant ?? "neutral"}>
                      {statusConfig?.label ?? item.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card.Root>
    </div>
  );
}

function MessageRulesPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Automação de notificações
        </h1>
        <p className="text-muted-foreground">
          Configure réguas de cobrança e outras mensagens automáticas.
        </p>
      </div>

      <Tabs.Root defaultValue="billing">
        <Tabs.List className="mb-5 inline-flex gap-1.5 rounded-2xl border border-border bg-muted/60 p-1.5">
          <Tabs.Trigger
            value="billing"
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
              "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
              "hover:text-foreground",
            )}
          >
            <Bell size={16} />
            Réguas de cobrança
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
              {BILLING_RULES.length}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="other"
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors",
              "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
              "hover:text-foreground",
            )}
          >
            <MessageSquare size={16} />
            Outras mensagens
            <span className="rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-semibold">
              5
            </span>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="billing">
          <BillingRulesTab />
        </Tabs.Content>
        <Tabs.Content value="other">
          <OtherMessagesTab />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export { MessageRulesPage };
