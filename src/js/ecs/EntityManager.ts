export default class EntityManager {
    private readonly entities: Map<number, Map<string, Array<Component>>>;
    private nextIdEntity;

    constructor() {
        this.entities = new Map<number, Map<string, Array<Component>>>();
        this.nextIdEntity = 0;
    }

    addEntity(components: Array<Component>) {
        components.map(component => {
            this.entities.get(this.nextIdEntity).get(component.name).push(component);
        })
        this.nextIdEntity++;
    }

    addComponentToEntity(idEntity: number, component: Component) {
        component.idEntity = idEntity;
        this.entities.get(idEntity).get(component.name).push(component);
    }

    addComponentsToEntity(idEntity: number, components: Array<Component>) {
        components.map(component => {
            this.addComponentToEntity(idEntity, component);
        })
        this.entities.get(idEntity)
    }

    removeEntity(idEntity: number) {
        this.entities.delete(idEntity);
    }

    removeComponentOfEntity(idEntity: number, type: string) {
        this.entities.get(idEntity).delete(type);
    }

    getComponentByType(idEntity: number, type: number): Array<Component> {
        return this.entities[idEntity][type];
    }

    getComponentsOfEntity(idEntity: number): Map<number, Array<Component>> {
        return this.entities[idEntity];
    }
}