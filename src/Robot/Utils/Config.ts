export class Config {
  public readonly name: string;
  public static readonly minRows: number = 2;
  public static readonly minColumns: number = 2;
  public static readonly maxRows: number = 15;
  public static readonly maxColumns: number = 15;

  constructor(name: string) {
    this.name = name;
  }

  public getMinRows(): number {
    return Config.minRows;
  }

  public getMinColumns(): number {
    return Config.minColumns;
  }

  public getMaxRows(): number {
    return Config.maxRows;
  }

  public getMaxColumns(): number {
    return Config.maxColumns;
  }
}
