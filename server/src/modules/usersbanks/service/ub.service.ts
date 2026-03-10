import { UserBankRepository } from "@repositories/usersbanks.repository.ts";
import { BankRepository } from "@repositories/bank.repository.ts";
import { TokenService } from "@modules/token/service/token.service.ts";
import { CreateUserBankDto, UserBankDto , UpdateUserBankDto} from "../dto/user-bank.dto.ts";
import { UserBankError, USER_BANK_ERRORS } from "../constances/user-bank.error.ts";

export class UserBankService {
  constructor(
    private tokenService: TokenService,
    private userBankRepository: UserBankRepository,
    private bankRepository: BankRepository
  ) {}

  private async getUserIdFromToken(refreshToken: string): Promise<number> {
    if (!refreshToken) {
      throw new UserBankError('UNAUTHORIZED', 401);
    }

    const payload = this.tokenService.validateRefreshToken(refreshToken);
    if (!payload) {
      throw new UserBankError('TOKEN_INVALID', 401);
    }

    return payload.id;
  }

  async getUserBanks(refreshToken: string): Promise<UserBankDto[]> {
    const userId = await this.getUserIdFromToken(refreshToken);
    
    const userBanks = await this.userBankRepository.findByUserId(userId);
    return userBanks.map(UserBankDto.fromModel);
  }

  async addUserBank(refreshToken: string, dto: Omit<CreateUserBankDto, 'userId'>) {
    const userId = await this.getUserIdFromToken(refreshToken);

    const bank = await this.bankRepository.findById(dto.bankId);
    if (!bank) {
      throw new UserBankError('BANK_NOT_FOUND', 404);
    }

    const exists = await this.userBankRepository.hasBank(userId, dto.bankId);
    if (exists) {
      throw new UserBankError('BANK_ALREADY_ADDED', 409);
    }

    const userBank = await this.userBankRepository.addUserBank({
      user_id: userId,
      bank_id: dto.bankId,
      account_number: dto.accountNumber,
      account_name: dto.accountName,
      is_primary: dto.isPrimary,
    });

    const userBankWithBank = await this.userBankRepository.findByIdWithBank(userBank.id);
    return UserBankDto.fromModel(userBankWithBank);
  }


  async updateUserBank(refreshToken: string, dto: UpdateUserBankDto) {
    const userId = await this.getUserIdFromToken(refreshToken);

    const userBank = await this.userBankRepository.findByIdWithBank(dto.id);
    if (!userBank || userBank.user_id !== userId) {
      throw new UserBankError('USER_BANK_NOT_FOUND', 404);
    }

    const updated = await this.userBankRepository.updateUserBank(dto.id, {
      account_number: dto.accountNumber,
      account_name: dto.accountName,
      is_primary: dto.isPrimary,
    });

    if (!updated) {
      throw new UserBankError('USER_BANK_NOT_FOUND', 404);
    }

    const updatedWithBank = await this.userBankRepository.findByIdWithBank(updated.id);
    return UserBankDto.fromModel(updatedWithBank);
  }


  async removeUserBank(refreshToken: string, userBankId: number) {
    const userId = await this.getUserIdFromToken(refreshToken);

    const userBank = await this.userBankRepository.findById(userBankId);
    if (!userBank || userBank.user_id !== userId) {
      throw new UserBankError('USER_BANK_NOT_FOUND', 404);
    }

    const removed = await this.userBankRepository.removeUserBank(userBankId);
    if (!removed) {
      throw new UserBankError('USER_BANK_NOT_FOUND', 404);
    }

    return { message: 'Банк успешно удален' };
  }

  async getPrimaryBank(refreshToken: string) {
    const userId = await this.getUserIdFromToken(refreshToken);
    
    const primaryBank = await this.userBankRepository.findPrimaryBank(userId);
    if (!primaryBank) {
      return null;
    }

    return UserBankDto.fromModel(primaryBank);
  }


  async setPrimaryBank(refreshToken: string, userBankId: number) {
    const userId = await this.getUserIdFromToken(refreshToken);
    const userBank = await this.userBankRepository.findById(userBankId);
    if (!userBank || userBank.user_id !== userId) {
      throw new UserBankError('USER_BANK_NOT_FOUND', 404);
    }

    if (userBank.is_primary) {
      return { message: 'Банк уже является основным' };
    }

    const updated = await this.userBankRepository.updateUserBank(userBankId, {
      is_primary: true,
    });

    if (!updated) {
      throw new UserBankError('USER_BANK_NOT_FOUND', 404);
    }

    const updatedWithBank = await this.userBankRepository.findByIdWithBank(updated.id);
    return UserBankDto.fromModel(updatedWithBank);
  }
}