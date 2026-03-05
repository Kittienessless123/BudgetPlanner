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
  Default,
  Table,
} from "@sequelize/core/decorators-legacy";

@Table({ tableName: 'credit_payments', timestamps: true })
export class CreditPayments extends Model<
  InferAttributes<CreditPayments>,
  InferCreationAttributes<CreditPayments>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare credit_agree_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare transaction_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare principal_amount: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare interest_amount: number;

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(DataTypes.NOW)
  declare payment_date: CreationOptional<Date>;
}
