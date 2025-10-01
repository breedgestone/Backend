import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'SubCategory not found' })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAllProducts(): Promise<Product[]> {
    return await this.productsService.findAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.productsService.findProductById(id);
  }

  @Get('sub-category/:subCategoryId')
  @ApiOperation({ summary: 'Get all products by subcategory' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findProductsBySubCategory(
    @Param('subCategoryId', ParseIntPipe) subCategoryId: number,
  ): Promise<Product[]> {
    return await this.productsService.findProductsBySubCategory(subCategoryId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.productsService.deleteProduct(id);
  }
}
