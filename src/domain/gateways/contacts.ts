import type { ContactsSearchParams } from "~/app/search/contactsSearchParams";

type ContactOption = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
};

type ContactsGatewayDTO = {
  listContacts(
    searchParams: ContactsSearchParams,
    token: string,
  ): Promise<ContactOption[]>;
};

export type { ContactsGatewayDTO, ContactOption };
