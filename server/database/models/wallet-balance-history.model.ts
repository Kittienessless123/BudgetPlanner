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

@Table({ tableName: "wallet_balance_history", timestamps: false })
export class WalletStory extends Model<
  InferAttributes<WalletStory>,
  InferCreationAttributes<WalletStory>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare wallet_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare balance: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare transaction_id: number;
  
  @Attribute(DataTypes.STRING(50))
  @NotNull
  declare reason: string; // было number, исправил на string (creation, update, adjustment)


  @Attribute(DataTypes.DATE)
  @NotNull
  declare changed_at: CreationOptional<Date>;
}
