import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';


/*    ┌─────────────────┐                 │
         │               │payment_schedule │                 │
         │               ├─────────────────┤                 │
         │               │ id              │                 │
         │               │ credit_agree_id │                 │
         │               │ scheduled_date  │                 │
         │               │ scheduled_total │                 │
         │               │ payment_id      │─────────────────┘
         │               │ payment_status  │
 */
export class PaymentSchedule extends Model<InferAttributes<PaymentSchedule>, InferCreationAttributes<PaymentSchedule>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare title: string;

  @Attribute(DataTypes.STRING)
  declare description: string | null;

  

}