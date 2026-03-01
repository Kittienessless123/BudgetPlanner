import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

/* │ credit_agreements│              │  │
         │               ├─────────────────┤              │  │
         │               │ id              │              │  │
         │               │ user_id         │              │  │
         │               │ bank_id         │              │  │
         │               │ contract_number │              │  │
         │               │ principal_amount│              │  │
         │               │ current_principal│             │  │
         │               │ status    */
export class CreditAgreement extends Model<InferAttributes<CreditAgreement>, InferCreationAttributes<CreditAgreement>> {
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