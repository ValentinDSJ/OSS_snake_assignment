import EntityManager from "./EntityManager";
import ComponentManager from "./ComponentManager";

export class System {
    protected entityManager: EntityManager;
    protected componentManager: ComponentManager;
    protected localDelta: number;

    constructor(entityManager: EntityManager, componentManager: ComponentManager) {
        this.entityManager = entityManager;
        this.componentManager = componentManager;
        this.localDelta = 0;
    }

    setEntityManager(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    setComponentManager(componentManager: ComponentManager) {
        this.componentManager = componentManager;
    }

    awake() { }

    start() { }

    update(delta: number) { }

    stop() { }

    tearDown() { }
}