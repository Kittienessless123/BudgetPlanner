// mappers/base.mapper.ts
export interface Mapper<TEntity, TDto> {
  toEntity(dto: TDto): TEntity;
  toDto(entity: TEntity): TDto;
  toEntityList(dtos: TDto[]): TEntity[];
  toDtoList(entities: TEntity[]): TDto[];
}

import { UserEntity } from './entities.ts';
import { UserDto } from '../dto';

export class UserMapper implements Mapper<UserEntity, UserDto> {
  toEntity(dto: UserDto): UserEntity {
    const entity = new UserEntity();
    entity.id = dto.id;
    entity.email = dto.email;
    entity.passwordHash = dto.passwordHash;
    entity.name = dto.name;
    entity.defaultCurrency = dto.defaultCurrency;
    entity.createdAt = dto.createdAt || new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  toDto(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      name: entity.name,
      defaultCurrency: entity.defaultCurrency,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntityList(dtos: UserDto[]): UserEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/transaction.mapper.ts
import { TransactionEntity }  from './entities.ts';
import { TransactionDto } from '../dto';

export class TransactionMapper implements Mapper<TransactionEntity, TransactionDto> {
  toEntity(dto: TransactionDto): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.walletId = dto.walletId;
    entity.amount = dto.amount;
    entity.description = dto.description;
    entity.operationDate = dto.operationDate;
    entity.moneyFlowTypeId = dto.moneyFlowTypeId;
    entity.statusId = dto.statusId;
    entity.purchaseCatId = dto.purchaseCatId;
    entity.userCatId = dto.userCatId;
    entity.relatedTxId = dto.relatedTxId;
    entity.createdAt = dto.createdAt || new Date();
    return entity;
  }

  toDto(entity: TransactionEntity): TransactionDto {
    return {
      id: entity.id,
      userId: entity.userId,
      walletId: entity.walletId,
      amount: entity.amount,
      description: entity.description,
      operationDate: entity.operationDate,
      moneyFlowTypeId: entity.moneyFlowTypeId,
      statusId: entity.statusId,
      purchaseCatId: entity.purchaseCatId,
      userCatId: entity.userCatId,
      relatedTxId: entity.relatedTxId,
      createdAt: entity.createdAt
    };
  }

  toEntityList(dtos: TransactionDto[]): TransactionEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: TransactionEntity[]): TransactionDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/debt.mapper.ts
import { DebtEntity }from './entities.ts';
import { DebtDto } from '../dto';

export class DebtMapper implements Mapper<DebtEntity, DebtDto> {
  toEntity(dto: DebtDto): DebtEntity {
    const entity = new DebtEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.personName = dto.personName;
    entity.direction = dto.direction;
    entity.currentBalance = dto.currentBalance;
    entity.initialTxId = dto.initialTxId;
    entity.createdAt = dto.createdAt || new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  toDto(entity: DebtEntity): DebtDto {
    return {
      id: entity.id,
      userId: entity.userId,
      personName: entity.personName,
      direction: entity.direction,
      currentBalance: entity.currentBalance,
      initialTxId: entity.initialTxId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntityList(dtos: DebtDto[]): DebtEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: DebtEntity[]): DebtDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/credit-agreement.mapper.ts
import { CreditAgreementEntity }from './entities.ts';
import { CreditAgreementDto } from '../dto';

export class CreditAgreementMapper implements Mapper<CreditAgreementEntity, CreditAgreementDto> {
  toEntity(dto: CreditAgreementDto): CreditAgreementEntity {
    const entity = new CreditAgreementEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.bankId = dto.bankId;
    entity.contractNumber = dto.contractNumber;
    entity.principalAmount = dto.principalAmount;
    entity.currentPrincipal = dto.currentPrincipal;
    entity.status = dto.status;
    entity.createdAt = dto.createdAt || new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  toDto(entity: CreditAgreementEntity): CreditAgreementDto {
    return {
      id: entity.id,
      userId: entity.userId,
      bankId: entity.bankId,
      contractNumber: entity.contractNumber,
      principalAmount: entity.principalAmount,
      currentPrincipal: entity.currentPrincipal,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntityList(dtos: CreditAgreementDto[]): CreditAgreementEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: CreditAgreementEntity[]): CreditAgreementDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/wallet.mapper.ts
import { WalletEntity } from './entities.ts';
import { WalletDto } from '../dto';

export class WalletMapper implements Mapper<WalletEntity, WalletDto> {
  toEntity(dto: WalletDto): WalletEntity {
    const entity = new WalletEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.name = dto.name;
    entity.currency = dto.currency;
    entity.currentBalance = dto.currentBalance;
    entity.createdAt = dto.createdAt || new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  toDto(entity: WalletEntity): WalletDto {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      currency: entity.currency,
      currentBalance: entity.currentBalance,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntityList(dtos: WalletDto[]): WalletEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: WalletEntity[]): WalletDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/category.mapper.ts
import { PurchaseCategoryEntity, UserPurchaseCategoryEntity } from './entities.ts';
import { CategoryDto } from '../dto';

export class CategoryMapper {
  // System category mapping
  toSystemEntity(dto: CategoryDto): PurchaseCategoryEntity {
    const entity = new PurchaseCategoryEntity();
    entity.id = dto.id;
    entity.name = dto.name;
    entity.parentId = dto.parentId;
    entity.isActive = dto.isActive ?? true;
    return entity;
  }

  toSystemDto(entity: PurchaseCategoryEntity): CategoryDto {
    return {
      id: entity.id,
      name: entity.name,
      parentId: entity.parentId,
      isActive: entity.isActive,
      type: 'system'
    };
  }

  // User category mapping
  toUserEntity(dto: CategoryDto, userId: string): UserPurchaseCategoryEntity {
    const entity = new UserPurchaseCategoryEntity();
    entity.id = dto.id;
    entity.userId = userId;
    entity.name = dto.name;
    entity.parentId = dto.parentId;
    entity.parentType = dto.parentType || 'system';
    return entity;
  }

  toUserDto(entity: UserPurchaseCategoryEntity): CategoryDto {
    return {
      id: entity.id,
      name: entity.name,
      parentId: entity.parentId,
      type: 'user',
      parentType: entity.parentType
    };
  }
}

// mappers/settings.mapper.ts
import { SettingsEntity } from  './entities.ts';
import { SettingsDto } from '../dto';

export class SettingsMapper implements Mapper<SettingsEntity, SettingsDto> {
  toEntity(dto: SettingsDto): SettingsEntity {
    const entity = new SettingsEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.key = dto.key;
    entity.value = dto.value;
    entity.createdAt = dto.createdAt || new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  toDto(entity: SettingsEntity): SettingsDto {
    return {
      id: entity.id,
      userId: entity.userId,
      key: entity.key,
      value: entity.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntityList(dtos: SettingsDto[]): SettingsEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: SettingsEntity[]): SettingsDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/report.mapper.ts
import { ReportEntity }from './entities.ts';
import { ReportDto } from '../dto';

export class ReportMapper implements Mapper<ReportEntity, ReportDto> {
  toEntity(dto: ReportDto): ReportEntity {
    const entity = new ReportEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.type = dto.type;
    entity.parameters = dto.parameters;
    entity.filePath = dto.filePath;
    entity.generatedAt = dto.generatedAt || new Date();
    return entity;
  }

  toDto(entity: ReportEntity): ReportDto {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      parameters: entity.parameters,
      filePath: entity.filePath,
      generatedAt: entity.generatedAt
    };
  }

  toEntityList(dtos: ReportDto[]): ReportEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: ReportEntity[]): ReportDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/schedule.mapper.ts
import { ScheduleEntity } from './entities.ts';
import { ScheduleDto } from '../dto';

export class ScheduleMapper implements Mapper<ScheduleEntity, ScheduleDto> {
  toEntity(dto: ScheduleDto): ScheduleEntity {
    const entity = new ScheduleEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.name = dto.name;
    entity.cronExpression = dto.cronExpression;
    entity.action = dto.action;
    entity.parameters = dto.parameters;
    entity.isActive = dto.isActive;
    entity.lastRunAt = dto.lastRunAt || null;
    entity.nextRunAt = dto.nextRunAt || null;
    entity.createdAt = dto.createdAt || new Date();
    return entity;
  }

  toDto(entity: ScheduleEntity): ScheduleDto {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      cronExpression: entity.cronExpression,
      action: entity.action,
      parameters: entity.parameters,
      isActive: entity.isActive,
      lastRunAt: entity.lastRunAt,
      nextRunAt: entity.nextRunAt,
      createdAt: entity.createdAt
    };
  }

  toEntityList(dtos: ScheduleDto[]): ScheduleEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: ScheduleEntity[]): ScheduleDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/statistic.mapper.ts
import { StatisticEntity } from './entities.ts';
import { StatisticDto } from '../dto';
export class StatisticMapper implements Mapper<StatisticEntity, StatisticDto> {
  toEntity(dto: StatisticDto): StatisticEntity {
    const entity = new StatisticEntity();
    entity.id = dto.id;
    entity.userId = dto.userId;
    entity.period = dto.period;
    entity.startDate = dto.startDate;
    entity.endDate = dto.endDate;
    entity.totalIncome = dto.totalIncome;
    entity.totalExpenses = dto.totalExpenses;
    entity.netSavings = dto.netSavings;
    entity.categoryBreakdown = dto.categoryBreakdown;
    entity.generatedAt = dto.generatedAt || new Date();
    return entity;
  }

  toDto(entity: StatisticEntity): StatisticDto {
    return {
      id: entity.id,
      userId: entity.userId,
      period: entity.period,
      startDate: entity.startDate,
      endDate: entity.endDate,
      totalIncome: entity.totalIncome,
      totalExpenses: entity.totalExpenses,
      netSavings: entity.netSavings,
      categoryBreakdown: entity.categoryBreakdown,
      generatedAt: entity.generatedAt
    };
  }

  toEntityList(dtos: StatisticDto[]): StatisticEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: StatisticEntity[]): StatisticDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// mappers/bank.mapper.ts
import { BankEntity } from from './entities.ts';
import { BankDto } from '../dto';

export class BankMapper implements Mapper<BankEntity, BankDto> {
  toEntity(dto: BankDto): BankEntity {
    const entity = new BankEntity();
    entity.id = dto.id;
    entity.name = dto.name;
    entity.code = dto.code;
    entity.country = dto.country;
    return entity;
  }

  toDto(entity: BankEntity): BankDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      country: entity.country
    };
  }

  toEntityList(dtos: BankDto[]): BankEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  toDtoList(entities: BankEntity[]): BankDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}