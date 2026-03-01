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
               ▼            │  │      │  │
         │               ┌─────────────────┐    │  │      │  │
         │               │money_flow_types │    │  │      │  │
         │               ├─────────────────┤    │  │      │  │
         │               │ id              │────┘  │      │  │
         │               │ code            │       │      │  │
         │               │ name            │       │      │  │
         │               │ direction       
 */
export class MoneyFlowType extends Model<InferAttributes<MoneyFlowType>, InferCreationAttributes<MoneyFlowType>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare title: string;

  @Attribute(DataTypes.STRING)
  declare code: string | null;

  

}