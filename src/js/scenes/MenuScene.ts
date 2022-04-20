import Scene from "../libs/ecs/Scene";
import MenuPrefabs from "../prefabs/MenuPrefabs";
import GraphicsSystem from "../systems/GraphicsSystem";
import EventsSystem from "../systems/EventsSystem";

export default class MenuScene extends Scene {
    initSystems() {
        this.systemManager.addSystem(new GraphicsSystem(this.entityManager, this.componentManager));
        this.systemManager.addSystem(new EventsSystem(this.entityManager, this.componentManager));
    }

    initEntities() {
        this.initEntity(MenuPrefabs.createButton());
    }
}