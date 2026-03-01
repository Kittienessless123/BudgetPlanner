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
             ▼                        │
         │               ┌─────────────────┐               │
         │               │wallet_balance_  │               │
         │               │    history      │               │
         │               ├─────────────────┤               │
         │               │ id              │               │
         │               │ wallet_id       │               │
         │               │ balance         │               │
         │               │ changed_at      │               │
         │               │ transaction_id  │───────────────┐
         │               │ reason          │               │
         │               └─────────────────┘  */
         
export class WalletStory extends Model<InferAttributes<WalletStory>, InferCreationAttributes<WalletStory>> {
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