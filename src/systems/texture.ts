import * as PIXI from "pixi.js";
import { MinEntity } from "../ecs";
import { SCALE, System } from "../render";
import { Physics } from "./physics";

export interface Texture extends Physics, MinEntity {
  texture?: string;
}

export const CELL_SIZE = 5.3;

export type TextureData = {
  sprite: PIXI.TilingSprite;
};

export const textureSystem: System<Texture, TextureData> = async (
  world,
  app,
  data,
) => {
  for (const entity of world.query("texture", "position", "size")) {
    const texture = await PIXI.Assets.load(entity.texture!);

    const sprite = new PIXI.TilingSprite(texture);

    sprite.scale.set(SCALE);

    sprite.width = entity.size.width * SCALE * CELL_SIZE;
    sprite.height = entity.size.height * SCALE * CELL_SIZE;

    const d = data.get(entity.id);
    if (d) d.sprite = sprite;
    else data.set(entity.id, { sprite });

    app.stage.addChild<any>(sprite);
  }
};
