import '../scss/index.scss';

import Game from "./Game";

// import * as PIXI from 'pixi.js';
//
// const app = new PIXI.Application({ view: document.querySelector("#game") });
//
// let texture = PIXI.Sprite.from(Snake);
//
// app.stage.addChild(texture);
//
// app.ticker.add((delta) => {
//     texture.x += 0.5;
// });

const game = new Game();

game.start();