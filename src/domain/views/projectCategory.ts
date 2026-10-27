type ProjectCategoryConstructorProps = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
};

type ProjectCategoryRestoreProps = ProjectCategoryConstructorProps;

class ProjectCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;

  private constructor(props: ProjectCategoryConstructorProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.icon = props.icon;
  }

  static restore(props: ProjectCategoryRestoreProps): ProjectCategory {
    return new ProjectCategory({
      id: props.id,
      name: props.name,
      description: props.description,
      icon: props.icon,
    });
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
    };
  }
}

export { ProjectCategory };
