import Scene from "../libs/ecs/Scene";
import MenuPrefabs from "../prefabs/MenuPrefabs";
import GraphicsSystem from "../systems/GraphicsSystem";
import EventsSystem from "../systems/EventsSystem";
import HTMLSystem from "../systems/HTMLSystem";
import RankingPrefabs from "../prefabs/RankingPrefabs";

export default class RankingScene extends Scene {
    initSystems() {
        this.systemManager.addSystem(new HTMLSystem(this.entityManager, this.componentManager));
    }

    initEntities() {
        this.initEntity(RankingPrefabs.createRankingHTML());
    }
}