import { User } from "./user.model.ts";
import { Token } from "./token.model.ts";
import { Wallet } from "./wallet.model.ts";
import { Bank } from "./bank.model.ts";
import { CreditAgreement } from "./credit-agreements.model.ts";
import { CreditPayments } from "./credit-payments.model.ts";
import { Debts } from "./debts.model.ts";
import { MoneyFlowType } from "./money-flow-types.model.ts";
import { PaymentSchedule } from "./payment-schedule.model.ts";
import { PaymentStatuses } from "./payment-statuses.model.ts";
import { PurchaseCat } from "./purchase-categories.model.ts";
import { Transactions } from "./transactions.model.ts";
import { UsersPCategory } from "./users-p-cat.model.ts";
import { WalletStory } from "./wallet-balance-history.model.ts";

export const setupConnections = () => {
  User.hasMany(Wallet, {
    foreignKey: "user_id",
    as: "wallets",
    sourceKey: "id",
  });

  User.hasMany(Transactions, {
    foreignKey: "user_id",
    as: "transactions",
    sourceKey: "id",
  });

  User.hasMany(Debts, {
    foreignKey: "user_id",
    as: "debts",
    sourceKey: "id",
  });

  User.hasMany(CreditAgreement, {
    foreignKey: "user_id",
    as: "creditAgreements",
    sourceKey: "id",
  });

  User.hasMany(Token, {
    foreignKey: "user_id",
    as: "tokens",
    sourceKey: "id",
  });

  User.hasMany(UsersPCategory, {
    foreignKey: "user_id",
    as: "customCategories",
    sourceKey: "id",
  });

  Wallet.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    targetKey: "id",
  });

  Wallet.hasMany(Transactions, {
    foreignKey: "wallet_id",
    as: "transactions",
    sourceKey: "id",
  });

  Wallet.hasMany(WalletStory, {
    foreignKey: "wallet_id",
    as: "balanceHistory",
    sourceKey: "id",
  });

  WalletStory.belongsTo(Wallet, {
    foreignKey: "wallet_id",
    as: "wallet",
    targetKey: "id",
  });

  WalletStory.belongsTo(Transactions, {
    foreignKey: "transaction_id",
    as: "transaction",
    targetKey: "id",
  });

  Transactions.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    targetKey: "id",
  });

  Transactions.belongsTo(Wallet, {
    foreignKey: "wallet_id",
    as: "wallet",
    targetKey: "id",
  });

  Transactions.belongsTo(MoneyFlowType, {
    foreignKey: "money_flow_type_id",
    as: "flowType",
    targetKey: "id",
  });

  Transactions.belongsTo(PaymentStatuses, {
    foreignKey: "status_id",
    as: "status",
    targetKey: "id",
  });

  Transactions.belongsTo(PurchaseCat, {
    foreignKey: "purchase_cat_id",
    as: "systemCategory",
    targetKey: "id",
  });

  Transactions.belongsTo(UsersPCategory, {
    foreignKey: "user_cat_id",
    as: "userCategory",
    targetKey: "id",
  });

  Transactions.belongsTo(Transactions, {
    foreignKey: "related_tx_id",
    as: "relatedTransaction",
    targetKey: "id",
  });

  Transactions.hasMany(Transactions, {
    foreignKey: "related_tx_id",
    as: "childTransactions",
    sourceKey: "id",
  });

  Transactions.hasOne(CreditPayments, {
    foreignKey: "transaction_id",
    as: "creditPayment",
    sourceKey: "id",
  });

  CreditAgreement.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    targetKey: "id",
  });

  CreditAgreement.belongsTo(Bank, {
    foreignKey: "bank_id",
    as: "bank",
    targetKey: "id",
  });

  CreditAgreement.hasMany(CreditPayments, {
    foreignKey: "credit_agree_id",
    as: "payments",
    sourceKey: "id",
  });

  CreditAgreement.hasMany(PaymentSchedule, {
    foreignKey: "credit_agree_id",
    as: "schedule",
    sourceKey: "id",
  });

  CreditPayments.belongsTo(CreditAgreement, {
    foreignKey: "credit_agree_id",
    as: "agreement",
    targetKey: "id",
  });

  CreditPayments.belongsTo(Transactions, {
    foreignKey: "transaction_id",
    as: "transaction",
    targetKey: "id",
  });

  PaymentSchedule.belongsTo(CreditAgreement, {
    foreignKey: "credit_agree_id",
    as: "agreement",
    targetKey: "id",
  });

  PaymentSchedule.belongsTo(CreditPayments, {
    foreignKey: "payment_id",
    as: "payment",
    targetKey: "id",
  });

  Debts.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    targetKey: "id",
  });

  Debts.belongsTo(Transactions, {
    foreignKey: "initial_tx_id",
    as: "initialTransaction",
    targetKey: "id",
  });

  Bank.hasMany(CreditAgreement, {
    foreignKey: "bank_id",
    as: "creditAgreements",
    sourceKey: "id",
  });

  MoneyFlowType.hasMany(Transactions, {
    foreignKey: "money_flow_type_id",
    as: "transactions",
    sourceKey: "id",
  });

  PaymentStatuses.hasMany(Transactions, {
    foreignKey: "status_id",
    as: "transactions",
    sourceKey: "id",
  });

  PurchaseCat.hasMany(PurchaseCat, {
    foreignKey: "parent_id",
    as: "children",
    sourceKey: "id",
  });

  PurchaseCat.belongsTo(PurchaseCat, {
    foreignKey: "parent_id",
    as: "parent",
    targetKey: "id",
  });

  PurchaseCat.hasMany(Transactions, {
    foreignKey: "purchase_cat_id",
    as: "transactions",
    sourceKey: "id",
  });

  UsersPCategory.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    targetKey: "id",
  });

  UsersPCategory.hasMany(UsersPCategory, {
    foreignKey: "parent_id",
    as: "children",
    sourceKey: "id",
  });

  UsersPCategory.belongsTo(UsersPCategory, {
    foreignKey: "parent_id",
    as: "parent",
    targetKey: "id",
  });

  UsersPCategory.hasMany(Transactions, {
    foreignKey: "user_cat_id",
    as: "transactions",
    sourceKey: "id",
  });

  Token.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    targetKey: "id",
  });

  console.log("✅ All model associations configured");
};
