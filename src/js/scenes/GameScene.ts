import Scene from "../libs/ecs/Scene";
import GraphicsSystem from "../systems/GraphicsSystem";
import EventsSystem from "../systems/EventsSystem";
import MenuPrefabs from "../prefabs/MenuPrefabs";
import GamePrefabs from "../prefabs/GamePrefabs";

export default class GameScene extends Scene {
    initSystems() {
        this.systemManager.addSystem(new GraphicsSystem(this.entityManager, this.componentManager));
        this.systemManager.addSystem(new EventsSystem(this.entityManager, this.componentManager));
    }

    initEntities() {
        this.initEntity(GamePrefabs.createButton());
    }
}