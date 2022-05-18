import {System} from "../libs/ecs/System";
import Graphics, {getNameGraphics, GraphicsType} from "../components/Graphics";
import Apple, {getNameApple} from "../components/Apple";
import Application, {getNameApplication} from "../components/Application";
import Snake, {Direction, getNameSnake} from "../components/Snake";
import Player, {getNamePlayer} from "../components/Player";
import Pause, {getNamePause} from "../components/Pause";
import GameOver, {getNameGameOver} from "../components/GameOver";
import Position from "../components/Position";

interface Case {
  type: GraphicsType,
  x: number,
  y: number,
  width: number,
  height: number
}

interface Node {
  x: number, // Position x in the graph
  y: number, // Position y in the graph
  g: number, // The sum of all the cells that have been visited since leaving the first cell
  h: number, // Estimated cost of the moving
  f: number, // the sum of g + h
  parent?: Node
}

export default class AIController2System extends System {
  private cases: Array<Array<Case>> = Array<Array<Case>>();
  private startPos: Position = <Position>{x: 0, y: 0};
  private endPos: Position = <Position>{x: 0, y: 0};
  private pathComputed: boolean = false
  private path: Array<Node> = Array<Node>()
  private direction: Direction = Direction.UP
  private keyToTap?: string

  awake() {
    const application = this.componentManager.getComponentByType(getNameApplication()) as Application;

    for (let i = 0; i < application.nbBlocksWithWall; i++) {
      this.cases.push(Array<Case>(application.nbBlocksWithWall));

      for (let j = 0; j < application.nbBlocksWithWall; j++) {
        this.cases[i][j] = <Case>{
          y: i * application.blockSizeX,
          x: j * application.blockSizeY,
          width: application.blockSizeX,
          height: application.blockSizeY,
          type: GraphicsType.GRASS
        };

        if (i == 0 || j == 0 || i == application.nbBlocksWithWall - 1 || j == application.nbBlocksWithWall - 1) {
          this.cases[i][j].type = GraphicsType.WALL;
        }
      }
    }
  }

  getNewType(caseElement: Case): GraphicsType {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const apples = this.componentManager.getComponentsByType(getNameApple()) as Array<Apple>;
    const application = this.componentManager.getComponentByType("Application") as Application;

    for (const apple of apples) {
      const graphic = this.entityManager.getComponentByType(apple.idEntity!, getNameGraphics()) as Graphics;

      if (
          caseElement.x < graphic.sprite!.x + graphic.sprite!.width &&
          caseElement.x + caseElement.width > graphic.sprite!.x &&
          caseElement.y < graphic.sprite!.y + graphic.sprite!.height &&
          caseElement.y + caseElement.height > graphic.sprite!.y
      ) {
        return graphic.type;
      }
    }

    for (const snake of snakes) {
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;

      let x = Math.floor((graphic!.sprite!.x - (graphic!.sprite!.width / 2)) / application.blockSizeX) * application.blockSizeX
      let y = Math.floor((graphic!.sprite!.y - (graphic!.sprite!.height / 2)) / application.blockSizeY) * application.blockSizeY

      if (snake.direction == Direction.DOWN) {
        y += application.blockSizeY;
      } else if (snake.direction == Direction.RIGHT) {
        x += application.blockSizeX;
      }
      if (caseElement.x == x && caseElement.y == y) {
        return graphic.type
      }
    }

    return GraphicsType.GRASS;
  }

  updateCases() {
    for (let y = 0; y < this.cases.length; y++) {
      for (let x = 0; x < this.cases[y].length; x++) {
        if (this.cases[y][x].type == GraphicsType.WALL) {
          continue;
        }
        this.cases[y][x].type = this.getNewType(this.cases[y][x]);

        if (this.cases[y][x].type == GraphicsType.SNAKE_HEAD) {
          this.startPos.x = x
          this.startPos.y = y
        } else if (this.cases[y][x].type == GraphicsType.APPLE) {
          this.endPos.x = x
          this.endPos.y = y
        }
      }
    }
  }

  update(delta: number) {
    const pause = this.componentManager.getComponentByType(getNamePause()) as Pause;
    const gameOver = this.componentManager.getComponentByType(getNameGameOver()) as GameOver;

    if (gameOver?.over || pause?.isPaused) {
      return;
    }

    const players = this.componentManager.getComponentsByType(getNamePlayer()) as Array<Player>;

    this.updateCases();

    for (const player of players) {
      if (!player.isBot)
        continue;

      if (!this.pathComputed) {
        // console.log(this.startPos)
        // console.log(this.endPos)
        // console.log(this.cases)
        // console.log(this.cases[this.startPos.y][this.startPos.x])
        // console.log(this.cases[this.endPos.y][this.endPos.x])
        this.path = this.aStarAlgorithm(this.startPos, this.endPos)
        if (this.path.length == 0) {
          return;
        }
        // console.log(this.path)
        // console.log(this.startPos)
        // console.log(nextNode)
        // const nextNode = this.path[this.path.length - 1]
        // console.log(nextNode)
        // console.log(this.cases[this.startPos.y][this.startPos.x])
        this.pathComputed = true;
      }
      const nextNode = this.path[this.path.length - 1]

      // console.log(this.path)
      // console.log(this.startPos)
      // console.log(nextNode)
      // console.log(this.cases)
      // console.log(this.cases[nextNode.y][nextNode.x])
      // console.log(this.cases[this.startPos.y][this.startPos.x])
      if (this.startPos.x == nextNode.x && this.startPos.y == nextNode.y) {
        this.path.pop()

        if (this.path.length == 0) {
          this.pathComputed = false
          this.keyToTap = undefined
          return;
        }
        const nextNode = this.path[this.path.length - 1]
        if (this.startPos.y < nextNode.y) {
          this.keyToTap = player.keyEventDown
        } else if (this.startPos.y > nextNode.y) {
          this.keyToTap = player.keyEventUp
        } else if (this.startPos.x < nextNode.x) {
          this.keyToTap = player.keyEventRight
        } else if (this.startPos.x > nextNode.x) {
          this.keyToTap = player.keyEventLeft
        } else {
          this.keyToTap = undefined
        }
      }

      if (this.keyToTap) {
        console.log(this.keyToTap)
        document.dispatchEvent(new KeyboardEvent('keydown',  {'key': this.keyToTap}));
      }
    }
  }

  aStarAlgorithm(src: Position, dest: Position): Array<Node> {
    let startNode = <Node>{x: src.x, y: src.y, g: 0, h: 0, f: 0};
    let destNode = <Node>{x: dest.x, y: dest.y, g: 0, h: 0, f: 0};
    let openList = Array<Node>()
    let closeList = Array<Node>()
    let path = Array<Node>();

    openList.push(startNode)

    let i = 0;
    while (openList.length !== 0) {
      i++
      // if (i > 500) {
      //   console.log("mdr")
      //   break
      // }
      let currentNode = openList.reduce(function(node1, node2): Node {
        return (node1.f < node2.f ? node1 : node2)
      });

      openList.splice(openList.indexOf(currentNode));

      closeList.push(currentNode)

      if (currentNode.x == destNode.x && currentNode.y == destNode.y) {
        while (currentNode.parent != null) {
          path.push(currentNode)
          currentNode = currentNode.parent
        }
        path.push(currentNode)
        return path
      }
      this.checkSuccessors(currentNode, destNode, openList, closeList)
    }
    return []
  }

  checkSuccessors(currentNode: Node, endNode: Node, openList: Array<Node>, closeList: Array<Node>) {
    const successors = <Array<Position>>[
      <Position>{x: currentNode.x - 1, y: currentNode.y},
      <Position>{x: currentNode.x, y: currentNode.y - 1},
      <Position>{x: currentNode.x, y: currentNode.y + 1},
      <Position>{x: currentNode.x + 1, y: currentNode.y},
    ];

    for (let i = 0; i < successors.length; i++) {
      if (!this.isValid(successors[i]) || !this.isGrass(successors[i])) {
        continue
      }
      // console.log("la", this.cases[successors[i].y][successors[i].x])

      // Skip if the successor is already in the close list
      if (closeList.filter((value) => {
        return value.x == successors[i].x && value.y == successors[i].y
      }).length != 0) {
        continue
      }

      let g = currentNode.g + 1
      let h = Math.pow(successors[i].x - endNode.x, 2) + Math.pow(successors[i].y - endNode.y, 2)
      let f = g + h

      // Skip if is in open list
      if (openList.filter((value) => {
        return value.x == successors[i].x && value.y == successors[i].y && value.f < f
      }).length != 0) {
        continue
      }
      openList.push(<Node>{
        x: successors[i].x,
        y: successors[i].y,
        g: g,
        h: h,
        f: f,
        parent: currentNode
      });
    }
  }

  isValid(pos: Position) {
    return pos.x >= 0 && pos.x < this.cases.length && pos.y >= 0 && pos.y < this.cases[0].length
  }

  isGrass(pos: Position) {
    return this.cases[pos.y][pos.x].type === GraphicsType.GRASS || this.cases[pos.y][pos.x].type === GraphicsType.APPLE;
  }
}
