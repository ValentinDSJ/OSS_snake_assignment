export default class EntityManager {
  private readonly entities: Map<number, Map<string, Array<Component>>>;
  private nextIdEntity;

  constructor() {
    this.entities = new Map<number, Map<string, Array<Component>>>();
    this.nextIdEntity = 0;
  }

  addEntity(components: Array<Component>): number {
    components.map((component) => {
      component.idEntity = this.nextIdEntity;
      if (!this.entities.get(this.nextIdEntity)) {
        this.entities.set(
          this.nextIdEntity,
          new Map<string, Array<Component>>()
        );
      }
      if (!this.entities.get(this.nextIdEntity)!.get(component.name)) {
        this.entities
          .get(this.nextIdEntity)!
          .set(component.name, new Array<Component>());
      }
      this.entities.get(this.nextIdEntity)!.get(component.name)!.push(component);
    });
    this.nextIdEntity++;
    return this.nextIdEntity - 1;
  }

  addComponentToEntity(idEntity: number, component: Component) {
    component.idEntity = idEntity;
    this.entities.get(idEntity).get(component.name).push(component);
  }

  addComponentsToEntity(idEntity: number, components: Array<Component>) {
    components.map((component) => {
      this.addComponentToEntity(idEntity, component);
    });
    this.entities.get(idEntity);
  }

  removeEntity(idEntity: number) {
    this.entities.delete(idEntity);
  }

  removeComponentOfEntity(idEntity: number, type: string) {
    if (this.entities.get(idEntity)) {
      this.entities.get(idEntity)!.delete(type);
    }
  }

  getComponentsByType(idEntity: number, type: string): Array<Component> {
    if (idEntity < 0) {
      return [];
    }
    if (!this.entities.get(idEntity)) return [];
    if (!this.entities.get(idEntity)!.get(type)) return [];
    return this.entities.get(idEntity)!.get(type)!;
  }

  getComponentByType(idEntity: number, type: string): Component {
    if (!this.entities.get(idEntity).get(type)) return null;
    const components = this.entities.get(idEntity).get(type);
    if (components.length == 0) return null;
    return components[0];
  }

  getComponentsOfEntity(
    idEntity?: number
  ): Map<string, Array<Component>> | undefined {
    if (!idEntity) return undefined;

    return this.entities.get(idEntity);
  }
}
