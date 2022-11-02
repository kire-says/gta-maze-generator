/**
 * Adapted from: https://rosettacode.org/wiki/Maze_generation#JavaScript
 */

class Node {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function randomDimension(n: number): number {
  return Math.floor(Math.random() * n);
}

function generateUnvisitedNodes(width: number, height: number, start: Node) {
  const unvisitedNodes = [];
  for (let j = 0; j < width + 2; j++) {
    unvisitedNodes[j] = [];
    for (let k = 0; k < height + 1; k++) {
      const notVisted = j > 0 && j < width + 1 && k > 0 && (j != start.x + 1 || k != start.y + 1);
      unvisitedNodes[j].push(notVisted);
    }
  }
  return unvisitedNodes;
}

class Maze {
  x: number;
  y: number;
  horizontals: boolean[][];
  verticals: boolean[][];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.generateMaze();
  }

  generateMaze() {
    console.log(`Generating maze with dimensions ${this.x}x${this.y}`);
    let openings = this.x * this.y - 1;
    if (openings < 0) {
      throw Error('illegal maze dimensions');
    }

    const horizontals = [];
    for (let i = 0; i < this.y; i++) {
      horizontals[i] = new Array(this.x).fill(false);
    }
    const verticals = [];
    for (let j = 0; j < this.x; j++) {
      verticals[j] = new Array(this.y).fill(false);
    }

    let currentLocation = new Node(randomDimension(this.x), randomDimension(this.y));
    const path = [currentLocation];

    const unvisitedNodes = generateUnvisitedNodes(this.x, this.y, currentLocation);

    while (0 < openings) {
      const potentialNodes = [
        new Node(currentLocation.x + 1, currentLocation.y),
        new Node(currentLocation.x, currentLocation.y + 1),
        new Node(currentLocation.x - 1, currentLocation.y),
        new Node(currentLocation.x, currentLocation.y - 1),
      ];
      const neighbors = potentialNodes.filter(node => {
        return unvisitedNodes[node.x + 1][node.y + 1];
      });

      if (!neighbors.length) {
        currentLocation = path.pop();
        continue;
      }

      openings -= 1;
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

      unvisitedNodes[randomNeighbor.x + 1][randomNeighbor.y + 1] = false;

      if (randomNeighbor.x == currentLocation.x) {
        horizontals[randomNeighbor.x][(randomNeighbor.y + currentLocation.y - 1) / 2] = true;
      } else {
        verticals[(randomNeighbor.x + currentLocation.x - 1) / 2][randomNeighbor.y] = true;
      }

      currentLocation = randomNeighbor;
      path.push(currentLocation);
    }
    this.verticals = verticals;
    this.horizontals = horizontals;
  }
}

export default Maze;
