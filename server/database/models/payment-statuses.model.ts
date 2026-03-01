import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
 type InferCreationAttributes,
 type CreationOptional,
} from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

//id
//code
//name


export class PaymentStatuses extends Model<InferAttributes<PaymentStatuses>, InferCreationAttributes<PaymentStatuses>> {
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