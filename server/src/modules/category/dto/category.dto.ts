export class CategoryDto {
  public readonly id: number;
  public readonly userId: number;
  public readonly name: string;
  public readonly parentId: number;
  public readonly parentType: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(category: any) {
    this.id = category.id;
    this.userId = category.user_id;
    this.name = category.name;
    this.parentId = category.parent_id;
    this.parentType = category.parent_type;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}

export class CreateCategoryDto {
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly parentId: number = 0,
    public readonly parentType: string = 'user'
  ) {}
}

export class UpdateCategoryDto {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly name?: string,
    public readonly parentId?: number,
    public readonly parentType?: string
  ) {}
}