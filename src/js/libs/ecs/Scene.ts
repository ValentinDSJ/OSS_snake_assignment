import * as PIXI from 'pixi.js';
import SystemManager from "./SystemManager";
import ComponentManager from "./ComponentManager";
import EntityManager from "./EntityManager";
import Application from "../../components/Application";

export default class Scene {
    protected entityManager: EntityManager;
    protected componentManager: ComponentManager;
    protected systemManager: SystemManager;

    constructor() {
        this.entityManager = new EntityManager();
        this.componentManager = new ComponentManager();
        this.systemManager = new SystemManager();
    }

    initEntity(components: Array<Component>) {
        this.entityManager.addEntity(components);
        this.componentManager.addComponents(components);
    }

    initSystems() { };

    initEntities() { };

    awake(sharedEntities?: Array<Array<Component>>) {
        if (sharedEntities) {
            sharedEntities.map(entity => {
                this.initEntity(entity);
            });
        }
        this.initSystems();
        this.initEntities();
        this.systemManager.awake();
    }

    start() {
        this.systemManager.start();
    }

    update(delta: number) {
        this.systemManager.update(delta);
    }

    stop() {
        this.systemManager.stop();
    }

    tearDown() {
        this.systemManager.tearDown();
    }

}