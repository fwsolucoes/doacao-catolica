import { ListContactsUseCase } from "~/app/useCases/contacts/listContactsUseCase";
import { ListContactsController } from "~/infra/controllers/contacts/listContactsController";
import { ContactsGateway } from "~/infra/gateways/contacts";

const contactsGateway = new ContactsGateway();
const listContactsUseCase = new ListContactsUseCase(contactsGateway);
const listContactsController = new ListContactsController(listContactsUseCase);

const listContacts = {
  handle: listContactsController.handle.bind(listContactsController),
};

export { listContacts };
