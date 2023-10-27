import Matter from "matter-js";
import { MinEntity } from "../ecs";
import { SCALE, System } from "../render";
import { CELL_SIZE, TextureData } from "./texture";

export interface Physics extends MinEntity {
  position?: { x: number; y: number };
  velocity?: { x: number; y: number };
  friction?: number;
  size?: { width: number; height: number };
  static?: boolean;
}

export interface PhysicsData extends TextureData {
  body: Matter.Body;
}

export const physicsSystem: System<Physics, PhysicsData> = (
  world,
  app,
  data,
) => {
  const engine = Matter.Engine.create();
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  const render = Matter.Render.create({
    element: document.body,
    engine,
    options: {
      width: app.view.width,
      height: app.view.height,
      showDebug: true,
      showIds: true,
      showBounds: true,
    },
  });
  Matter.Render.run(render);

  app.ticker.add(() => {
    for (const entity of world.query("position", "size")) {
      const d = data.get(entity.id);
      if (!d || !d.body) {
        const newBody = Matter.Bodies.rectangle(
          entity.position.x * SCALE,
          entity.position.y * SCALE,
          entity.size.width * SCALE * CELL_SIZE * 3,
          entity.size.height * SCALE * CELL_SIZE * 3,
        );

        if (entity.static) newBody.isStatic = entity.static;
        if (entity.friction) newBody.friction = entity.friction;

        if (d) d.body = newBody;
        else data.set(entity.id, { body: newBody });

        Matter.Composite.add(engine.world, newBody);
      }
    }

    for (const entity of world.query("position", "velocity")) {
      const d = data.get(entity.id);
      if (!d || !d.body) continue;
      d.body.position.x += entity.velocity.x;
      d.body.position.y += entity.velocity.y;
    }

    for (const entity of world.query("position")) {
      const d = data.get(entity.id);
      if (!d || !d.body || !d.sprite) continue;

      // Update sprite position
      d.sprite.x = d.body.position.x - d.sprite.width;
      d.sprite.y = d.body.position.y - d.sprite.height;

      // Update Entity to match physics body
      entity.position.x = d.body.position.x;
      entity.position.y = d.body.position.y;
      if (entity.velocity) {
        entity.velocity.x = d.body.velocity.x;
        entity.velocity.y = d.body.velocity.y;
      }
    }
  });
};
