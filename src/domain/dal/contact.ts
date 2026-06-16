import type { Contact } from "../views/contact";

type ContactDalDTO = {
  listContacts(accountId: string, token: string, name?: string): Promise<Contact[]>;
};

export type { ContactDalDTO };
