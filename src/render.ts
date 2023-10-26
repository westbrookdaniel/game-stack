import * as PIXI from "pixi.js";
import { MinEntity, World } from "./ecs";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

export const SCALE = 3;

type RenderEntities = Map<string, PIXI.Sprite>;

export type System<E extends MinEntity> = (
  world: World<E>,
  app: PIXI.Application,
  re: RenderEntities,
) => void;

export async function render<E extends MinEntity>(
  world: World<E>,
  systems: System<E>[],
) {
  const re: RenderEntities = new Map();

  const app = new PIXI.Application({
    background: 0x2d3633,
  });
  document.body.appendChild<any>(app.view);

  systems.forEach((system) => system(world, app, re));
}
