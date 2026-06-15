import { ContactsSearchParams } from "~/app/search/contactsSearchParams";
import type { ContactOption, ContactsGatewayDTO } from "~/domain/gateways/contacts";

class ListContactsUseCase {
  constructor(private contactsGateway: ContactsGatewayDTO) {}

  async execute(token: string): Promise<ContactOption[]> {
    const searchParams = new ContactsSearchParams({});
    return this.contactsGateway.listContacts(searchParams, token);
  }
}

export { ListContactsUseCase };
