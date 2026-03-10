import { Container } from "./container.ts";
import { User } from "@models/user.model.ts";
import { Wallet } from "@models/wallet.model.ts";
import { Transactions } from "@models/transactions.model.ts";
import { Token } from "@models/token.model.ts";
import { Bank } from "@models/bank.model.ts";
import { CreditAgreement } from "@models/credit-agreements.model.ts";
import { Debts } from "@models/debts.model.ts";
import { MoneyFlowType } from "@models/money-flow-types.model.ts";
import { PaymentStatuses } from "@models/payment-statuses.model.ts";
import { PurchaseCat } from "@models/purchase-categories.model.ts";
import { UserBank } from "@models/usersbanks.model.ts";
import { UsersPCategory } from "@models/users-p-cat.model.ts";

import { UserRepository } from "@repositories/users.repository.ts";
import { WalletRepository } from "@repositories/wallet.repository.ts";
import { TransactionRepository } from "@repositories/transactions.repository.ts";
import { TokenRepository } from "@repositories/token.repository.ts";
import { BankRepository } from "@repositories/bank.repository.ts";
import { CreditAgreementRepository } from "@repositories/credit-agreement.repository.ts";
import { DebtsRepository } from "@repositories/debt.repository.ts";
import { UserBankRepository } from "@repositories/usersbanks.repository.ts";
import { CategoryRepository } from "@repositories/category.repository.ts";

import { AuthService } from "@modules/auth/service/auth.service.ts";
import { TokenService } from "@modules/token/service/token.service.ts";
import { UserService } from "@modules/user/service/user.service.ts";
import { WalletService } from "@modules/wallet/service/wallet.service.ts";
import { TransactionService } from "@modules/transaction/service/transaction.service.ts";
import { BankService } from "@modules/bank/service/bank.service.ts";
import { CreditService } from "@modules/credit/service/credit.service.ts";
import { DebtsService } from "@modules/debts/service/debts.service.ts";
import { StatisticsService } from "@modules/statistics/service/statistics.service.ts";
import { UserBankService } from "@modules/usersbanks/service/ub.service.ts";
import { UsersCategoryService } from "@modules/category/service/users-category.service.ts";
import { CategoryReferenceService } from "@modules/category/service/category-reference.service.ts";

export function setupDI() {
  // ============ МОДЕЛИ ============
  Container.register("User", () => User);
  Container.register("Wallet", () => Wallet);
  Container.register("Transaction", () => Transactions);
  Container.register("Token", () => Token);
  Container.register("Bank", () => Bank);
  Container.register("CreditAgreement", () => CreditAgreement);
  Container.register("Debts", () => Debts);
  Container.register("MoneyFlowType", () => MoneyFlowType);
  Container.register("PaymentStatuses", () => PaymentStatuses);
  Container.register("PurchaseCat", () => PurchaseCat);
  Container.register("UserBank", () => UserBank);
  Container.register("UsersPCategory", () => UsersPCategory);

  // ============ РЕПОЗИТОРИИ ============
  Container.register(
    "UserRepository",
    () => new UserRepository(Container.get("User")),
  );

  Container.register(
    "WalletRepository",
    () => new WalletRepository(Container.get("Wallet")),
  );

  Container.register(
    "TransactionRepository",
    () => new TransactionRepository(Container.get("Transaction")),
  );

  Container.register(
    "TokenRepository",
    () => new TokenRepository(Container.get("Token")),
  );

  Container.register(
    "BankRepository",
    () => new BankRepository(Container.get("Bank")),
  );

  Container.register(
    "CreditAgreementRepository",
    () => new CreditAgreementRepository(Container.get("CreditAgreement")),
  );

  Container.register(
    "DebtsRepository",
    () => new DebtsRepository(Container.get("Debts")),
  );

  Container.register(
    "UserBankRepository",
    () => new UserBankRepository(Container.get("UserBank")),
  );

  Container.register(
    "CategoryRepository",
    () => new CategoryRepository(Container.get("UsersPCategory")),
  );

  // ============ СЕРВИСЫ ============
  Container.register(
    "TokenService",
    () => new TokenService(Container.get("TokenRepository")),
  );

  Container.register(
    "AuthService",
    () =>
      new AuthService(
        Container.get("UserRepository"),
        Container.get("TokenService"),
      ),
  );

  Container.register(
    "UserService",
    () =>
      new UserService(
        Container.get("TokenService"),
        Container.get("UserRepository"),
        Container.get("WalletRepository"),
        Container.get("DebtsRepository"),
      ),
  );

  Container.register(
    "WalletService",
    () =>
      new WalletService(
        Container.get("WalletRepository"),
        Container.get("TransactionRepository"),
      ),
  );

  Container.register(
    "TransactionService",
    () =>
      new TransactionService(
        Container.get("TransactionRepository"),
        Container.get("WalletRepository"),
      ),
  );

  Container.register(
    "BankService",
    () => new BankService(Container.get("BankRepository")),
  );

  Container.register(
    "CreditService",
    () =>
      new CreditService(
        Container.get("CreditAgreementRepository"),
        Container.get("TransactionRepository"),
      ),
  );

  Container.register(
    "DebtsService",
    () =>
      new DebtsService(
        Container.get("DebtsRepository"),
        Container.get("TransactionRepository"),
      ),
  );

  Container.register(
    "UserBankService",
    () =>
      new UserBankService(
        Container.get("TokenService"),
        Container.get("UserBankRepository"),
        Container.get("BankRepository"),
      ),
  );

  Container.register(
    "UsersCategoryService",
    () =>
      new UsersCategoryService(
        Container.get("TokenService"),
        Container.get("CategoryRepository"),
      ),
  );

  Container.register(
    "StatisticsService",
    () =>
      new StatisticsService(
        Container.get("TransactionRepository"),
        Container.get("WalletRepository"),
        Container.get("UserRepository"),
      ),
  );
  Container.register(
    "CategoryReferenceService",
    () => new CategoryReferenceService(Container.get("CategoryRepository")),
  );
  console.log("✅ DI Container initialized with all services");
}
