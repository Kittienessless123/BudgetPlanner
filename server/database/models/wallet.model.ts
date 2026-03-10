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

@Table({ tableName: "wallets", timestamps: true })
export class Wallet extends Model<
  InferAttributes<Wallet>,
  InferCreationAttributes<Wallet>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: number;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare currency: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare current_balance: number;
}
