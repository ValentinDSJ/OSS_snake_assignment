import { System } from "../libs/ecs/System";
import Save, {getNameSave} from "../components/Save";
import Snake, {Angle, Direction, getNameSnake} from "../components/Snake";
import Apple, {getNameApple} from "../components/Apple";
import GameSaved, {AppleSaved, SnakeSaved} from "../utils/GameSaved";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Velocity, {getNameVelocity} from "../components/Velocity";

export default class SaveSystem extends System {
  update(delta: number) {
    const save = this.componentManager.getComponentByType(getNameSave()) as Save;

    if (!save || !save.click)
      return;
    save.click = false;

    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const apples = this.componentManager.getComponentsByType(getNameApple()) as Array<Apple>;

    const gameSaved: GameSaved = <GameSaved>{
      apples: Array<AppleSaved>(),
      snakes: Array<SnakeSaved>()
    };

    for (const snake of snakes) {
      if (snake.dependsOn)
        continue;

      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;
      const velocity = this.entityManager.getComponentByType(snake.idEntity!, getNameVelocity()) as Velocity;

      gameSaved.snakes.push({
        type: graphic.type,
        isInit: graphic.isInit,
        angles: snake.angles,
        direction: snake.direction,
        // dependsOn: snake.dependsOn,
        x: graphic.sprite!.x,
        y: graphic.sprite!.y,
        velocity: velocity
      });
    }

    for (const apple of apples) {
      const graphic = this.entityManager.getComponentByType(apple.idEntity!, getNameGraphics()) as Graphics;

      gameSaved.apples.push({
        isAte: apple.isAte,
        x: graphic.sprite!.x,
        y: graphic.sprite!.y
      });
    }

    localStorage.setItem("saveGame", JSON.stringify(gameSaved));
  }
}
