// di/container.ts - простой DI контейнер
export class Container {
  private static instances = new Map<string, any>();
  private static factories = new Map<string, () => any>();

  static register(name: string, factory: () => any) {
    this.factories.set(name, factory);
  }

  static get<T>(name: string): T {
    if (!this.instances.has(name)) {
      const factory = this.factories.get(name);
      if (!factory) throw new Error(`No factory registered for ${name}`);
      this.instances.set(name, factory());
    }
    return this.instances.get(name);
  }

  static clear() {
    this.instances.clear();
  }
}