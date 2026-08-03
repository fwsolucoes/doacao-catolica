type ProjectCategoryConstructorProps = {
  id: string;
  name: string;
};

type ProjectCategoryRestoreProps = ProjectCategoryConstructorProps;

class ProjectCategory {
  id: string;
  name: string;

  private constructor(props: ProjectCategoryConstructorProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static restore(props: ProjectCategoryRestoreProps): ProjectCategory {
    return new ProjectCategory({ id: props.id, name: props.name });
  }

  toJson() {
    return { id: this.id, name: this.name };
  }
}

export { ProjectCategory };
