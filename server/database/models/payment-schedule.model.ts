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

@Table({ tableName: 'payment_schedule', timestamps: true })
export class PaymentSchedule extends Model<
  InferAttributes<PaymentSchedule>,
  InferCreationAttributes<PaymentSchedule>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare title: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare credit_agree_id: number;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare scheduled_date: CreationOptional<Date>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare scheduled_total: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare payment_id: number | null; // может быть null до оплаты

  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Default('pending')
  declare payment_status_id: string; // pending, paid, overdue
}
