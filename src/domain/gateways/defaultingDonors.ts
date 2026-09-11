import type { DefaultingDonorsSearchParams } from "~/app/search/defaultingDonorsSearchParams";
import type { DefaultingDonorsJson } from "../entities/defaultingDonors";

type DefaultingDonorsGatewayDTO = {
  getDefaultingDonors(
    searchParams: DefaultingDonorsSearchParams,
  ): Promise<DefaultingDonorsJson>;
};

export type { DefaultingDonorsGatewayDTO };
