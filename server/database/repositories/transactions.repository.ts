// repositories/transaction.repository.ts
import { BaseRepository } from './base.repository.ts';
import { Transactions } from '../models/transactions.model.ts';
import { Wallet } from '../models/wallet.model.ts';
import { MoneyFlowType } from '../models/money-flow-types.model.ts';
import { PaymentStatuses } from '../models/payment-statuses.model.ts';
import { Transaction, type ModelStatic, Op, type WhereOptions } from '@sequelize/core';
import { type TransactionOptions } from './repository.types.ts';
import type {
  TransactionWithAssociations,
  TransactionFilters,
  DateRange,
  TransactionSummary,
  CategorySpending,
  DailySummary,
  CreateTransactionDTO,
  CreateTransferDTO,
  UpdateTransactionDTO
} from '../../src/modules/transaction/types/transaction.types.ts';

export class TransactionRepository extends BaseRepository<Transactions> {
  constructor(model: ModelStatic<Transactions>) {
    super(model);
  }

  /**
   * Поиск транзакции с полными связями
   */
  async findByIdWithAssociations(
    id: number,
    options?: TransactionOptions
  ): Promise<TransactionWithAssociations | null> {
    const transaction = await this.model.findByPk(id, {
      include: [
        { association: 'user' },
        { association: 'wallet' },
        { association: 'flowType' },
        { association: 'status' },
        { association: 'systemCategory' },
        { association: 'userCategory' },
        { association: 'relatedTransaction' }
      ],
      transaction: options?.transaction
    });

    return transaction as TransactionWithAssociations | null;
  }

  /**
   * Поиск транзакций по фильтрам
   */
  async findByFilters(
    filters: TransactionFilters,
    pagination?: { limit?: number; offset?: number },
    options?: TransactionOptions
  ): Promise<{ rows: Transactions[]; count: number }> {
    const where: WhereOptions = this.buildWhereClause(filters);
    const { limit = 50, offset = 0 } = pagination || {};

    const { count, rows } = await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order: [['operation_date', 'DESC']],
      include: [
        { association: 'wallet', attributes: ['id', 'name', 'currency'] },
        { association: 'flowType', attributes: ['id', 'name', 'direction'] },
        { association: 'status', attributes: ['id', 'name', 'code'] }
      ],
      transaction: options?.transaction
    });

    return { count, rows };
  }

  /**
   * Поиск транзакций пользователя за период
   */
  async findByUserAndDateRange(
    userId: number,
    dateRange: DateRange,
    options?: TransactionOptions
  ): Promise<Transactions[]> {
    return this.findAll({
      where: {
        user_id: userId,
        operation_date: {
          [Op.between]: [dateRange.startDate, dateRange.endDate]
        }
      },
      order: [['operation_date', 'DESC']]
    }, options);
  }

  /**
   * Поиск транзакций по кошельку
   */
  async findByWalletId(
    walletId: number,
    limit: number = 50,
    options?: TransactionOptions
  ): Promise<Transactions[]> {
    return this.findAll({
      where: { wallet_id: walletId },
      limit,
      order: [['operation_date', 'DESC']]
    }, options);
  }

  /**
   * Создание новой транзакции
   */
  async createTransaction(
    data: CreateTransactionDTO,
    options?: TransactionOptions
  ): Promise<Transactions> {
    // Устанавливаем статус по умолчанию, если не указан
    if (!data.status_id) {
      const completedStatus = await PaymentStatuses.findOne({
        where: { code: 'completed' },
        transaction: options?.transaction
      });
      data.status_id = completedStatus?.id || 1;
    }

    return this.create(data as any, options);
  }

  /**
   * Создание перевода между кошельками
   */
  async createTransfer(
    data: CreateTransferDTO,
    options?: TransactionOptions
  ): Promise<{ fromTransaction: Transactions; toTransaction: Transactions }> {
    const { fromWalletId, toWalletId, amount, description, operation_date, userId } = data;

    // Находим тип перевода
    const transferType = await MoneyFlowType.findOne({
      where: { code: 'transfer' },
      transaction: options?.transaction
    });

    if (!transferType) {
      throw new Error('Transfer money flow type not found');
    }

    const completedStatus = await PaymentStatuses.findOne({
      where: { code: 'completed' },
      transaction: options?.transaction
    });

    // Создаем исходящую транзакцию
    const fromTransaction = await this.createTransaction({
      user_id: userId,
      wallet_id: fromWalletId,
      amount: -Math.abs(amount), // Отрицательная сумма для исходящего перевода
      money_flow_type_id: transferType.id,
      description: description || `Transfer to wallet #${toWalletId}`,
      operation_date,
      status_id: completedStatus?.id
    }, options);

    // Создаем входящую транзакцию
    const toTransaction = await this.createTransaction({
      user_id: userId,
      wallet_id: toWalletId,
      amount: Math.abs(amount), // Положительная сумма для входящего перевода
      money_flow_type_id: transferType.id,
      description: description || `Transfer from wallet #${fromWalletId}`,
      operation_date,
      status_id: completedStatus?.id,
      related_tx_id: fromTransaction.id
    }, options);

    // Обновляем related_tx_id у первой транзакции
    await fromTransaction.update(
      { related_tx_id: toTransaction.id },
      { transaction: options?.transaction }
    );

    return { fromTransaction, toTransaction };
  }

  /**
   * Обновление транзакции
   */
  async updateTransaction(
    id: number,
    data: UpdateTransactionDTO,
    options?: TransactionOptions
  ): Promise<Transactions | null> {
    return this.update(id, data as any, options);
  }

  /**
   * Получение сводки по транзакциям пользователя за период
   */
  async getSummary(
    userId: number,
    dateRange: DateRange,
    options?: TransactionOptions
  ): Promise<TransactionSummary> {
    const transactions = await this.findByUserAndDateRange(userId, dateRange, options);

    const summary = transactions.reduce(
      (acc, tx) => {
        if (tx.amount > 0) {
          acc.totalIncome += tx.amount;
        } else {
          acc.totalExpense += Math.abs(tx.amount);
        }
        acc.transactionCount++;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, transactionCount: 0 }
    );

    return {
      ...summary,
      netFlow: summary.totalIncome - summary.totalExpense,
      averageTransaction: summary.transactionCount > 0
        ? (summary.totalIncome + summary.totalExpense) / summary.transactionCount
        : 0
    };
  }

  /**
   * Получение расходов по категориям
   */
  async getSpendingByCategories(
    userId: number,
    dateRange: DateRange,
    options?: TransactionOptions
  ): Promise<CategorySpending[]> {
    const transactions = await this.findAll({
      where: {
        user_id: userId,
        amount: { [Op.lt]: 0 }, // Только расходы
        operation_date: {
          [Op.between]: [dateRange.startDate, dateRange.endDate]
        }
      },
      include: [
        { association: 'systemCategory' },
        { association: 'userCategory' }
      ]
    }, options);

    const totalSpending = transactions.reduce(
      (sum, tx) => sum + Math.abs(tx.amount),
      0
    );

    const categories = new Map<string, CategorySpending>();

    transactions.forEach((tx) => {
      const categoryId = tx.purchase_cat_id || tx.user_cat_id;
      if (!categoryId) return;

      const categoryName = tx.systemCategory?.name || tx.userCategory?.name || 'Uncategorized';
      const categoryType = tx.purchase_cat_id ? 'system' : 'user';
      const key = `${categoryType}-${categoryId}`;

      const existing = categories.get(key) || {
        categoryId,
        categoryName,
        categoryType,
        totalAmount: 0,
        transactionCount: 0,
        percentage: 0
      };

      existing.totalAmount += Math.abs(tx.amount);
      existing.transactionCount++;
      categories.set(key, existing);
    });

    return Array.from(categories.values())
      .map(cat => ({
        ...cat,
        percentage: totalSpending > 0 ? (cat.totalAmount / totalSpending) * 100 : 0
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }

  /**
   * Получение дневной статистики
   */
  async getDailyStats(
    userId: number,
    dateRange: DateRange,
    options?: TransactionOptions
  ): Promise<DailySummary[]> {
    const transactions = await this.findByUserAndDateRange(userId, dateRange, options);

    const dailyMap = new Map<string, DailySummary>();

    transactions.forEach((tx) => {
      const date = new Date(tx.operation_date).toISOString().split('T')[0];
      const existing = dailyMap.get(date) || {
        date,
        income: 0,
        expense: 0,
        net: 0
      };

      if (tx.amount > 0) {
        existing.income += tx.amount;
      } else {
        existing.expense += Math.abs(tx.amount);
      }
      existing.net = existing.income - existing.expense;

      dailyMap.set(date, existing);
    });

    return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Получение последних транзакций пользователя
   */
  async getRecentTransactions(
    userId: number,
    limit: number = 10,
    options?: TransactionOptions
  ): Promise<Transactions[]> {
    return this.findAll({
      where: { user_id: userId },
      limit,
      order: [['operation_date', 'DESC']],
      include: [
        { association: 'wallet', attributes: ['id', 'name'] },
        { association: 'flowType', attributes: ['id', 'name', 'direction'] }
      ]
    }, options);
  }

  /**
   * Отмена транзакции (создание обратной)
   */
  async reverseTransaction(
    transactionId: number,
    options?: TransactionOptions
  ): Promise<Transactions | null> {
    const originalTx = await this.findByIdWithAssociations(transactionId, options);
    
    if (!originalTx) {
      return null;
    }

    // Создаем обратную транзакцию
    const reverseTx = await this.createTransaction({
      user_id: originalTx.user_id,
      wallet_id: originalTx.wallet_id,
      amount: -originalTx.amount, // Обратная сумма
      money_flow_type_id: originalTx.money_flow_type_id,
      description: `Reversal of transaction #${transactionId}`,
      purchase_cat_id: originalTx.purchase_cat_id,
      user_cat_id: originalTx.user_cat_id,
      status_id: originalTx.status_id
    }, options);

    // Обновляем статус оригинальной транзакции
    const cancelledStatus = await PaymentStatuses.findOne({
      where: { code: 'cancelled' },
      transaction: options?.transaction
    });

    if (cancelledStatus) {
      await originalTx.update(
        { status_id: cancelledStatus.id },
        { transaction: options?.transaction }
      );
    }

    return reverseTx;
  }

  /**
   * Поиск транзакций по описанию (полнотекстовый поиск)
   */
  async searchByDescription(
    userId: number,
    searchTerm: string,
    limit: number = 20,
    options?: TransactionOptions
  ): Promise<Transactions[]> {
    return this.findAll({
      where: {
        user_id: userId,
        description: { [Op.iLike]: `%${searchTerm}%` }
      },
      limit,
      order: [['operation_date', 'DESC']]
    }, options);
  }

  /**
   * Получение баланса кошелька на определенную дату
   */
  async getWalletBalanceAtDate(
    walletId: number,
    date: Date,
    options?: TransactionOptions
  ): Promise<number> {
    const transactions = await this.findAll({
      where: {
        wallet_id: walletId,
        operation_date: { [Op.lte]: date }
      }
    }, options);

    return transactions.reduce((balance, tx) => balance + tx.amount, 0);
  }

  /**
   * Построение where-условия из фильтров
   */
  private buildWhereClause(filters: TransactionFilters): WhereOptions {
    const where: WhereOptions = {};

    if (filters.userId) {
      where.user_id = filters.userId;
    }

    if (filters.walletId) {
      where.wallet_id = filters.walletId;
    }

    if (filters.startDate || filters.endDate) {
      where.operation_date = {};
      if (filters.startDate) {
        where.operation_date[Op.gte] = filters.startDate;
      }
      if (filters.endDate) {
        where.operation_date[Op.lte] = filters.endDate;
      }
    }

    if (filters.moneyFlowTypeId) {
      where.money_flow_type_id = filters.moneyFlowTypeId;
    }

    if (filters.statusId) {
      where.status_id = filters.statusId;
    }

    if (filters.categoryId) {
      where[Op.or] = [
        { purchase_cat_id: filters.categoryId },
        { user_cat_id: filters.categoryId }
      ];
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) {
        where.amount[Op.gte] = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        where.amount[Op.lte] = filters.maxAmount;
      }
    }

    if (filters.searchTerm) {
      where.description = { [Op.iLike]: `%${filters.searchTerm}%` };
    }

    return where;
  }

  /**
   * Массовое создание транзакций
   */
  async bulkCreateTransactions(
    transactions: CreateTransactionDTO[],
    options?: TransactionOptions
  ): Promise<Transactions[]> {
    return this.model.bulkCreate(transactions as any, {
      transaction: options?.transaction,
      returning: true
    });
  }

  /**
   * Удаление транзакций по кошельку
   */
  async deleteByWalletId(
    walletId: number,
    options?: TransactionOptions
  ): Promise<number> {
    return this.model.destroy({
      where: { wallet_id: walletId },
      transaction: options?.transaction
    });
  }
}