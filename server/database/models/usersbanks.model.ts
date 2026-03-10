import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type ForeignKey,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";
import { User } from "./user.model.ts";
import { Bank } from "./bank.model.ts";

@Table({ tableName: "user_banks", timestamps: true })
export class UserBank extends Model<
  InferAttributes<UserBank>,
  InferCreationAttributes<UserBank>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: ForeignKey<User["id"]>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare bank_id: ForeignKey<Bank["id"]>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare account_number: string;

  @Attribute(DataTypes.STRING)
  declare account_name: string | null;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  declare is_primary: CreationOptional<boolean>;

  @Attribute(DataTypes.DATE)
  declare last_sync_at: Date | null;

  @BelongsTo(() => User, "user_id")
  declare user?: User;

  @BelongsTo(() => Bank, "bank_id")
  declare bank?: Bank;
}
