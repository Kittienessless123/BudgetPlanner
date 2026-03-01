import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

   /* │credit_payments  │              │  │
         │               ├─────────────────┤              │  │
         │               │ id              │              │  │
         │               │ credit_agree_id │              │  │
         │               │ transaction_id  │──────────────┘  │
         │               │ payment_date    │                 │
         │               │ principal_amount│                 │
         │               │ interest_amount │   */
export class CreditPayments extends Model<InferAttributes<CreditPayments>, InferCreationAttributes<CreditPayments>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare title: string;

  

}