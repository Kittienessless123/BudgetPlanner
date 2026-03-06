import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
} from "@sequelize/core/decorators-legacy";

@Table({ tableName: "money_flow_types", timestamps: true })
export class MoneyFlowType extends Model<
  InferAttributes<MoneyFlowType>,
  InferCreationAttributes<MoneyFlowType>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING(50))
  @NotNull
  declare name: string;
  
  @Attribute(DataTypes.STRING(30))
  @NotNull
  declare code: string; // income, expense, transfer, etc

  @Attribute(DataTypes.STRING(10))
  @NotNull
  declare direction: string; // 'in' или 'out'
}
