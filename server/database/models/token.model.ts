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
  BelongsTo,
  Default,
} from "@sequelize/core/decorators-legacy";
import { User } from "./user.model.ts";

@Table({ tableName: "tokens", timestamps: true })
export class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare user_id: number;

  @Attribute(DataTypes.STRING(512))
  @NotNull
  declare refresh_token: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  @Default(DataTypes.NOW)
  declare created_at: CreationOptional<Date>;

  @BelongsTo(() => User, "user_id")
  declare user?: User;
  createdAt: any;
  expires_at: any;
}
