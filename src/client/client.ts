import Maze from './maze';

function calculateDimensions(hash: number): number[] {
  const [min, max] = GetModelDimensions(hash);
  const x = max[0] - min[0];
  const y = max[1] - min[1];
  const z = max[2] - min[2];

  return [x, y, z];
}

export function calculateLongestDimension(hash: number): number {
  const dimensions = calculateDimensions(hash);
  return Math.max(...dimensions);
}

export function getEntityHeight(hash: number): number {
  const [x, y, z] = calculateDimensions(hash);
  return z;
}

export async function spawnEntity(hash: number, x: number, y: number, z: number, heading = 0) {
  // console.log(`Spawning: ${x}, ${y}, ${z}`);
  const obj = CreateObject(hash, x, y, z - 1, true, false, false);
  await SetEntityAsMissionEntity(obj, true, true);
  await SetEntityCollision(obj, true, true);
  await SetEntityHeading(obj, heading);
}

export class EntityMaze extends Maze {
  public async renderEntities(entityHash: number, x: number, y: number, z: number, layers = 1) {
    if (layers < 1) {
      console.warn(`Minimum maze layers is 1 - found ${layers}. Setting maze level to 1.`);
      layers = 1;
    }

    console.log('Rendering Maze with parameters:');
    console.log('Hash: ', entityHash);
    console.log('x: ', x);
    console.log('y: ', y);
    console.log('z: ', z);
    console.log('layers: ', layers);

    const entityDimension = calculateLongestDimension(entityHash);
    const entityHeight = getEntityHeight(entityHash);

    const firstVertical = [true, ...new Array(this.y - 1).fill(false)]; // add entrance

    // add exit
    const lastVertical = this.verticals[this.verticals.length - 1];
    lastVertical[lastVertical.length - 1] = true;

    this.verticals = [firstVertical, ...this.verticals];
    new Array(layers).fill(1).forEach(async (_, layer) => {
      this.verticals.forEach((line, i) => {
        line.forEach(async (isOpen, j) => {
          if (!isOpen) {
            await spawnEntity(
              entityHash,
              x + j * entityDimension + entityDimension / 2,
              y - i * entityDimension,
              z + layer * entityHeight,
              0,
            );
          }
        });
      });

      for (let j = 0; j < this.x * 2 + 1; j++) {
        for (let k = 0; k < this.y * 4 + 1; k++) {
          if (!(0 == j % 2) && 0 == k % 4) {
            if (k > 0 && this.horizontals[(j - 1) / 2][k / 4 - 1]) {
              continue;
            } else {
              const dX = (entityDimension * k) / 4;
              const dY = (entityDimension * j) / 2;
              await spawnEntity(entityHash, x + dX, y - dY, z + layer * entityHeight, 90);
            }
          }
        }
      }
    });
  }
}

async function drawMaze(source, args: any[]) {
  const player = GetPlayerPed(-1);
  const [pX, pY, pZ] = GetEntityCoords(player, true);

  let [X, Y, hash, layers, x, y, z] = args;

  if (!X) X = 5; // default to 5x7 maze
  if (!Y) Y = 7; // default to 5x7 maze
  if (!hash) hash = -1116116298; // default to wall that has colloision
  if (!layers) layers = 1; // default to a single layer
  if (!x) x = pX - 5; // default to player position plus some
  if (!y) y = pY - 5; // default to player position plus some
  if (!z) z = pZ; // default to player position plus some

  const maze = new EntityMaze(parseInt(X), parseInt(Y));
  await maze.renderEntities(
    parseInt(hash),
    parseFloat(x),
    parseFloat(y),
    parseFloat(z),
    parseInt(layers),
  );
}

RegisterCommand('maze', drawMaze, false);
