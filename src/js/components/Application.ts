import {Application as App} from "@pixi/app";

export default interface Application extends Component {
    app?: App,
    blockSizeX: number,
    blockSizeY: number,
    nbBlocksGrass: number,
    nbBlocksWithWall: number
}

export function getNameApplication(): string {
    return "Application";
}