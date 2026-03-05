import {
  Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  ForeignKeyBrand,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull, Table
} from "@sequelize/core/decorators-legacy";
import { ForeignKeyConstraintError } from "sequelize";

@Table({ tableName: 'credit_agreements', timestamps: true })
export class CreditAgreement extends Model<
  InferAttributes<CreditAgreement>,
  InferCreationAttributes<CreditAgreement>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare bank_id: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare principal_amount: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare current_principal: number;
  
 @Attribute(DataTypes.STRING(20))
  @NotNull
  declare status: string; 
}
