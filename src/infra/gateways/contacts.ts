import type { ContactsSearchParams } from "~/app/search/contactsSearchParams";
import type {
  ContactOption,
  ContactsGatewayDTO,
} from "~/domain/gateways/contacts";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { listContactsSchema } from "../schemas/external/contacts";

class ContactsGateway implements ContactsGatewayDTO {
  async listContacts(
    searchParams: ContactsSearchParams,
    token: string,
  ): Promise<ContactOption[]> {
    let url = "/contact/find-many";
    url += searchParams.toExternal(["page", "pageLimit"]);

    console.log("URL de busca de contatos:", url);

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(listContactsSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return data.items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.contactInfo?.email ?? undefined,
      phone: item.contactInfo?.phone ?? undefined,
      cpf: item.cpf ?? undefined,
      birthDate: item.birth_date ?? undefined,
    }));
  }
}

export { ContactsGateway };
