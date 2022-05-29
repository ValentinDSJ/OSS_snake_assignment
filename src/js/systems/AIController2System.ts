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

// Indicate the state of the AI
enum State {
  NOTHING,
  APPLE,
  TAIL,
  FARAWAY
}

export default class AIController2System extends System {
  private cases: Array<Array<Case>> = Array<Array<Case>>();
  private startPos: Position = <Position>{x: 0, y: 0};
  private endPos: Position = <Position>{x: 0, y: 0};
  private pathComputed: boolean = false
  private path: Array<Node> = Array<Node>()
  private keyToTap?: string
  private tailPosition?: Position
  private state: State = State.NOTHING

  computeArea(pos: Position): Array<Position> {
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    let results = Array<Position>();
    const incrementalPositions = <Array<Position>>[
      <Position>{x: 0, y: 1},
      <Position>{x: 0, y: -1},
      <Position>{x: 1, y: 0},
      <Position>{x: -1, y: 0},
    ]
    let max_area = 0;

    for (let i = 0; i < 4; i++) {
      const openList = Array<Position>();
      const closeList = Array<Position>();
      const firstPosition = <Position>{x: pos.x + incrementalPositions[i].x, y: pos.y + incrementalPositions[i].y};

      closeList.push(pos);

      if (!this.isValid(firstPosition) || !this.isGrass(firstPosition))
        continue;

      openList.push(firstPosition);
      while (openList.length != 0) {
        const position = openList.pop();

        if (!position)
          break;
        closeList.push(position);

        if (closeList.length > snakes.length * 2) {
          break;
        }

        for (let j = 0; j < 4; j++) {
          const tmp = <Position>{
            x: position.x + incrementalPositions[j].x,
            y: position.y + incrementalPositions[j].y,
          }
          if (!this.isValid(tmp) || !this.isGrass(tmp)) {
            continue;
          }
          if (closeList.filter((value) => {
            return value.x == tmp.x && value.y == tmp.y
          }).length != 0) {
            continue
          }
          openList.push(<Position>{...tmp});
        }
      }
      if (closeList.length > max_area) {
        results = [];
        results.push(incrementalPositions[i]);
        max_area = closeList.length;
      } else if (closeList.length == max_area) {
        results.push(incrementalPositions[i]);
      }
    }
    return results;
  }

  isBlocked(pos: Position): number {
    const incrementalPositions = <Array<Position>>[
      <Position>{x: 0, y: 1},
      <Position>{x: 0, y: -1},
      <Position>{x: 1, y: 0},
      <Position>{x: -1, y: 0},
    ]
    let nb = 0;

    for (let i = 0; i < 4; i++) {
      if ((pos.x - this.startPos.x > 0 && incrementalPositions[i].x < 0) ||
          (pos.y - this.startPos.y > 0 && incrementalPositions[i].y < 0) ||
          (pos.x - this.startPos.x < 0 && incrementalPositions[i].x > 0) ||
          (pos.y - this.startPos.y < 0 && incrementalPositions[i].y > 0)
      ) {
        continue;
      }
      const tmp = <Position>{
        x: pos.x + incrementalPositions[i].x,
        y: pos.y + incrementalPositions[i].y,
      }
      if (this.isValid(tmp) && this.isGrass(tmp))
        nb++;
    }
    return nb;
  }

  getPositionFaraway(): Position {
    let bestNbMove = 0;
    let posFaraway = <Position>{x: -1, y: -1};
    const incrementalPositions = this.computeArea(this.startPos);

    // console.log(incrementalPositions);
    for (let i = 0; i < incrementalPositions.length; i++) {
      let nbMove = 0;
      let pos = {...this.startPos}

      pos.x += incrementalPositions[i].x;
      pos.y += incrementalPositions[i].y;
      while (this.cases[pos.y][pos.x].type != GraphicsType.WALL && this.cases[pos.y][pos.x].type != GraphicsType.SNAKE && this.isBlocked(pos) >= 1) {
        nbMove++;
        pos.x += incrementalPositions[i].x;
        pos.y += incrementalPositions[i].y;
      }
      if (nbMove > bestNbMove) {
        bestNbMove = nbMove;
        pos.x -= incrementalPositions[i].x;
        pos.y -= incrementalPositions[i].y;
        posFaraway = {...pos};
      }
    }
    return posFaraway;
  }

  awake() {
    const application = this.componentManager.getComponentByType(getNameApplication()) as Application;

    for (let i = 0; i < application.nbBlocksWithWallY; i++) {
      this.cases.push(Array<Case>(application.nbBlocksWithWallX));

      for (let j = 0; j < application.nbBlocksWithWallX; j++) {
        this.cases[i][j] = <Case>{
          y: i * application.blockSizeX,
          x: j * application.blockSizeY,
          width: application.blockSizeX,
          height: application.blockSizeY,
          type: GraphicsType.GRASS
        };

        if (i == 0 || j == 0 || i == application.nbBlocksWithWallY - 1 || j == application.nbBlocksWithWallX - 1) {
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
    const snakes = this.componentManager.getComponentsByType(getNameSnake()) as Array<Snake>;
    const apples = this.componentManager.getComponentsByType(getNameApple()) as Array<Apple>;

    for (const apple of apples) {
      const graphic = this.entityManager.getComponentByType(apple.idEntity!, getNameGraphics()) as Graphics;

      this.cases[graphic.posInBoard.y][graphic.posInBoard.x].type = GraphicsType.GRASS;
      this.cases[graphic.posInBoard.y][graphic.posInBoard.x].direction = undefined;
      this.endPos.x = graphic.posInBoard.x;
      this.endPos.y = graphic.posInBoard.y;
    }

    let i = 0;
    let lastPosSaved = <Position>{x: 0, y: 0}
    for (const snake of snakes) {
      i++;
      const graphic = this.entityManager.getComponentByType(snake.idEntity!, getNameGraphics()) as Graphics;

      if (snake.dependsOn)
        continue;

      // console.log("Pos in board snake :", graphic.posInBoard);

      if (i != 1 && (!this.isValid(graphic.posInBoard) || (lastPosSaved.x != graphic.posInBoard.x || lastPosSaved.y != graphic.posInBoard.y))) {
        // console.log("error");
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
        // console.log("Repair with ", graphic.posInBoard);
      }
      lastPosSaved = {...graphic.lastPosInBoard}

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
        if (graphic.posInBoard.x != graphic.lastPosInBoard.x || graphic.posInBoard.y != graphic.lastPosInBoard.y) {
          this.cases[graphic.lastPosInBoard.y][graphic.lastPosInBoard.x].type = GraphicsType.GRASS;
          this.cases[graphic.lastPosInBoard.y][graphic.lastPosInBoard.x].direction = undefined;
        }
      }

      if (graphic.type == GraphicsType.SNAKE_HEAD) {
        this.startPos.x = graphic.posInBoard.x;
        this.startPos.y = graphic.posInBoard.y;
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
      if (player.reInitBoard) {
        this.cases = [];
        this.path = [];
        this.state = State.NOTHING;
        this.pathComputed = false;
        this.awake();
        player.reInitBoard = false;
      }


      if (!player.isBot)
        continue;

      if (!this.pathComputed) {
        // We try first with the AStar algorithm to find the shortest path
        let path = this.aStarAlgorithm(this.startPos, this.endPos)

        // If no path has been found, it means we can't go eat the apple, so we try with a different technique
        if (path.length == 0) {

          // If we have the tail position, the tail position will always be set but in case
          if (this.tailPosition) {
            // We try to find the shortest path to the tail position
            path = this.aStarAlgorithm(this.startPos, this.tailPosition);

            // If no path has been found, it means we can't go to the tail of the snake, so we try with a different technique
            if (path.length == 0 && this.state != State.FARAWAY) {
              // We get the point the most faraway from the position
              const posFaraway = this.getPositionFaraway();

              if (posFaraway.x == this.startPos.x && posFaraway.y == this.startPos.y) {
                return;
              }
              path = this.aStarAlgorithm(this.startPos, posFaraway);

              if (path.length == 0) {
                this.path = path;
                return;
              }
              this.state = State.FARAWAY;
            } else if (this.path.length == 0 && this.state == State.FARAWAY) {
              path = this.path;
            } else {
              this.state = State.TAIL;
            }
          } else {
            if (this.state != State.FARAWAY) {
              const posFaraway = this.getPositionFaraway();

              if (posFaraway.x == this.startPos.x && posFaraway.y == this.startPos.y) {
                return;
              }
              path = this.aStarAlgorithm(this.startPos, posFaraway);

              if (path.length == 0) {
                this.path = path;
                return;
              }
              this.state = State.FARAWAY;
            } else {
              path = this.path;
            }
          }
        } else {
          this.state = State.APPLE;
        }
        this.path = path;
        this.pathComputed = true;
      }
      if (this.path.length == 0) {
        this.pathComputed = false
        this.keyToTap = undefined
        this.state = State.NOTHING;
        return;
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
          this.state = State.NOTHING;
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

    let i = 0;
    while (openList.length !== 0) {
      // if (i > 1600) {
      //   console.log(startNode, destNode);
      //   break;
      // }

      let currentNode = openList.reduce(function(node1, node2): Node {
        return (node1.f < node2.f ? node1 : node2)
      });

      // console.log(openList.length);
      openList.splice(openList.findIndex((node) => {
        return node.x == currentNode.x && node.y == currentNode.y
      }), 1);
      // console.log(openList.length);

      closeList.push(currentNode)

      if (currentNode.x == destNode.x && currentNode.y == destNode.y) {
        while (currentNode.parent != null) {
          path.push(currentNode)
          currentNode = currentNode.parent
        }
        path.push(currentNode)
        return path
      }
      this.checkSuccessors(currentNode, destNode, openList, closeList);
      i++;
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
        // console.log(successors[i], "alreay")
        continue
      }

      let g = currentNode.g + 1
      let h = Math.pow(successors[i].x - endNode.x, 2) + Math.pow(successors[i].y - endNode.y, 2)
      let f = g + h

      // Skip if is in open list
      if (openList.filter((value) => {
        return value.x == successors[i].x && value.y == successors[i].y
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
