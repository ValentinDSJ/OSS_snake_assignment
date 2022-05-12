import { System } from "../libs/ecs/System";
import Velocity, {getNameVelocity} from "../components/Velocity";
import Graphics, {getNameGraphics} from "../components/Graphics";
import Apple, {getNameApple} from "../components/Apple";
import Application, {getNameApplication} from "../components/Application";
import Snake, {getNameSnake} from "../components/Snake";
import Player, {getNamePlayer} from "../components/Player";
import Pause, {getNamePause} from "../components/Pause";
import GameOver, {getNameGameOver} from "../components/GameOver";

export default class AIControllerSystem extends System {

  update(delta: number) {
    const pause = this.componentManager.getComponentByType(getNamePause()) as Pause;
    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

    if (gameOver?.over || pause?.isPaused) {
      return;
    }

    const players = this.componentManager.getComponentsByType(getNamePlayer()) as Array<Player>;

    for (const player of players) {
      if (!player.isBot)
        continue;
      const keysEvent = [player.keyEventLeft, player.keyEventRight, player.keyEventUp, player.keyEventDown];

      document.dispatchEvent(new KeyboardEvent('keydown',  {'key': keysEvent[Math.floor(Math.random() * keysEvent.length)]}));
    }
  }
}
