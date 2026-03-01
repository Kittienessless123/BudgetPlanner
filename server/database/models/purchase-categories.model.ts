import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

/*   purchase_     │
         │               │   categories    │
         │               ├─────────────────┤
         │               │ id              │
         ├───────────────│ name            │
         │               │ parent_id       │───┐
         │               │ is_active       */
export class PurchaseCat extends Model<InferAttributes<PurchaseCat>, InferCreationAttributes<PurchaseCat>> {
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