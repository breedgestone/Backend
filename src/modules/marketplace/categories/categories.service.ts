import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category, SubCategory, CategorySub } from './entities';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(CategorySub)
    private categorySubRepository: Repository<CategorySub>,
  ) {}

  // ==================== CATEGORIES ====================
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    // Load all categories with their junction table relationships in ONE query
    const categories = await this.categoryRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['categorySubs', 'categorySubs.subCategory', 'categorySubs.subCategory.products'],
    });

    // Transform the data structure: extract subcategories from junction table
    for (const category of categories) {
      if (category.categorySubs && category.categorySubs.length > 0) {
        // Extract just the subcategories (with their products already loaded)
        category.subCategories = category.categorySubs.map(cs => cs.subCategory);
      } else {
        category.subCategories = [];
      }
    }

    return categories;
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['categorySubs', 'categorySubs.subCategory', 'categorySubs.subCategory.products'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Transform the data structure: extract subcategories from junction table
    if (category.categorySubs && category.categorySubs.length > 0) {
      category.subCategories = category.categorySubs.map(cs => cs.subCategory);
    } else {
      category.subCategories = [];
    }

    return category;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoryRepository.softRemove(category);
  }

  // ==================== SUBCATEGORIES ====================
  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
    const subCategory = this.subCategoryRepository.create(createSubCategoryDto);
    return await this.subCategoryRepository.save(subCategory);
  }

  async findAllSubCategories(): Promise<SubCategory[]> {
    const subCategories = await this.subCategoryRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['products', 'categorySubs', 'categorySubs.category'],
    });

    // Transform to add parent categories if needed
    for (const subCategory of subCategories) {
      if (subCategory.categorySubs && subCategory.categorySubs.length > 0) {
        subCategory.categories = subCategory.categorySubs.map(cs => cs.category);
      }
    }

    return subCategories;
  }

  async findSubCategoryById(id: number): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['products', 'categorySubs', 'categorySubs.category'],
    });
    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }
    return subCategory;
  }

  async updateSubCategory(id: number, updateSubCategoryDto: UpdateSubCategoryDto): Promise<SubCategory> {
    const subCategory = await this.findSubCategoryById(id);
    Object.assign(subCategory, updateSubCategoryDto);
    return await this.subCategoryRepository.save(subCategory);
  }

  async deleteSubCategory(id: number): Promise<void> {
    const subCategory = await this.findSubCategoryById(id);
    await this.subCategoryRepository.softRemove(subCategory);
  }

  // Link subcategory to category
  async linkSubCategoryToCategory(categoryId: number, subCategoryId: number): Promise<CategorySub> {
    await this.findCategoryById(categoryId);
    await this.findSubCategoryById(subCategoryId);

    const categorySub = this.categorySubRepository.create({
      categoryId,
      subCategoryId,
    });
    return await this.categorySubRepository.save(categorySub);
  }
}
