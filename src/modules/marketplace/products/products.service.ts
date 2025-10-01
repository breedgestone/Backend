import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Product } from './entities';
import { CreateProductDto, UpdateProductDto } from './dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    // Verify subcategory exists
    await this.categoriesService.findSubCategoryById(createProductDto.subCategoryId);

    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['subCategory'],
    });
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['subCategory', 'subCategory.categorySubs', 'subCategory.categorySubs.category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findProductsBySubCategory(subCategoryId: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { subCategoryId, deletedAt: IsNull() },
      relations: ['subCategory'],
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    await this.productRepository.softRemove(product);
  }
}
