import { Calendar, Filter, Search, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Input } from "~/client/components/ui/input";
import { Select } from "~/client/components/ui/select";

const FILTER_PARAMS = [
  "start_date",
  "end_date",
  "log_type",
  "channel",
] as const;

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

type DateButtonProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
};

function DateButton({ value, onChange, placeholder }: DateButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    try {
      inputRef.current?.showPicker();
    } catch {
      inputRef.current?.click();
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="h-9 gap-2 text-sm font-normal text-muted-foreground"
        onClick={openPicker}
      >
        <Calendar size={14} />
        {value ? formatDate(value) : placeholder}
      </Button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute inset-0 opacity-0"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}

function FilterBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const sp = new URLSearchParams(location.search);
  const filterCount = FILTER_PARAMS.filter((p) => sp.get(p)).length;
  const hasSearch = !!sp.get("search");

  const [searchValue, setSearchValue] = useState(() => sp.get("search") ?? "");
  const [startDate, setStartDate] = useState(() => sp.get("start_date") ?? "");
  const [endDate, setEndDate] = useState(() => sp.get("end_date") ?? "");
  const [logType, setLogType] = useState(() => sp.get("log_type") ?? "");
  const [channel, setChannel] = useState(() => sp.get("channel") ?? "");

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSearchValue(p.get("search") ?? "");
    setStartDate(p.get("start_date") ?? "");
    setEndDate(p.get("end_date") ?? "");
    setLogType(p.get("log_type") ?? "");
    setChannel(p.get("channel") ?? "");
  }, [location.search]);

  function handleSearch(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(location.search);
      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("page");
      navigate(`?${next.toString()}`);
    }, 400);
  }

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  function clearAll() {
    const next = new URLSearchParams(location.search);
    FILTER_PARAMS.forEach((p) => next.delete(p));
    next.delete("search");
    next.delete("page");
    navigate(`?${next.toString()}`);
  }

  return (
    <Card.Root className="gap-0 p-0">
      <div className="px-5 pt-4">
        <Input
          leftIcon={Search}
          placeholder="Buscar por cliente, telefone, e-mail ou mensagem..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 px-5 py-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Filter size={14} />
          <span className="font-medium">Filtros:</span>
        </div>
        <DateButton
          value={startDate}
          onChange={(v) => {
            setStartDate(v);
            updateParam("start_date", v);
          }}
          placeholder="Data inicial"
        />
        <DateButton
          value={endDate}
          onChange={(v) => {
            setEndDate(v);
            updateParam("end_date", v);
          }}
          placeholder="Data final"
        />
        <Select.Root
          value={logType}
          onValueChange={(v) => {
            setLogType(v);
            updateParam("log_type", v);
          }}
        >
          <Select.Trigger className="h-9 w-auto min-w-40">
            <Select.Value placeholder="Todos os status" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="">Todos os status</Select.Item>
            <Select.Item value="success">Entregue</Select.Item>
            <Select.Item value="awaiting_confirmation">Enviado</Select.Item>
            <Select.Item value="error">Falha</Select.Item>
            <Select.Item value="not_send">Não enviado</Select.Item>
            <Select.Item value="blocked">Bloqueado</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root
          value={channel}
          onValueChange={(v) => {
            setChannel(v);
            updateParam("channel", v);
          }}
        >
          <Select.Trigger className="h-9 w-auto min-w-40">
            <Select.Value placeholder="Todos os canais" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="">Todos os canais</Select.Item>
            <Select.Item value="whatsapp">WhatsApp</Select.Item>
            <Select.Item value="sms">SMS</Select.Item>
            <Select.Item value="email">E-mail</Select.Item>
          </Select.Content>
        </Select.Root>
        {(filterCount > 0 || hasSearch) && (
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-1.5 text-destructive hover:opacity-75 hover:brightness-100"
            onClick={clearAll}
          >
            <XCircle size={15} />
            Limpar
          </Button>
        )}
      </div>
    </Card.Root>
  );
}

export { FilterBar };
