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
} from "@sequelize/core/decorators-legacy";

@Table({ tableName: "user_purchase_categories", timestamps: true })
export class UsersPCategory extends Model<
  InferAttributes<UsersPCategory>,
  InferCreationAttributes<UsersPCategory>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: number;

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare name: string; // было number, исправил

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare parent_id: number;

  @Attribute(DataTypes.STRING(20))
  @NotNull
  declare parent_type: string; // 'system' или 'user'
}
