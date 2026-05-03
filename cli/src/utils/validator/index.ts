import { Data } from "../../dto";

export class Validator {
  nameRegex = /^[A-Za-z]{3,10}$/;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordRegex =
    /^(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+=[\]{};:'",.<>?`~-]{4,10}$/;

  constructor() {}

  validateName(value: string): { isValid: boolean; errors: string[] } {
    this.nameRegex.test(value);
    const errors: string[] = [];
    if (!value || value.trim().length === 0) {
      errors.push("Name cannot be empty");
    } else if (!this.nameRegex.test(value)) {
      errors.push(
        "Name must contain only Latin letters (A-Z, a-z) and be 3-10 characters long",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateEmail(value: string): { isValid: boolean; errors: string[] } {
    this.emailRegex.test(value);
    const errors: string[] = [];
    if (!value || value.trim().length === 0) {
      errors.push("Email cannot be empty");
    } else if (!this.nameRegex.test(value)) {
      errors.push("Email must contain @ and .mail domain ");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  validatePassword(value: string): { isValid: boolean; errors: string[] } {
    this.passwordRegex.test(value);
    const errors: string[] = [];
    if (!value || value.trim().length === 0) {
      errors.push("Password cannot be empty");
    } else if (!this.nameRegex.test(value)) {
      errors.push(
        "Password must have 4 or 10 Latin characters, at least 1 number and not contail ' / \ | ' symbols",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  isStringOrParseToString(value: unknown): {
    success: boolean;
    result: string;
  } {
    if (typeof value === "string") return { success: true, result: value };
    try {
      const result = String(value);
      return { success: true, result: result };
    } catch (e) {
      return { success: false, result: "" };
    }
  }

  tryParseToNumber(value: unknown): {
    success: boolean;
    result: number;
  } {
    if (typeof value === "number") return { success: true, result: value };
    try {
      const result = Number(value);
      return { success: true, result: result };
    } catch (e) {
      return { success: false, result: NaN };
    }
  }
  // Добавь в существующий Validator класс
  validateBankName(value: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!value || value.trim().length === 0) {
      errors.push("Bank name cannot be empty");
    } else if (value.length < 2) {
      errors.push("Bank name must be at least 2 characters");
    } else if (value.length > 15) {
      errors.push("Bank name must be less than 15 characters");
    } else if (!/^[A-Za-z0-9\s\-&]+$/.test(value)) {
      errors.push(
        "Bank name can only contain letters, numbers, spaces, hyphens and ampersands",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
