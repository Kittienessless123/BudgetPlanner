import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';
  /* ┌─────────────────┐       │      │  │
         ├──────────────│      debts       │       │      │  │
         │               ├─────────────────┤       │      │  │
         │               │ id              │       │      │  │
         │               │ user_id         │       │      │  │
         │               │ person_name     │       │      │  │
         │               │ direction       │       │      │  │
         │               │ current_balance │       │      │  │
         │               │ initial_tx_id   */

export class Debts extends Model<InferAttributes<Debts>, InferCreationAttributes<Debts>> {
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