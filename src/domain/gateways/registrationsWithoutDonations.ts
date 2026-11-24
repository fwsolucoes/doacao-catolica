import type { RegistrationsWithoutDonationsSearchParams } from "~/app/search/registrationsWithoutDonationsSearchParams";
import type { RegistrationsWithoutDonationsJson } from "../entities/registrationsWithoutDonations";

type RegistrationsWithoutDonationsGatewayDTO = {
  getRegistrationsWithoutDonations(
    searchParams: RegistrationsWithoutDonationsSearchParams,
  ): Promise<RegistrationsWithoutDonationsJson>;
};

export type { RegistrationsWithoutDonationsGatewayDTO };
