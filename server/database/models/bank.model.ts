import {
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

@Table({ tableName: 'banks', timestamps: true })
export class Bank extends Model<
  InferAttributes<Bank>,
  InferCreationAttributes<Bank>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare code: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare currency: string;
}
