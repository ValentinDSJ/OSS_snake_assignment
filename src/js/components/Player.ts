export default interface Player extends Component {
    score: number,
    highestScore: number,
    isBot?: boolean,
    head: number,
    body: Array<number>,
    keyEventLeft: string,
    keyEventRight: string,
    keyEventDown: string,
    keyEventUp: string,
    reInitBoard: boolean
}

export function getNamePlayer(): string {
    return "Player";
}