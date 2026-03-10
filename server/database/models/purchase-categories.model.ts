import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
  Default,
} from "@sequelize/core/decorators-legacy";

@Table({ tableName: "purchase_categories", timestamps: true })
export class PurchaseCat extends Model<
  InferAttributes<PurchaseCat>,
  InferCreationAttributes<PurchaseCat>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare name: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  @Default(0)
  declare parent_id: number;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare is_active: boolean;
}
