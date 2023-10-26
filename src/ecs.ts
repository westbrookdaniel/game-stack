export type MinEntity = {
  id: string;
};

export class World<T extends MinEntity> {
  entities: T[] = [];
  subscribers: ((entities: T[]) => void)[] = [];

  add(entity: T) {
    this.entities.push(entity);
    for (const subscriber of this.subscribers) {
      subscriber(this.entities);
    }
    return entity;
  }

  remove(entity: T) {
    this.entities = this.entities.filter((e) => e !== entity);
    for (const subscriber of this.subscribers) {
      subscriber(this.entities);
    }
  }

  subscribe(subscriber: (entities: T[]) => void) {
    this.subscribers.push(subscriber);
  }

  query<K extends (keyof T)[]>(
    ...components: K
  ): (Required<Pick<T, K[number]>> & T)[] {
    return this.entities.filter((entity) =>
      components.every((component) => entity[component] !== undefined),
    ) as any;
  }
}
