import type { NextFunction, Response, Request } from "express";
import { CategoryReferenceService } from "../service/category-reference.service.ts";
import { Container } from "@di/container.ts";
import { CategoryDto } from "../dto/category.dto.ts";

export class CategoryReferenceController {
  private categoryService = Container.get<CategoryReferenceService>(
    "CategoryReferenceService",
  );

  async getAllGlobal(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.gelAllCategories();
      const result = categories.map((cat) => new CategoryDto(cat));
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getGlobalById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryService.getGlobalById(
        Number(req.params.id),
      );
      const result = new CategoryDto(category);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllPaginated(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.categoryService.getAllCategoriesPaginated(
        page,
        limit,
      );
      return res.json({
        categories: result.categories.map((cat) => new CategoryDto(cat)),
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
  async getByParentId(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = parseInt(req.params!.parentId![0]!) || 0;
      const categories = await this.categoryService.getByParentId(parentId);
      const result = categories.map((cat) => new CategoryDto(cat));
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const categories = await this.categoryService.searchByName(query);
      const result = categories.map((cat) => new CategoryDto(cat));
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
