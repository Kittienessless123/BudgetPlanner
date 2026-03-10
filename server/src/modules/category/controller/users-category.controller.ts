import type { NextFunction, Response, Request } from "express";
import { UsersCategoryService } from "../service/users-category.service.ts";
import { Container } from "@di/container.ts";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category.dto.ts";

export class UsersCategoryController {
  private categoryService = Container.get<UsersCategoryService>(
    "UsersCategoryService",
  );
  private readonly COOKIE_NAME = "token";

  async getAllByUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.categoryService.getAllByUser(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.categoryService.getOneById(
        refreshToken,
        Number(req.params.id),
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOneByName(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const result = await this.categoryService.getOneByName(
        refreshToken,
        req.params!.name![0]!,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addUserCat(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const dto = new CreateCategoryDto(
        (req as any).user.id, 
        req.body.name,
        req.body.parentId || 0,
        req.body.parentType || "user",
      );
      const result = await this.categoryService.addUserCat(refreshToken, dto);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUserCat(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const dto = new UpdateCategoryDto(
        Number(req.params.id),
        (req as any).user.id,
        req.body.name,
        req.body.parentId,
        req.body.parentType,
      );
      const result = await this.categoryService.updateUserCat(
        refreshToken,
        dto,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserCat(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[this.COOKIE_NAME];
      const userCatId = Number(req.params.id);
      const result = await this.categoryService.removeUserCat(
        refreshToken,
        userCatId,
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
