import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';
/* 
  ┌─────────────────┐            │
         ├────────────────│   transactions   │            │
         │                 ├─────────────────┤            │
         │                 │ id              │            │
         │                 │ user_id         │            │
         │                 │ wallet_id       │            │
         │                 │ amount          │            │
         │                 │ description     │            │
         │                 │ operation_date  │            │
         │                 │ money_flow_type │◄────┐      │
         │                 │ status_id       │─────┼──────┘
         │                 │ purchase_cat_id │◄────┼──────┐
         │                 │ user_cat_id     │◄────┼──────┼──┐
         │                 │ related_tx_id   │──┐   */

export class Transactions extends Model<InferAttributes<Transactions>, InferCreationAttributes<Transactions>> {
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