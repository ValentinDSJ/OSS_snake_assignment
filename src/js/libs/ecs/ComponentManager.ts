export default class ComponentManager {
  private components: Map<string, Array<Component>>;

  constructor() {
    this.components = new Map<string, Array<Component>>();
  }

  addComponent(component: Component) {
    if (!this.components.get(component.name)) {
      this.components.set(component.name, new Array<Component>());
    }
    this.components.get(component.name)?.push(component);
  }

  addComponents(components: Array<Component>) {
    components.map((component) => {
      this.addComponent(component);
    });
  }

  removeComponentOfEntity(idEntity: number) {
    this.components.forEach((components, key) => {
      components.filter((component) => component.idEntity == idEntity);
    });
  }

  removeComponentOfEntityByType(idEntity: number, type: string) {
    this.components.forEach((components, key) => {
      components.filter(
        (component) => component.idEntity == idEntity && component.name == type
      );
    });
  }

  getComponentsByType(type: string): Array<Component> {
    return this.components.get(type) ?? [];
  }

  getComponentByType(type: string): Component | null {
    const c = this.components.get(type);
    if (!c || c.length == 0) {
      return null;
    }
    return c[0];
  }
}
