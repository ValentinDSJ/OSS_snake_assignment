import {System} from "../libs/ecs/System";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Graphics, {getNameGraphics} from "../components/Graphics";
import Restart, {getNameRestart} from "../components/Restart";
import Application, {getNameApplication} from "../components/Application";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Apple, {getNameApple} from "../components/Apple";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";

export default class RestartSystem extends System {
  update(delta: number) {
    const restart = this.componentManager.getComponentByType(getNameRestart()) as Restart;

    if (!restart || !restart.click)
      return;
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const app = this.componentManager.getComponentByType(getNameApplication()) as Application;

    for (let i = 0; i < snakes.length; i++) {
      if (i < 4) {
        continue;
      }
      const snake = snakes.pop();

      const graphic = this.entityManager.getComponentByType(snake!.idEntity!, getNameGraphics()) as Graphics;

      this.componentManager.removeComponentOfEntity(snake!.idEntity!);
      this.entityManager.removeEntity(snake!.idEntity!);

      if (graphic.graphics) {
        graphic.graphics.destroy();
        // app.app?.stage.removeChild(graphic.graphics);
      } else if (graphic.sprite) {
        graphic.sprite.destroy();
        // app.app?.stage.removeChild(graphic.sprite);
      }
    }

    let i = 1;
    for (const snake of snakes) {
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;
      const velocity = this.entityManager.getComponentByType(snake.idEntity!, getNameVelocity()) as Velocity;

      snake.direction = Direction.UP;
      snake.dependsOn = undefined;
      snake.angles = [];
      velocity.x = 0;
      velocity.y = -2;
      velocity.skip = 0;
      graphic.sprite!.x = app.blockSizeX * 20 + (graphic.sprite!.width / 2);
      graphic.sprite!.y = app.blockSizeY * (20 + i) + (graphic.sprite!.height / 2);
      graphic.sprite!.rotation = 0;
      i++;
    }

    const apple = this.componentManager.getComponentByType(getNameApple()) as Apple;
    apple.isAte = true;

    const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;
    player.score = 0;

    restart.click = false;

    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;
    gameOver.over = false;

    const element = document.querySelector('body main .game-scene .game-over');
    element?.classList.add("hidden");
  }
}
