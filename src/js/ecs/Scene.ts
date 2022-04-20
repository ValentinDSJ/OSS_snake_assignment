import SystemManager from "./SystemManager";
import ComponentManager from "./ComponentManager";
import EntityManager from "./EntityManager";

export default class Scene {
    private entityManager: EntityManager;
    private componentManager: ComponentManager;
    private systemManager: SystemManager;

    awake() {
        this.systemManager.awake();
    }

    start() {
        this.systemManager.start();
    }

    update() {
        this.systemManager.update()
    }

    stop() {
        this.systemManager.stop();
    }

    tearDown() {
        this.systemManager.tearDown();
    }

}