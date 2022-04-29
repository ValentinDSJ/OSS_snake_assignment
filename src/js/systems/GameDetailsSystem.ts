import Sprite from "../components/Sprite";
import { System } from "../libs/ecs/System";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";

export default class GameDetailsSystem extends System {
  start() {
    const element = document.querySelector(".game-scene .game-details");

    if (!element)
      return;
    const name = localStorage.getItem('name');
    const highestScore = localStorage.getItem('highestScore');
    const playerNameHTML = element.querySelector(".player-name span");
    const highestScoreHTML = element.querySelector(".highest-score span");

    if (playerNameHTML && name) {
      playerNameHTML.innerHTML = name;
      playerNameHTML.parentElement!.classList.remove("hide");
    }
    if (highestScoreHTML) {
      if (highestScore) {
        highestScoreHTML.innerHTML = highestScore;
      } else {
        localStorage.setItem('highestScore', '0');
      }
    }
  }

  update(delta: number) {
    const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;

    const actualScoreHTML = document.querySelector(".game-scene .game-details .actual-score span");

    if (actualScoreHTML && player) {
      actualScoreHTML.innerHTML = player.score.toString();
    }
  }
}
