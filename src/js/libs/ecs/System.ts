import EntityManager from "./EntityManager";
import ComponentManager from "./ComponentManager";

export class System {
    protected entityManager: EntityManager;
    protected componentManager: ComponentManager;

    constructor(entityManager: EntityManager, componentManager: ComponentManager) {
        this.entityManager = entityManager;
        this.componentManager = componentManager;
    }

    setEntityManager(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    setComponentManager(componentManager: ComponentManager) {
        this.componentManager = componentManager;
    }

    awake() {}

    start() {}

    update(delta: number) {}

    stop() {}

    tearDown() {}
}