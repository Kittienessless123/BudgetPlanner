// models/user.model.ts
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
  Default,
  HasMany,
} from "@sequelize/core/decorators-legacy";
import { Wallet } from './wallet.model.ts';
import { Transactions } from './transactions.model.ts';
import { Debts } from './debts.model.ts';
import { CreditAgreement } from './credit-agreements.model.ts';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING(3))
  @NotNull
  @Default('RUB')
  declare default_currency: string;
  
  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare password_hash: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isActive: CreationOptional<boolean>;

  @Attribute(DataTypes.DATE)
  declare lastLoginAt: CreationOptional<Date | null>;

  // Ассоциации
  @HasMany(() => Wallet, 'user_id')
  declare wallets?: Wallet[];

  @HasMany(() => Transactions, 'user_id')
  declare transactions?: Transactions[];

  @HasMany(() => Debts, 'user_id')
  declare debts?: Debts[];

  @HasMany(() => CreditAgreement, 'user_id')
  declare creditAgreements?: CreditAgreement[];
}