import { ListContactsUseCase } from "~/app/useCases/contacts/listContactsUseCase";
import { ListContactsController } from "~/infra/controllers/contacts/listContactsController";
import { CampaignGateway } from "~/infra/gateways/campaign";
import { ContactsGateway } from "~/infra/gateways/contacts";


const contactsGateway = new ContactsGateway();
const campaignGateway = new CampaignGateway();
const listContactsUseCase = new ListContactsUseCase(contactsGateway, campaignGateway);
const listContactsController = new ListContactsController(listContactsUseCase);

const listContacts = {
  handle: listContactsController.handle.bind(listContactsController),
};

export { listContacts };
