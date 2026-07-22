import { formatDate } from "@arkyn/shared";

type CampaignConstructorProps = {
  id: string;
  accountId: number;
  subAccountId: string;
  name: string;
  description: string | null;
  noEndDate: boolean;
  monthlyGoal: string | undefined;
  totalGoal: string | null;
  startDate: string | null;
  endDate: string | null;
  currentRevenue: string | null;
  status: boolean;
  published: boolean;
  phone: string | null;
  address: string | null;
  cnpj: string | null;
  email: string | null;
  institutionName: string | null;
  image: string | null;
  imageMobile: string | null;
  videoUrl: string | null;
  headerImage: string | null;
  type: number;
  typeDonation: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  apiDonationPublicId: string | null;
};

type CampaignRestoreProps = CampaignConstructorProps;

class Campaign {
  id: string;
  accountId: number;
  subAccountId: string;
  name: string;
  description: string | null;
  noEndDate: boolean;
  monthlyGoal: string | undefined;
  totalGoal: string | null;
  startDate: string | null;
  endDate: string | null;
  currentRevenue: string | null;
  status: boolean;
  published: boolean;
  phone: string | null;
  address: string | null;
  cnpj: string | null;
  email: string | null;
  institutionName: string | null;
  image: string | null;
  imageMobile: string | null;
  videoUrl: string | null;
  headerImage: string | null;
  type: number;
  typeDonation: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  apiDonationPublicId: string | null;

  private constructor(props: CampaignConstructorProps) {
    this.id = props.id;
    this.accountId = props.accountId;
    this.subAccountId = props.subAccountId;
    this.name = props.name;
    this.description = props.description;
    this.noEndDate = props.noEndDate;
    this.monthlyGoal = props.monthlyGoal;
    this.totalGoal = props.totalGoal;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.currentRevenue = props.currentRevenue;
    this.status = props.status;
    this.published = props.published;
    this.phone = props.phone;
    this.address = props.address;
    this.cnpj = props.cnpj;
    this.email = props.email;
    this.institutionName = props.institutionName;
    this.image = props.image;
    this.imageMobile = props.imageMobile;
    this.videoUrl = props.videoUrl;
    this.headerImage = props.headerImage;
    this.type = props.type;
    this.typeDonation = props.typeDonation;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.slug = props.slug;
    this.apiDonationPublicId = props.apiDonationPublicId;
  }

  static restore(props: CampaignRestoreProps): Campaign {
    return new Campaign(props);
  }

  toJson() {
    return {
      id: this.id,
      accountId: this.accountId,
      subAccountId: this.subAccountId,
      name: this.name,
      description: this.description,
      noEndDate: this.noEndDate,
      monthlyGoal: this.monthlyGoal,
      totalGoal: this.totalGoal,
      startDate: this.startDate
        ? formatDate(
            [this.startDate.split("T")[0]],
            "timestamp",
            "DD/MM/YYYY - hh:mm",
          )
        : null,
      endDate: this.endDate
        ? formatDate(
            [this.endDate.split("T")[0]],
            "timestamp",
            "DD/MM/YYYY - hh:mm",
          )
        : null,
      currentRevenue: this.currentRevenue ?? null,
      status: this.status,
      published: this.published,
      phone: this.phone,
      address: this.address,
      cnpj: this.cnpj,
      email: this.email,
      institutionName: this.institutionName,
      image: this.image,
      imageMobile: this.imageMobile,
      videoUrl: this.videoUrl,
      headerImage: this.headerImage,
      type: this.type,
      typeDonation: this.typeDonation,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      slug: this.slug,
      apiDonationPublicId: this.apiDonationPublicId,
    };
  }
}

export { Campaign };
