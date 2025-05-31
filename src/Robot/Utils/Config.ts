export class Config {
  public readonly name: string;
  public readonly minRows: number = 2;
  public readonly minColumns: number = 2;
  public readonly maxRows: number = 50;
  public readonly maxColumns: number = 50;

  constructor(config: Pick<Config, 'name'>) {
    this.name = config.name;
  }
}
