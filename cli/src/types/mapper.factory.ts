import {
  UserMapper,
  WalletMapper,
  TransactionMapper,
  DebtMapper,
  CreditAgreementMapper,
  CategoryMapper,
  SettingsMapper,
  ReportMapper,
  ScheduleMapper,
  StatisticMapper,
  BankMapper,
} from "./mappers.ts";

export class MapperFactory {
  private static instance: MapperFactory;

  private userMapper: UserMapper;
  private walletMapper: WalletMapper;
  private transactionMapper: TransactionMapper;
  private debtMapper: DebtMapper;
  private creditAgreementMapper: CreditAgreementMapper;
  private categoryMapper: CategoryMapper;
  private settingsMapper: SettingsMapper;
  private reportMapper: ReportMapper;
  private scheduleMapper: ScheduleMapper;
  private statisticMapper: StatisticMapper;
  private bankMapper: BankMapper;

  private constructor() {
    this.userMapper = new UserMapper();
    this.walletMapper = new WalletMapper();
    this.transactionMapper = new TransactionMapper();
    this.debtMapper = new DebtMapper();
    this.creditAgreementMapper = new CreditAgreementMapper();
    this.categoryMapper = new CategoryMapper();
    this.settingsMapper = new SettingsMapper();
    this.reportMapper = new ReportMapper();
    this.scheduleMapper = new ScheduleMapper();
    this.statisticMapper = new StatisticMapper();
    this.bankMapper = new BankMapper();
  }

  static getInstance(): MapperFactory {
    if (!MapperFactory.instance) {
      MapperFactory.instance = new MapperFactory();
    }
    return MapperFactory.instance;
  }

  getUserMapper(): UserMapper {
    return this.userMapper;
  }

  getWalletMapper(): WalletMapper {
    return this.walletMapper;
  }

  getTransactionMapper(): TransactionMapper {
    return this.transactionMapper;
  }

  getDebtMapper(): DebtMapper {
    return this.debtMapper;
  }

  getCreditAgreementMapper(): CreditAgreementMapper {
    return this.creditAgreementMapper;
  }

  getCategoryMapper(): CategoryMapper {
    return this.categoryMapper;
  }

  getSettingsMapper(): SettingsMapper {
    return this.settingsMapper;
  }

  getReportMapper(): ReportMapper {
    return this.reportMapper;
  }

  getScheduleMapper(): ScheduleMapper {
    return this.scheduleMapper;
  }

  getStatisticMapper(): StatisticMapper {
    return this.statisticMapper;
  }

  getBankMapper(): BankMapper {
    return this.bankMapper;
  }
}
