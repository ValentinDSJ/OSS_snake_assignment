import '../scss/index.scss';

import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ view: document.querySelector("#game") });

document.body.appendChild(app.view);