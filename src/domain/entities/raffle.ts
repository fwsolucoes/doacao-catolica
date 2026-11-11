import { formatCurrency } from "~/lib/formatCurrency";
import { splitApiDateTime } from "~/lib/splitApiDateTime";

type RaffleSummary = {
  totalNumbers: number;
  sold: number;
  canceled: number;
  reserved: number;
  remaining: number;
  available: number;
  collected: number;
};

type RaffleProps = {
  id: string;
  accountReference: string;
  name: string;
  enabled: boolean;
  ticketPrice: number;
  startNumber: number;
  endNumber: number;
  nextNumber: number;
  // raw datetime strings from the API, e.g. "2026-11-01 00:00:00"
  startsAt: string;
  endsAt: string;
  isOpen: boolean;
  summary: RaffleSummary;
};

// known values: "active" | "inactive"
type RaffleStatus = string;

function formatInteger(value: number): string {
  return value.toLocaleString("pt-BR");
}

class Raffle {
  readonly id: string;
  readonly accountReference: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly ticketPrice: number;
  readonly startNumber: number;
  readonly endNumber: number;
  readonly nextNumber: number;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly isOpen: boolean;
  readonly summary: RaffleSummary;

  private constructor(props: RaffleProps) {
    this.id = props.id;
    this.accountReference = props.accountReference;
    this.name = props.name;
    this.enabled = props.enabled;
    this.ticketPrice = props.ticketPrice;
    this.startNumber = props.startNumber;
    this.endNumber = props.endNumber;
    this.nextNumber = props.nextNumber;
    this.startsAt = props.startsAt;
    this.endsAt = props.endsAt;
    this.isOpen = props.isOpen;
    this.summary = props.summary;
  }

  static restore(props: RaffleProps): Raffle {
    return new Raffle(props);
  }

  get status(): RaffleStatus {
    return this.enabled ? "active" : "inactive";
  }

  get totalNumbers(): number {
    return this.summary.totalNumbers;
  }

  /**
   * Depois da primeira venda (compra reservada/paga ou número emitido) a API trava
   * ticket_price e start_number, e o end_number só pode ser ampliado.
   */
  get hasSales(): boolean {
    if (this.nextNumber > this.startNumber) return true;
    return this.summary.sold + this.summary.canceled + this.summary.reserved > 0;
  }

  toJson() {
    const startsAt = splitApiDateTime(this.startsAt);
    const endsAt = splitApiDateTime(this.endsAt);
    const total = this.totalNumbers;

    return {
      id: this.id,
      accountReference: this.accountReference,
      name: this.name,
      status: this.status,
      enabled: this.enabled,
      isOpen: this.isOpen,
      hasSales: this.hasSales,
      ticketPrice: this.ticketPrice,
      ticketPriceLabel: formatCurrency(String(this.ticketPrice)),
      startNumber: this.startNumber,
      endNumber: this.endNumber,
      numberRangeLabel: `${formatInteger(this.startNumber)} – ${formatInteger(this.endNumber)}`,
      totalNumbersLabel: `${formatInteger(total)} ${total === 1 ? "bilhete" : "bilhetes"}`,
      startDate: startsAt?.date ?? this.startsAt,
      endDate: endsAt?.date ?? this.endsAt,
      startDateInput: startsAt?.isoDate ?? "",
      endDateInput: endsAt?.isoDate ?? "",
      summary: this.summary,
    };
  }
}

type RaffleJson = ReturnType<Raffle["toJson"]>;

export { Raffle };
export type { RaffleJson, RaffleProps, RaffleStatus, RaffleSummary };
