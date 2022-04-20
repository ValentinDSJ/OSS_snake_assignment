export default class ComponentManager {
    private components: Map<string, Array<Component>>

    addComponent(component: Component) {
        this.components.get(component.name).push(component);
    }

    removeComponentOfEntity(idEntity: number) {
        this.components.forEach((components, key) => {
            components.filter(component => component.idEntity == idEntity);
        });
    }

    removeComponentOfEntityByType(idEntity: number, type: string) {
        this.components.forEach((components, key) => {
            components.filter(component => component.idEntity == idEntity && component.name == type);
        });
    }
}