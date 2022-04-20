import '../scss/index.scss';

import * as PIXI from 'pixi.js';
import Position, {getNamePosition} from "./components/Position";
import Velocity, {getNameVelocity} from "./components/Velocity";
import EntityManager from "./ecs/EntityManager";

const app = new PIXI.Application({ view: document.querySelector("#game") });

document.body.appendChild(app.view);

let position: Position = {
    x: 10, y: 10, idEntity: 1, name: getNamePosition()
}

let velocity: Velocity = {
    x: 5, y: 5, idEntity: 1, name: getNameVelocity()
}

function test(component: Component) {
    console.log(component.name);
}

let manager = new EntityManager();

test(position);
test(velocity);

