/** Bilhetes = parte inteira de (valor da doação ÷ valor do bilhete), calculada em centavos. */
function countTickets(donationAmount: number, ticketPrice: number): number {
  const priceInCents = Math.round(ticketPrice * 100);
  if (priceInCents <= 0) return 0;
  return Math.floor(Math.round(donationAmount * 100) / priceInCents);
}

function formatTicketCount(count: number): string {
  return `${count.toLocaleString("pt-BR")} ${count === 1 ? "bilhete" : "bilhetes"}`;
}

function formatQuotient(donationAmount: number, ticketPrice: number): string {
  if (ticketPrice <= 0) return "—";
  return (donationAmount / ticketPrice).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  });
}

export { countTickets, formatQuotient, formatTicketCount };
