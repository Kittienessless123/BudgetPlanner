import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

/*   ┌─────────────────┐   │
         │               │ user_purchase_  │   │
         │               │   categories    │   │
         │               ├─────────────────┤   │
         │               │ id              │   │
         └───────────────│ user_id         │   │
                         │ name            │   │
                         │ parent_id       │───┘
                         │ parent_type     │
                         └─────────────────┘ */
export class UsersPCategory extends Model<InferAttributes<UsersPCategory>, InferCreationAttributes<UsersPCategory>> {
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