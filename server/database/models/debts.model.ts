import {
  Sequelize,
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


@Table({ tableName: 'debts', timestamps: true })
export class Debts extends Model<
  InferAttributes<Debts>,
  InferCreationAttributes<Debts>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: number;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare person_name: string;

 @Attribute(DataTypes.STRING(10))
  @NotNull
  declare direction: string;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare current_balance: number;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare initial_tx_id: number;
}
