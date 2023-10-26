import { MinEntity } from "../ecs";
import { SCALE, System } from "../render";

export interface Physics extends MinEntity {
  position?: { x: number; y: number };
  velocity?: { x: number; y: number };
  size?: { width: number; height: number };
  static?: boolean;
}

export const physicsSystem: System<Physics> = (world, app, re) => {
  app.ticker.add(() => {
    for (const entity of world.query("position", "velocity", "size")) {
      if (entity.static) continue;
      entity.position.x += entity.velocity.x;
      entity.position.y += entity.velocity.y;
    }

    for (const entity of world.query("position")) {
      const renderEntity = re.get(entity.id);
      if (!renderEntity) continue;
      renderEntity.x = entity.position.x * SCALE;
      renderEntity.y = entity.position.y * SCALE;
    }
  });
};
