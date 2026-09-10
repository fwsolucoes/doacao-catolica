type CampaignSelectProps = {
  id: string;
  name: string;
};

class CampaignSelect {
  readonly id: string;
  readonly name: string;

  private constructor(props: CampaignSelectProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static restore(props: CampaignSelectProps): CampaignSelect {
    return new CampaignSelect(props);
  }

  toJson() {
    return { id: this.id, name: this.name };
  }
}

export { CampaignSelect };
