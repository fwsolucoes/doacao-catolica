import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
import { Table } from "~/client/components/ui/table";
import { TablePagination } from "~/client/components/ui/table-pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/client/components/ui/tooltip";
import type { BirthdayCelebrantsLoader } from "~/client/types/birthdayCelebrantsLoader";

type BirthdayCelebrants =
  BirthdayCelebrantsLoader["birthdayCelebrants"];

type BirthdayCelebrantsTableProps = {
  birthdayCelebrants: BirthdayCelebrants;
};

const NOT_INFORMED = "Não informado";

function openWhatsapp(whatsapp: string) {
  window.open(`https://wa.me/${whatsapp.replace(" ", "")}`, "_blank");
}

function BirthdayCelebrantsTable({
  birthdayCelebrants,
}: BirthdayCelebrantsTableProps) {
  const { data, meta } = birthdayCelebrants;

  return (
    <Card.Root className="gap-4 rounded-lg p-6">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nome</Table.Head>
            <Table.Head>Data de aniversário</Table.Head>
            <Table.Head>Telefone</Table.Head>
            <Table.Head>Email</Table.Head>
            <Table.Head className="w-24 text-right">Ações</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((celebrant) => (
            <Table.Row key={celebrant.id}>
              <Table.Cell className="font-medium">
                {celebrant.name}
              </Table.Cell>
              <Table.Cell className="text-muted-foreground">
                {celebrant.birthdate}
              </Table.Cell>
              <Table.Cell className="text-muted-foreground">
                {celebrant.whatsapp}
              </Table.Cell>
              <Table.Cell className="text-muted-foreground">
                {celebrant.email}
              </Table.Cell>
              <Table.Cell className="text-right">
                {celebrant.whatsapp !== NOT_INFORMED && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-9"
                          aria-label="Falar no Whatsapp"
                          onClick={() => openWhatsapp(celebrant.whatsapp)}
                        >
                          <img
                            src="/whatsapp-logo.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="size-5"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Falar no Whatsapp</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
          {!data.length && <Table.Empty />}
        </Table.Body>
      </Table.Root>

      {meta.totalPages > 0 && (
        <Card.Footer className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <TablePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
          />
        </Card.Footer>
      )}
    </Card.Root>
  );
}

export { BirthdayCelebrantsTable };
