import { splitApiDateTime } from "~/lib/splitApiDateTime";

type RaffleTicketProps = {
  id: string;
  // a API devolve o número como string, ex.: "25000"
  number: string;
  // known values: "active" | "canceled"
  status: string;
  customerName: string;
  // raw datetime string from the API, e.g. "2026-11-07 07:38:59"
  createdAt: string;
};

class RaffleTicket {
  readonly id: string;
  readonly number: string;
  readonly status: string;
  readonly customerName: string;
  readonly createdAt: string;

  private constructor(props: RaffleTicketProps) {
    this.id = props.id;
    this.number = props.number;
    this.status = props.status;
    this.customerName = props.customerName;
    this.createdAt = props.createdAt;
  }

  static restore(props: RaffleTicketProps): RaffleTicket {
    return new RaffleTicket(props);
  }

  toJson() {
    const createdAt = splitApiDateTime(this.createdAt);

    return {
      id: this.id,
      number: this.number,
      numberLabel: `#${this.number.padStart(4, "0")}`,
      status: this.status,
      customerName: this.customerName || "—",
      createdAt: createdAt ? `${createdAt.date} ${createdAt.time}` : this.createdAt,
    };
  }
}

type RaffleTicketJson = ReturnType<RaffleTicket["toJson"]>;

export { RaffleTicket };
export type { RaffleTicketJson, RaffleTicketProps };
