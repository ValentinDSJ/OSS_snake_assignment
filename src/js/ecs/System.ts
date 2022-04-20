import EntityManager from "./EntityManager";
import ComponentManager from "./ComponentManager";

export class System {
    private entityManager?: EntityManager;
    private componentManager?: ComponentManager;

    constructor() {
        this.entityManager = null;
        this.componentManager = null;
    }

    setEntityManager(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    setComponentManager(componentManager: ComponentManager) {
        this.componentManager = componentManager;
    }

    awake() {}

    start() {}

    update() {}

    stop() {}

    tearDown() {}
}