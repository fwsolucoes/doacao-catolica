type AmbassadorRegionConstructorProps = { value: string };

class AmbassadorRegion {
  value: string;

  private constructor(props: AmbassadorRegionConstructorProps) {
    this.value = props.value;
  }

  static restore(props: AmbassadorRegionConstructorProps): AmbassadorRegion {
    return new AmbassadorRegion({ value: props.value });
  }

  toJson() {
    return { value: this.value };
  }
}

export { AmbassadorRegion };
