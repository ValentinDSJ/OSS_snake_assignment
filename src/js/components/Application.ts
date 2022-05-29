import {Application as App} from "@pixi/app";

export default interface Application extends Component {
    app?: App,
    blockSizeX: number,
    blockSizeY: number,
    nbBlocksGrassX: number,
    nbBlocksGrassY: number,
    nbBlocksWithWallX: number,
    nbBlocksWithWallY: number,
}

export function getNameApplication(): string {
    return "Application";
}