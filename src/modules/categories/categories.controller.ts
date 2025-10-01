import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Returns all categories' })
  findAllCategories() {
    return this.categoriesService.findAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Returns category details' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findCategoryById(@Param('id') id: string) {
    return this.categoriesService.findCategoryById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category (soft delete)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(+id);
  }

  @Post('subcategories')
  @ApiOperation({ summary: 'Create new subcategory' })
  @ApiResponse({ status: 201, description: 'Subcategory created successfully' })
  createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.categoriesService.createSubCategory(createSubCategoryDto);
  }

  @Get('subcategories')
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiResponse({ status: 200, description: 'Returns all subcategories' })
  findAllSubCategories() {
    return this.categoriesService.findAllSubCategories();
  }

  @Get('subcategories/:id')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Returns subcategory details' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  findSubCategoryById(@Param('id') id: string) {
    return this.categoriesService.findSubCategoryById(+id);
  }

  @Patch('subcategories/:id')
  @ApiOperation({ summary: 'Update subcategory' })
  @ApiResponse({ status: 200, description: 'Subcategory updated successfully' })
  updateSubCategory(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    return this.categoriesService.updateSubCategory(+id, updateSubCategoryDto);
  }

  @Delete('subcategories/:id')
  @ApiOperation({ summary: 'Delete subcategory (soft delete)' })
  @ApiResponse({ status: 200, description: 'Subcategory deleted successfully' })
  deleteSubCategory(@Param('id') id: string) {
    return this.categoriesService.deleteSubCategory(+id);
  }

  @Post(':categoryId/subcategories/:subCategoryId')
  @ApiOperation({ summary: 'Link subcategory to category' })
  @ApiResponse({ status: 201, description: 'Subcategory linked successfully' })
  linkSubCategoryToCategory(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ) {
    return this.categoriesService.linkSubCategoryToCategory(+categoryId, +subCategoryId);
  }
}
