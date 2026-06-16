import type { ContactDalDTO } from "~/domain/dal/contact";
import { Contact } from "~/domain/views/contact";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { listContactsSchema } from "../schemas/external/contacts";

class ContactDal implements ContactDalDTO {
  async listContacts(
    accountId: string,
    token: string,
    name?: string,
  ): Promise<Contact[]> {
    const params = new URLSearchParams();
    params.set("filter[account_id]", accountId);
    if (name) params.set("name", name);

    const url = `/contact/select?${params.toString()}`;

    const apiResponse = await api.get(url, { token });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(listContactsSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return data.map((item) => Contact.restore({ id: item.id, name: item.name }));
  }
}

export { ContactDal };
