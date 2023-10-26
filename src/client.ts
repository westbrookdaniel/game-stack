import { MinEntity, World } from "./ecs";
import { render } from "./render";
import { Controls, controlsSystem } from "./systems/controls";
import { Physics, physicsSystem } from "./systems/physics";
import { Texture, textureSystem } from "./systems/texture";

type Entity = MinEntity & Texture & Physics & Controls;

const world = new World<Entity>();

world.add({
  id: "wall-l",
  texture: "wall.png",
  size: { width: 1, height: 13 },
  position: { x: -3, y: -3 },
  static: true,
});
world.add({
  id: "wall-t",
  texture: "wall.png",
  size: { height: 1, width: 17 },
  position: { x: -3, y: -3 },
  static: true,
});
world.add({
  id: "wall-b",
  texture: "wall.png",
  size: { height: 2, width: 17 },
  position: { x: -3, y: 173 },
  static: true,
});
world.add({
  id: "wall-r",
  texture: "wall.png",
  size: { height: 13, width: 1 },
  position: { x: 253, y: -3 },
  static: true,
});

world.add({
  id: "wall-m",
  texture: "wall.png",
  size: { height: 1, width: 1 },
  position: { x: 60, y: 60 },
  static: true,
});

world.add({
  id: "player",
  texture: "player.png",
  size: { width: 1, height: 1 },
  position: { x: 30, y: 30 },
  velocity: { x: 0, y: 0 },
  friction: 0.1,
  controls: { velocity: 1, max: 2 },
});

render(world, [textureSystem, physicsSystem, controlsSystem]);
