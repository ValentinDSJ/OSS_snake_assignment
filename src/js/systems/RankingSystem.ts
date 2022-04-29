import Sprite from "../components/Sprite";
import { System } from "../libs/ecs/System";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Player, {getNamePlayer} from "../components/Player";
import HighestScores from "../utils/HighestScores";
import GameOverSystem from "./GameOverSystem";

export default class RankingSystem extends System {
  start() {
    GameOverSystem.saveLatestScoreIfExist();

    const scoresJSON = localStorage.getItem('highestScores');
    const element = document.querySelector("body main .ranking-scene .scores-tbody tbody");

    if (!element)
      return;

    if (!scoresJSON) {
      this.displayNoScores();
      return;
    }

    element.replaceChildren();
    let scores = JSON.parse(scoresJSON) as Array<HighestScores>;

    if (scores.length == 0) {
      this.displayNoScores();
      return;
    }

    scores = this.order(scores);

    scores.forEach((value, index, array) => {
      let tr = document.createElement("tr");
      let tdPos = document.createElement("td");
      let tdScore = document.createElement("td");
      let tdName = document.createElement("td");
      let tdDate = document.createElement("td");

      tdPos.innerHTML = (index + 1).toString();
      tdName.innerHTML = value.name;
      tdScore.innerHTML = value.score.toString();
      // @ts-ignore
      tdDate.innerHTML = new Date(value.date).toLocaleString();

      tr.appendChild(tdPos);
      tr.appendChild(tdScore);
      tr.appendChild(tdName);
      tr.appendChild(tdDate);

      element.appendChild(tr);
    });
  }

  displayNoScores() {
    const element = document.querySelector("body main .ranking-scene .scores-tbody tbody")!;

    element.replaceChildren();
    let tr = document.createElement("tr");
    let td = document.createElement("td");

    td.innerHTML = "No score found.";
    td.classList.add("width-100")
    tr.appendChild(td);
    element.appendChild(tr);
  }

  order(scores: Array<HighestScores>): Array<HighestScores> {
    scores.sort((a, b): number => {
      return b.score - a.score;
    });
    return scores;
  }

  update(delta: number) {
  }
}
