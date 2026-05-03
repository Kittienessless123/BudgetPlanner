import { SettingsApi as BankApi } from "../api/settings.api.js";
import { BankDto, UserBankDto } from "../dto";
import { Validator } from "../utils/validator/index.ts";
import { cliLogger } from "../utils/logger.util.ts";

export class BankService {
  private validator: Validator;
  private api: BankApi;

  constructor() {
    this.validator = new Validator();
    this.api = new BankApi();
  }

  /**
   * Валидация названия банка
   */
  private validateBankName(name: string): void {
    const validation = this.validator.validateBankName(name);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }
  }

  /**
   * Добавление банка
   */
  addBank = async (
    token: string,
    data: Partial<BankDto>,
  ): Promise<{ data: BankDto; result: string; errors: string[] }> => {
    try {
      if (!token) throw new Error("Token is required");
      if (!data.name) throw new Error("Bank name is required");

      this.validateBankName(data.name);

      cliLogger.info("Adding new bank", { name: data.name });
      const response = await this.api.addBank<BankDto>(token, data);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response.message || "Failed to add bank");
      }

      cliLogger.info("Bank added successfully", { bankId: response.data.id });
      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Failed to add bank", { error: errorMessage });
      return {
        data: {} as BankDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Обновление банка
   */
  putBank = async (
    token: string,
    id: string,
    data: Partial<BankDto>,
  ): Promise<{ data: BankDto; result: string; errors: string[] }> => {
    try {
      if (!token) throw new Error("Token is required");
      if (!id) throw new Error("Bank ID is required");
      if (data.name) this.validateBankName(data.name);

      cliLogger.info("Updating bank", { bankId: id, ...data });
      const response = await this.api.putBank<BankDto>(token, id, data);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to update bank");
      }

      cliLogger.info("Bank updated successfully", { bankId: id });
      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Failed to update bank", {
        error: errorMessage,
        bankId: id,
      });
      return {
        data: {} as BankDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Получение банка по ID
   */
  getBank = async (
    token: string,
    id: string,
  ): Promise<{ data: BankDto; result: string; errors: string[] }> => {
    try {
      if (!token) throw new Error("Token is required");
      if (!id) throw new Error("Bank ID is required");

      cliLogger.info("Fetching bank", { bankId: id });
      const response = await this.api.getBank<BankDto>(token, id);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to get bank");
      }

      return {
        data: response.data,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Failed to get bank", {
        error: errorMessage,
        bankId: id,
      });
      return {
        data: {} as BankDto,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Удаление банка
   */
  deleteBank = async (
    token: string,
    id: string,
  ): Promise<{ data: null; result: string; errors: string[] }> => {
    try {
      if (!token) throw new Error("Token is required");
      if (!id) throw new Error("Bank ID is required");

      cliLogger.info("Deleting bank", { bankId: id });
      const response = await this.api.deleteBank<null>(token, id);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to delete bank");
      }

      cliLogger.info("Bank deleted successfully", { bankId: id });
      return {
        data: null,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Failed to delete bank", {
        error: errorMessage,
        bankId: id,
      });
      return {
        data: null,
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Получение всех банков
   */
  getAllBanks = async (
    token: string,
  ): Promise<{ data: BankDto[]; result: string; errors: string[] }> => {
    try {
      if (!token) throw new Error("Token is required");

      cliLogger.info("Fetching all banks");
      const response = await this.api.getAllBanks<BankDto[]>(token);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to get banks");
      }

      const banks = Array.isArray(response.data) ? response.data : [];
      cliLogger.info("Banks fetched successfully", { count: banks.length });
      return {
        data: banks,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Failed to get banks", { error: errorMessage });
      return {
        data: [],
        result: "error",
        errors: [errorMessage],
      };
    }
  };

  /**
   * Получение всех пользовательских банков
   */
  getAllUserBanks = async (
    token: string,
  ): Promise<{ data: UserBankDto[]; result: string; errors: string[] }> => {
    try {
      if (!token) throw new Error("Token is required");

      cliLogger.info("Fetching user banks");
      const response = await this.api.getAllUserBanks<UserBankDto[]>(token);

      if (response.status !== 200) {
        throw new Error(response.message || "Failed to get user banks");
      }

      const banks = Array.isArray(response.data) ? response.data : [];
      cliLogger.info("User banks fetched successfully", {
        count: banks.length,
      });
      return {
        data: banks,
        result: "success",
        errors: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      cliLogger.error("Failed to get user banks", { error: errorMessage });
      return {
        data: [],
        result: "error",
        errors: [errorMessage],
      };
    }
  };
}
