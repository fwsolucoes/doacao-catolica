import { ListContactsUseCase } from "~/app/useCases/contacts/listContactsUseCase";
import { ListContactsController } from "~/infra/controllers/contacts/listContactsController";
import { ContactDal } from "~/infra/dal/contact";
import { CampaignGateway } from "~/infra/gateways/campaign";

const contactDal = new ContactDal();
const campaignGateway = new CampaignGateway();
const listContactsUseCase = new ListContactsUseCase(contactDal, campaignGateway);
const listContactsController = new ListContactsController(listContactsUseCase);

const listContacts = {
  handle: listContactsController.handle.bind(listContactsController),
};

export { listContacts };
