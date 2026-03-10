import { CategoryRepository } from "@repositories/category.repository.ts";
import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dto/category.dto.ts";
import { TokenService } from "@modules/token/service/token.service.ts";
import { CategoryError } from "../constances/category.consts.ts";

export class UsersCategoryService {
  constructor(
    private tokenService: TokenService,
    private categoryRepository: CategoryRepository,
  ) {}

  private async getUserIdFromToken(refreshToken: string): Promise<number> {
    if (!refreshToken) {
      throw new CategoryError("UNAUTHORIZED", 401);
    }

    const payload = this.tokenService.validateRefreshToken(refreshToken);
    if (!payload) {
      throw new CategoryError("TOKEN_INVALID", 401);
    }

    return payload.id;
  }

  async getAllByUser(refreshToken: string): Promise<CategoryDto[]> {
    const userId = await this.getUserIdFromToken(refreshToken);

    const categories = await this.categoryRepository.findByUserId(userId);
    return categories.map((cat) => new CategoryDto(cat));
  }

  async getOneById(refreshToken: string, id: number): Promise<CategoryDto> {
    const userId = await this.getUserIdFromToken(refreshToken);

    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new CategoryError("CATEGORY_NOT_FOUND", 404);
    }
    if (category.user_id !== userId && category.parent_type !== "system") {
      throw new CategoryError("UNAUTHORIZED", 403);
    }

    return new CategoryDto(category);
  }

  async getOneByName(refreshToken: string, name: string): Promise<CategoryDto> {
    const userId = await this.getUserIdFromToken(refreshToken);
    const category = await this.categoryRepository.findByNameAndUser(
      name,
      userId,
    );

    if (!category) {
      throw new CategoryError("CATEGORY_NOT_FOUND", 404);
    }

    return new CategoryDto(category);
  }

  async addUserCat(
    refreshToken: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const userId = await this.getUserIdFromToken(refreshToken);

    const existingCategory = await this.categoryRepository.findByNameAndUser(
      dto.name,
      userId,
    );

    if (existingCategory) {
      throw new CategoryError("CATEGORY_ALREADY_EXISTS", 409);
    }

    if (dto.parentId && dto.parentId > 0) {
      const parentCategory = await this.categoryRepository.findById(
        dto.parentId,
      );
      if (!parentCategory) {
        throw new CategoryError("PARENT_CATEGORY_NOT_FOUND", 404);
      }
    }

    const newCategory = await this.categoryRepository.create({
      user_id: userId,
      name: dto.name,
      parent_id: dto.parentId || 0,
      parent_type: dto.parentType || "user",
    });

    return new CategoryDto(newCategory);
  }

  async updateUserCat(
    refreshToken: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const userId = await this.getUserIdFromToken(refreshToken);

    const category = await this.categoryRepository.findById(dto.id);

    if (!category) {
      throw new CategoryError("CATEGORY_NOT_FOUND", 404);
    }

    if (category.user_id !== userId) {
      throw new CategoryError("UNAUTHORIZED", 403);
    }

    if (category.parent_type === "system") {
      throw new CategoryError("CANNOT_UPDATE_SYSTEM_CATEGORY", 403);
    }

    if (dto.name && dto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByNameAndUser(
        dto.name,
        userId,
      );

      if (existingCategory && existingCategory.id !== dto.id) {
        throw new CategoryError("CATEGORY_ALREADY_EXISTS", 409);
      }
    }

    const updateData: Partial<{
      name: string;
      parent_id: number;
      parent_type: string;
    }> = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.parentId !== undefined) updateData.parent_id = dto.parentId;
    if (dto.parentType) updateData.parent_type = dto.parentType;

    const updatedCategory = await this.categoryRepository.update(
      dto.id,
      updateData,
    );

    if (!updatedCategory) {
      throw new CategoryError("CATEGORY_NOT_FOUND", 404);
    }

    return new CategoryDto(updatedCategory);
  }

  async removeUserCat(
    refreshToken: string,
    categoryId: number,
  ): Promise<{ message: string }> {
    const userId = await this.getUserIdFromToken(refreshToken);

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new CategoryError("CATEGORY_NOT_FOUND", 404);
    }

    if (category.user_id !== userId) {
      throw new CategoryError("UNAUTHORIZED", 403);
    }

    if (category.parent_type === "system") {
      throw new CategoryError("CANNOT_DELETE_SYSTEM_CATEGORY", 403);
    }

    const childCategories = await this.categoryRepository.findByParent(
      categoryId,
      "user",
      userId,
    );

    if (childCategories.length > 0) {
      throw new CategoryError("CATEGORY_NOT_FOUND", 400); 
    }

    const deleted = await this.categoryRepository.delete(categoryId);

    if (!deleted) {
      throw new CategoryError("CATEGORY_NOT_FOUND", 404);
    }

    return { message: "Категория успешно удалена" };
  }
}
