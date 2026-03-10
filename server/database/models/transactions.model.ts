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
  Default,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { User } from "./user.model.ts";
import { Wallet } from "./wallet.model.ts";
import { MoneyFlowType } from "./money-flow-types.model.ts";
import { PaymentStatuses } from "./payment-statuses.model.ts";
import { PurchaseCat } from "./purchase-categories.model.ts";
import { UsersPCategory } from "./users-p-cat.model.ts";

@Table({ tableName: "transactions", timestamps: true })
export class Transactions extends Model<
  InferAttributes<Transactions>,
  InferCreationAttributes<Transactions>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare wallet_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare amount: number;

  @Attribute(DataTypes.STRING(255))
  declare description: string | null;

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(DataTypes.NOW)
  declare operation_date: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare money_flow_type_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare status_id: number;

  @Attribute(DataTypes.INTEGER)
  declare purchase_cat_id: number | null;

  @Attribute(DataTypes.INTEGER)
  declare user_cat_id: number | null;

  @Attribute(DataTypes.INTEGER)
  declare related_tx_id: number | null;

  @BelongsTo(() => User, "user_id")
  declare user?: User;

  @BelongsTo(() => Wallet, "wallet_id")
  declare wallet?: Wallet;

  @BelongsTo(() => MoneyFlowType, "money_flow_type_id")
  declare flowType?: MoneyFlowType;

  @BelongsTo(() => PaymentStatuses, "status_id")
  declare status?: PaymentStatuses;

  @BelongsTo(() => PurchaseCat, "purchase_cat_id")
  declare systemCategory?: PurchaseCat;

  @BelongsTo(() => UsersPCategory, "user_cat_id")
  declare userCategory?: UsersPCategory;

  @BelongsTo(() => Transactions, "related_tx_id")
  declare relatedTransaction?: Transactions;

  get isIncome(): boolean {
    return this.amount > 0;
  }

  get isExpense(): boolean {
    return this.amount < 0;
  }

  get isTransfer(): boolean {
    return !!this.related_tx_id;
  }

  get absoluteAmount(): number {
    return Math.abs(this.amount);
  }
}
