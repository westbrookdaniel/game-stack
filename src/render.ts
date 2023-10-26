import * as PIXI from "pixi.js";
import { MinEntity, World } from "./ecs";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

export const SCALE = 3;

export type EntityData<T> = Map<string, Partial<T>>;

export type System<E extends MinEntity, T = Record<string, never>> = (
  world: World<E>,
  app: PIXI.Application,
  data: EntityData<T>,
) => void;

export async function render<E extends MinEntity>(
  world: World<E>,
  systems: System<E, unknown>[],
) {
  const data: EntityData<unknown> = new Map();

  const app = new PIXI.Application({
    background: 0x2d3633,
  });
  document.body.appendChild<any>(app.view);

  systems.forEach((system) => system(world, app, data));
}
