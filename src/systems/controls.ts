import { MinEntity } from "../ecs";
import { System } from "../render";
import { Physics } from "./physics";

enum BINDINGS {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
const isDown = new Map<BINDINGS, boolean>();
window.addEventListener("keydown", (e) => {
  if (e.key === "w") isDown.set(BINDINGS.UP, true);
  if (e.key === "s") isDown.set(BINDINGS.DOWN, true);
  if (e.key === "a") isDown.set(BINDINGS.LEFT, true);
  if (e.key === "d") isDown.set(BINDINGS.RIGHT, true);
});
window.addEventListener("keyup", (e) => {
  if (e.key === "w") isDown.set(BINDINGS.UP, false);
  if (e.key === "s") isDown.set(BINDINGS.DOWN, false);
  if (e.key === "a") isDown.set(BINDINGS.LEFT, false);
  if (e.key === "d") isDown.set(BINDINGS.RIGHT, false);
});

export interface Controls extends Physics, MinEntity {
  controls?: { velocity: number; max: number };
  friction?: number;
}

export const controlsSystem: System<Controls> = (world, app) => {
  app.ticker.add(() => {
    for (const entity of world.query("controls", "velocity")) {
      const velocity = entity.velocity;

      const v = entity.controls.velocity;
      if (isDown.get(BINDINGS.UP)) velocity.y -= v;
      if (isDown.get(BINDINGS.DOWN)) velocity.y += v;
      if (isDown.get(BINDINGS.LEFT)) velocity.x -= v;
      if (isDown.get(BINDINGS.RIGHT)) velocity.x += v;

      const max = entity.controls.max;
      if (velocity.x > max) velocity.x = max;
      if (velocity.x < -max) velocity.x = -max;
      if (velocity.y > max) velocity.y = max;
      if (velocity.y < -max) velocity.y = -max;
    }

    for (const entity of world.query("velocity", "friction")) {
      if (!isDown.get(BINDINGS.UP) && !isDown.get(BINDINGS.DOWN)) {
        entity.velocity.y *= entity.friction;
      }
      if (!isDown.get(BINDINGS.LEFT) && !isDown.get(BINDINGS.RIGHT)) {
        entity.velocity.x *= entity.friction;
      }
      // Helps with setting velocity to 0
      if (Math.abs(entity.velocity.x) < 0.000001) entity.velocity.x = 0;
      if (Math.abs(entity.velocity.y) < 0.000001) entity.velocity.y = 0;
    }
  });
};
