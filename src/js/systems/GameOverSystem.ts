import Sprite from "../components/Sprite";
import { System } from "../libs/ecs/System";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";
import HighestScores from "../utils/HighestScores";

export default class GameOverSystem extends System {
  start() {
    let element = document.querySelector("body main .game-scene .game-over");

    if (!element)
      return;
    let inputName = element.querySelector('input[name="your-name"]');
    const name = localStorage.getItem('name');
    inputName?.setAttribute('value', name ?? '');

    inputName?.addEventListener('change', (event) => {
      // @ts-ignore
      const value = event.target.value;
      const playerNameHTMLElement = document.querySelector(".game-scene .game-details .player-name span");

      if (value.length === 0) {
        localStorage.removeItem('name');
        if (playerNameHTMLElement?.parentNode) {
          playerNameHTMLElement.parentElement!.classList.add("hide");
        }
      } else {
        if (playerNameHTMLElement) {
          playerNameHTMLElement.innerHTML = value;
          playerNameHTMLElement.parentElement!.classList.remove("hide");
        }
        localStorage.setItem('name', value);
      }
    });
  }

  update(delta: number) {
    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

    if (!gameOver?.over || gameOver?.exit) {
      return;
    }
    const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;
    const scoreHTML = document.querySelector("body main .game-scene .game-over .final-score p span");

    if (scoreHTML && player) {
      if (scoreHTML.innerHTML !== player.score.toString()) {
        scoreHTML.innerHTML = player.score.toString();
      }
    }

    let element = document.querySelector("body main .game-scene .game-over");

    element?.classList.remove('hidden');

    if (!gameOver.scoreSaved) {
      this.savedScore();
    }
  }

  savedScore() {
    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;
    const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;
    const name = localStorage.getItem('name');

    let score = <HighestScores>{
      score: player.score,
      name: name,
      date: new Date()
    };

    let savedScoresString = localStorage.getItem('highestScores');
    let scores = Array<HighestScores>();

    if (savedScoresString) {
      scores = JSON.parse(savedScoresString) as Array<HighestScores>;
    }
    scores.push(score);
    localStorage.setItem('highestScores', JSON.stringify(scores));
    gameOver.scoreSaved = true;
  }
}
