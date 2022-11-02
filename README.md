# GTA Maze Generator

![Video Demo](./demo.gif)

## Installation

`npm i gta-maze-generator`

## Usage

### In game

From FiveM the command `/maze` is provided with optional arguments: `X Y hash layers, x, y ,z`

- X (default 5): the x dimension of the maze (length)
- Y (default 7): the y dimension of the maze (width)
- hash (default -1116116298): the FiveM entity hash you want to build the maze out of
- layers (default 1): how "tall" the maze will be with entities stacked on top of each other
- x (default player location): x coordinate of maze start point
- y (default player location): y coordinate of maze start point
- z (default player location): z coordinate of maze start point

### In JavaScript/TypeScript

```
import Maze from './maze';

// see above for variable meanings
const maze = new EntityMaze(X, Y);
maze.renderEntities(
    hash,
    x,
    y,
    z,
    layers,
);

```

## Development

1. `git clone git@github.com:erik-sn/gta-maze-generator.git`
2. `cd gta-maze-generator`
3. `npm i`
4. `npm run watch`