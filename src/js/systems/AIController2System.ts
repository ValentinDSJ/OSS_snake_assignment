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
  height: number,
  direction?: Direction
}

interface Node {
  x: number, // Position x in the graph
  y: number, // Position y in the graph
  g: number, // The sum of all the cells that have been visited since leaving the first cell
  h: number, // Estimated cost of the moving
  f: number, // the sum of g + h
  parent?: Node,
  state: Array<Array<Case>>
}

export default class AIController2System extends System {
  private cases: Array<Array<Case>> = Array<Array<Case>>();
  private startPos: Position = <Position>{x: 0, y: 0};
  private endPos: Position = <Position>{x: 0, y: 0};
  private pathComputed: boolean = false
  private path: Array<Node> = Array<Node>()
  private direction: Direction = Direction.UP
  private keyToTap?: string
  private tailPosition?: Position

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
    this.updateCases()
  }

  getNewType(caseElement: Case): [GraphicsType, Direction?] {
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
        return [graphic.type];
      }
    }

    for (const snake of snakes) {
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;

      let x = Math.floor((graphic!.sprite!.getBounds().x) / application.blockSizeX) * application.blockSizeX
      let y = Math.floor((graphic!.sprite!.getBounds().y) / application.blockSizeY) * application.blockSizeY

      if (
          caseElement.x < graphic.sprite!.getBounds().x + graphic.sprite!.getBounds().width &&
          caseElement.x + caseElement.width > graphic.sprite!.getBounds().x &&
          caseElement.y < graphic.sprite!.getBounds().y + graphic.sprite!.getBounds().height &&
          caseElement.y + caseElement.height > graphic.sprite!.getBounds().y
      ) {
        return [graphic.type, snake.direction]
      }
    }

    return [GraphicsType.GRASS];
  }

  updateCases() {
    const headPositions = Array<Position>();
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const apples = this.componentManager.getComponentsByType(getNameApple()) as Array<Apple>;
    const application = this.componentManager.getComponentByType("Application") as Application;

    for (const apple of apples) {
      const graphic = this.entityManager.getComponentByType(apple.idEntity!, getNameGraphics()) as Graphics;

      // console.log("Pos in board apple :", graphic.posInBoard);
      this.cases[graphic.posInBoard.y][graphic.posInBoard.x].type = GraphicsType.GRASS;
      this.cases[graphic.posInBoard.y][graphic.posInBoard.x].direction = undefined;
      this.endPos.x = graphic.posInBoard.x;
      this.endPos.y = graphic.posInBoard.y;
    }

    let i = 0;
    for (const snake of snakes) {
      i++;
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;

      if (snake.dependsOn)
        continue;

      console.log("Pos in board snake :", graphic.posInBoard);

      if (!this.isValid(graphic.posInBoard)) {
        console.log("error");
        const lastSnake = snakes[i - 2];
        const graphicLastSnake = this.entityManager.getComponentByType(lastSnake.idEntity!, getNameGraphics()) as Graphics;

        graphic.posInBoard = {...graphicLastSnake.lastPosInBoard};
        graphic.lastPosInBoard = {...graphicLastSnake.lastPosInBoard};
        switch (snake.direction) {
          case Direction.RIGHT:
            graphic.lastPosInBoard.x--;
            break;
          case Direction.LEFT:
            graphic.lastPosInBoard.x++;
            break;
          case Direction.DOWN:
            graphic.lastPosInBoard.y++;
            break;
          case Direction.UP:
            graphic.lastPosInBoard.y--;
            break;
        }
        console.log("Repair with ", graphic.posInBoard);
      }

      this.cases[graphic.posInBoard.y][graphic.posInBoard.x].type = graphic.type;
      this.cases[graphic.posInBoard.y][graphic.posInBoard.x].direction = snake.direction;

      if (i == snakes.length) {
        if (this.tailPosition) {
          if (this.cases[this.tailPosition.y][this.tailPosition.x].type != GraphicsType.SNAKE_HEAD) {
            this.cases[this.tailPosition.y][this.tailPosition.x].type = GraphicsType.GRASS;
            this.cases[this.tailPosition.y][this.tailPosition.x].direction = undefined;
          }
        }
        this.tailPosition = {...graphic.lastPosInBoard};
      } else {
        this.cases[graphic.lastPosInBoard.y][graphic.lastPosInBoard.x].type = GraphicsType.GRASS;
        this.cases[graphic.lastPosInBoard.y][graphic.lastPosInBoard.x].direction = undefined;
      }


      // console.log("Pos in board snake :", graphic.posInBoard);
      if (graphic.type == GraphicsType.SNAKE_HEAD) {
        this.startPos.x = graphic.posInBoard.x;
        this.startPos.y = graphic.posInBoard.y;
      }
    }

    if (headPositions.length == 1) {
      return
    }
    // Sometimes the head can be in two different position, to prevent this, we check the direction store previously
    for (const headPosition of headPositions) {
      switch (this.cases[headPosition.y][headPosition.x].direction) {
        case Direction.UP:
          if (this.cases[headPosition.y - 1][headPosition.x].type == GraphicsType.SNAKE_HEAD) {
            this.cases[headPosition.y][headPosition.x].type = GraphicsType.SNAKE;
            this.startPos.y = headPosition.y - 1;
            this.startPos.x = headPosition.x;
          }
          break
        case Direction.RIGHT:
          if (this.cases[headPosition.y][headPosition.x + 1].type == GraphicsType.SNAKE_HEAD) {
            this.cases[headPosition.y][headPosition.x].type = GraphicsType.SNAKE;
            this.startPos.y = headPosition.y;
            this.startPos.x = headPosition.x + 1;
          }
          break
        case Direction.LEFT:
          if (this.cases[headPosition.y][headPosition.x - 1].type == GraphicsType.SNAKE_HEAD) {
            this.cases[headPosition.y][headPosition.x].type = GraphicsType.SNAKE;
            this.startPos.y = headPosition.y;
            this.startPos.x = headPosition.x - 1;
          }
          break
        case Direction.DOWN:
          if (this.cases[headPosition.y + 1][headPosition.x].type == GraphicsType.SNAKE_HEAD) {
            this.cases[headPosition.y][headPosition.x].type = GraphicsType.SNAKE;
            this.startPos.y = headPosition.y + 1;
            this.startPos.x = headPosition.x;
          }
          break
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

    // console.log(this.cases)

    for (const player of players) {
      if (!player.isBot)
        continue;

      if (!this.pathComputed) {
        this.path = this.aStarAlgorithm(this.startPos, this.endPos)
        if (this.path.length == 0) {
          // console.log(this.cases)
          // console.log(this.startPos)
          // console.log(this.endPos)
          // console.log("Not path found")
          return;
        }
        this.pathComputed = true;
      }
      const nextNode = this.path[this.path.length - 1]

      // console.log(this.path)
      // console.log(this.startPos)
      // console.log(nextNode)
      // console.log(this.copyState(this.cases))
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
        this.pathComputed = false;
      }

      if (this.keyToTap) {
        // console.log(this.startPos)
        // console.log(this.keyToTap)
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

    while (openList.length !== 0) {
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
    const directions = <Array<Direction>>[
      Direction.LEFT,
      Direction.UP,
      Direction.DOWN,
      Direction.RIGHT
    ];

    for (let i = 0; i < successors.length; i++) {

      if (!this.isValid(successors[i]) || !this.isGrass(successors[i])) {
        continue
      }


      // console.log("Move " + directions[i].toString() + " from ", {x: currentNode.x, y: currentNode.y}, " to ", successors[i]);
      // console.log(currentNode.state);
      // const state = this.cases
      // const state: Array<Array<Case>> = this.updateState(this.copyState(currentNode.state), {...successors[i]}, directions[i])
      // console.log(currentNode.state);
      // console.log(currentNode.state[successors[i].y][successors[i].x])
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
        parent: currentNode,
        // state: state
      });
    }
  }

  isValid(pos: Position) {
    return pos.x >= 0 && pos.x < this.cases.length && pos.y >= 0 && pos.y < this.cases[0].length
  }

  isGrass(pos: Position) {
    return this.cases[pos.y][pos.x].type === GraphicsType.GRASS || this.cases[pos.y][pos.x].type === GraphicsType.APPLE;
  }

  updateState(currentState: Array<Array<Case>>, position: Position, newDirection: Direction): Array<Array<Case>> {

    if (currentState[position.y][position.x].type == GraphicsType.GRASS || currentState[position.y][position.x].type == GraphicsType.APPLE) {
      currentState[position.y][position.x].direction = undefined;
      return currentState
    }

    currentState[position.y][position.x].direction = newDirection;

    // if (newDirection === undefined) {
    //   console.log(currentState)
    //   return currentState;
    // }
    switch (newDirection) {
      case Direction.UP:
        currentState[position.y][position.x].type = currentState[position.y + 1][position.x].type;
        if (currentState[position.y][position.x].type == GraphicsType.GRASS || currentState[position.y][position.x].type == GraphicsType.APPLE) {
          currentState[position.y][position.x].direction = undefined;
        }
        position.y++;
        break
      case Direction.RIGHT:
        currentState[position.y][position.x].type = currentState[position.y][position.x - 1].type;
        if (currentState[position.y][position.x].type == GraphicsType.GRASS || currentState[position.y][position.x].type == GraphicsType.APPLE) {
          currentState[position.y][position.x].direction = undefined;
        }
        position.x--;
        break
      case Direction.LEFT:
        currentState[position.y][position.x].type = currentState[position.y][position.x + 1].type;
        if (currentState[position.y][position.x].type == GraphicsType.GRASS || currentState[position.y][position.x].type == GraphicsType.APPLE) {
          currentState[position.y][position.x].direction = undefined;
        }
        position.x++;
        break
      case Direction.DOWN:
        currentState[position.y][position.x].type = currentState[position.y - 1][position.x].type;
        if (currentState[position.y][position.x].type == GraphicsType.GRASS || currentState[position.y][position.x].type == GraphicsType.APPLE) {
          currentState[position.y][position.x].direction = undefined;
        }
        position.y--;
        break
    }
    let lastType = currentState[position.y][position.x].type;
    let lastDirection = currentState[position.y][position.x].direction;

    if (lastDirection == undefined || (lastType != GraphicsType.SNAKE_HEAD && lastType != GraphicsType.SNAKE)) {
      currentState[position.y][position.x].direction = undefined;
      return currentState;
    }
    // console.log(position, currentState[position.y][position.x].type, currentState[position.y][position.x].direction)
    return this.updateState(currentState, position, lastDirection)
  }

  copyState(currentState: Array<Array<Case>>): Array<Array<Case>> {
    let newState = Array<Array<Case>>();

    for (let i = 0; i < currentState.length; i++) {
      newState.push(Array<Case>(currentState[i].length));

      for (let j = 0; j < currentState[i].length; j++) {
        newState[i][j] = {...currentState[i][j]};
      }
    }
    return newState;
  }
}
