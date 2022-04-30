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
      this.updateLatestScoreName(localStorage.getItem("name"));
      this.updateHighestScoreFromName(value);
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
      this.savedHighScore();
    }
  }

  updateHighestScoreFromName(name: string) {
    let savedScoresString = localStorage.getItem('highestScores');
    let scores = Array<HighestScores>();
    const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;
    const highestScoreHTMLElement = document.querySelector(".game-scene .game-details .highest-score span");

    if (!savedScoresString || !player || !highestScoreHTMLElement) {
      return;
    }
    scores = JSON.parse(savedScoresString) as Array<HighestScores>;
    let highestScore = 0;
    for (const score of scores) {
      if (score.name == name) {
        const s = player.score > score.score ? player.score : score.score;
        localStorage.setItem("highestScore", s.toString());
        highestScoreHTMLElement.innerHTML = s.toString();
        return;
      }
    }
    localStorage.setItem("highestScore", player.score.toString());
    highestScoreHTMLElement.innerHTML = player.score.toString();
  }

  savedHighScore() {
    const player = this.componentManager.getComponentByType(getNamePlayer()) as Player;

    localStorage.setItem("highestScore", player.highestScore.toString());
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

    GameOverSystem.saveLatestScoreIfExist();
    localStorage.setItem('latestScore', JSON.stringify(score));
    gameOver.scoreSaved = true;
  }

  static saveLatestScoreIfExist() {
    let latestScoreJSON = localStorage.getItem('latestScore');

    if (!latestScoreJSON || latestScoreJSON.length == 0) {
      return;
    }
    let latestScore = JSON.parse(latestScoreJSON) as HighestScores;

    if (!latestScore.name || latestScore.name.length == 0) {
      localStorage.removeItem('latestScore');
      return;
    }

    let savedScoresString = localStorage.getItem('highestScores');
    let scores = Array<HighestScores>();

    if (savedScoresString) {
      scores = JSON.parse(savedScoresString) as Array<HighestScores>;
    }
    if (!GameOverSystem.replaceScoreIfExist(scores, latestScore)) {
      scores.push(latestScore);
    }
    localStorage.setItem('highestScores', JSON.stringify(scores));
    localStorage.removeItem('latestScore');
  }

  updateLatestScoreName(name: string | null) {
    let latestScoreJSON = localStorage.getItem('latestScore');

    if (!latestScoreJSON || latestScoreJSON.length == 0) {
      return;
    }
    let latestScore = JSON.parse(latestScoreJSON) as HighestScores;

    latestScore.name = !name || name.length == 0 ? "" : name;
    localStorage.setItem('latestScore', JSON.stringify(latestScore));
  }

  static replaceScoreIfExist(scores: Array<HighestScores>, score: HighestScores): boolean {
    for (const element of scores) {
      if (element.name == score.name) {
        if (element.score < score.score)  {
          element.score = score.score;
          element.date = score.date;
        }
        return true;
      }
    }
    return false;
  }
}
