export class Config {
  public readonly name: string;
  public readonly minRows: number = 2;
  public readonly minColumns: number = 2;
  public readonly maxRows: number = 20;
  public readonly maxColumns: number = 20;

  constructor(config: Pick<Config, 'name'>) {
    this.name = config.name;
  }
}
