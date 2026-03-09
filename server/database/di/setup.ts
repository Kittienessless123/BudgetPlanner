// di/setup.ts
import { Container } from './container.ts';
import { User } from '../models/user.model.ts';
import { Wallet } from '../models/wallet.model.ts';
import { Transactions } from '../models/transactions.model.ts';
import { Token } from '../models/token.model.ts'; // Добавляем модель Token
import { Bank } from '../models/bank.model.ts';
import { CreditAgreement } from '../models/credit-agreements.model.ts';
import { Debts } from '../models/debts.model.ts';
import { MoneyFlowType } from '../models/money-flow-types.model.ts';
import { PaymentStatuses } from '../models/payment-statuses.model.ts';
import { PurchaseCat } from '../models/purchase-categories.model.ts';

// Репозитории
import { UserRepository } from '../repositories/users.repository.ts';
import { WalletRepository } from '../repositories/wallet.repository.ts';
import { TransactionRepository } from '../repositories/transactions.repository.ts';
import { TokenRepository } from '../repositories/token.repository.ts'; // Добавляем репозиторий токенов
import { BankRepository } from '../repositories/bank.repository.ts';
import { CreditAgreementRepository } from '../repositories/credit-agreement.repository.ts';
import { DebtsRepository } from '../repositories/debt.repository.ts';

// Сервисы
import { AuthService } from '../../src/modules/auth/service/auth.service.ts';
import { TokenService } from '../../src/modules/token/service/token.service.ts'; // Добавляем TokenService
import { UserService } from '../../src/modules/user/service/user.service.ts';
import { WalletService } from '../../src/modules/wallet/service/wallet.service.ts';
import { TransactionService } from '../../src/modules/transaction/service/transaction.service.ts';
import { BankService } from '../../src/modules/bank/service/bank.service.ts';
import { CreditService } from '../../src/modules/credit/service/credit.service.ts';
import { DebtsService } from '../../src/modules/debts/service/debts.service.ts';
import { StatisticsService } from '../../src/modules/statistics/service/statistics.service.ts';

export function setupDI() {
  // ============ МОДЕЛИ ============
  Container.register('User', () => User);
  Container.register('Wallet', () => Wallet);
  Container.register('Transaction', () => Transactions);
  Container.register('Token', () => Token);
  Container.register('Bank', () => Bank);
  Container.register('CreditAgreement', () => CreditAgreement);
  Container.register('Debts', () => Debts);
  Container.register('MoneyFlowType', () => MoneyFlowType);
  Container.register('PaymentStatuses', () => PaymentStatuses);
  Container.register('PurchaseCat', () => PurchaseCat);

  // ============ РЕПОЗИТОРИИ ============
  Container.register('UserRepository', () => 
    new UserRepository(Container.get('User'))
  );
  
  Container.register('WalletRepository', () => 
    new WalletRepository(Container.get('Wallet'))
  );
  
  Container.register('TransactionRepository', () => 
    new TransactionRepository(Container.get('Transaction'))
  );
  
  Container.register('TokenRepository', () => 
    new TokenRepository(Container.get('Token'))
  );
  
  Container.register('BankRepository', () => 
    new BankRepository(Container.get('Bank'))
  );
  
  Container.register('CreditAgreementRepository', () => 
    new CreditAgreementRepository(Container.get('CreditAgreement'))
  );
  
  Container.register('DebtsRepository', () => 
    new DebtsRepository(Container.get('Debts'))
  );

  // ============ СЕРВИСЫ ============
  
  // Auth модуль
  Container.register('TokenService', () => 
    new TokenService(Container.get('TokenRepository'))
  );
  
  Container.register('AuthService', () => 
  new AuthService(
    Container.get('UserRepository'),
    Container.get('TokenService')
  )
);
  // User модуль
  Container.register('UserService', () => 
    new UserService(
      Container.get('UserRepository'),
      Container.get('TokenService') // Для управления сессиями
    )
  );
  
  // Wallet модуль
  Container.register('WalletService', () => 
    new WalletService(
      Container.get('WalletRepository'),
      Container.get('TransactionRepository')
    )
  );
  
  // Transaction модуль
  Container.register('TransactionService', () => 
    new TransactionService(
      Container.get('TransactionRepository'),
      Container.get('WalletRepository')
    )
  );
  
  // Bank модуль
  Container.register('BankService', () => 
    new BankService(Container.get('BankRepository'))
  );
  
  // Credit модуль
  Container.register('CreditService', () => 
    new CreditService(
      Container.get('CreditAgreementRepository'),
      Container.get('TransactionRepository')
    )
  );
  
  // Debts модуль
  Container.register('DebtsService', () => 
    new DebtsService(
      Container.get('DebtsRepository'),
      Container.get('TransactionRepository')
    )
  );
  
  // Statistics модуль (может зависеть от многих сервисов)
  Container.register('StatisticsService', () => 
    new StatisticsService(
      Container.get('TransactionRepository'),
      Container.get('WalletRepository'),
      Container.get('UserRepository')
    )
  );

  console.log('✅ DI Container initialized with all services');
}