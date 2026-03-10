import { CategoryRepository } from "@repositories/category.repository.ts";
import { CategoryDto } from "../dto/category.dto.ts";
import { CategoryError } from "../constances/category.consts.ts";
import { Op } from "@sequelize/core"; 

export class CategoryReferenceService {
  constructor(private categoryRepository: CategoryRepository) {}

  async gelAllCategories() {
    const categories = await this.categoryRepository.findSystemCategories();
    return categories;
  }

  async getGlobalById(id: number) {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      throw new CategoryError('CATEGORY_NOT_FOUND', 404);
    }

    if (category.parent_type !== 'system') {
      throw new CategoryError('CATEGORY_NOT_FOUND', 404);
    }

    return category;
  }

  async getAllCategoriesPaginated(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const categories = await this.categoryRepository.findAll({
      where: { parent_type: 'system' },
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    const total = await this.categoryRepository.count({ parent_type: 'system' });

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getByParentId(parentId: number) {
    const categories = await this.categoryRepository.findByParent(
      parentId, 
      'system'
    );
    return categories;
  }

  async searchByName(query: string) {
    const categories = await this.categoryRepository.findAll({
      where: {
        parent_type: 'system',
        name: { [Op.like]: `%${query}%` } as any
      }
    });
    return categories;
  }

}