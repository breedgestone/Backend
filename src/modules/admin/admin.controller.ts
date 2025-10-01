import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApprovePropertyDto, CreateAgentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PropertyStatus, UserRole } from '../../common/enums';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Create a new agent account (Admin only)
   */
  @Post('agent')
  @ApiOperation({ summary: 'Create a new agent account' })
  @ApiResponse({
    status: 201,
    description: 'Agent account created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - admin access required',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user with email already exists',
  })
  async createAgent(
    @Body() createAgentDto: CreateAgentDto,
    @Request() req,
  ) {
    return this.adminService.createAgent(req.user.userId, createAgentDto);
  }

  /**
   * Review a property (approve or reject)
   */
  @Post('property/:id/review')
  @ApiOperation({ summary: 'Review a property (approve or reject)' })
  @ApiResponse({
    status: 200,
    description: 'Property reviewed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid status or missing rejection note',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  async reviewProperty(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveDto: ApprovePropertyDto,
    @Request() req,
  ) {
    return this.adminService.reviewProperty(id, req.user.userId, approveDto);
  }

  /**
   * Mark a property as featured
   */
  @Post('property/:id/feature')
  @ApiOperation({ summary: 'Mark a property as featured' })
  @ApiResponse({
    status: 200,
    description: 'Property marked as featured successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - only approved properties can be featured',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  async featureProperty(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.adminService.featureProperty(id, req.user.userId);
  }

  /**
   * Unfeature a property
   */
  @Post('property/:id/unfeature')
  @ApiOperation({ summary: 'Remove featured status from a property' })
  @ApiResponse({
    status: 200,
    description: 'Property unfeatured successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Property not found',
  })
  async unfeatureProperty(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.adminService.unfeatureProperty(id, req.user.userId);
  }

  /**
   * Get all properties pending approval
   */
  @Get('property/pending')
  @ApiOperation({ summary: 'Get all properties pending approval' })
  @ApiResponse({
    status: 200,
    description: 'List of pending properties retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - admin access required',
  })
  async getPendingProperties() {
    return this.adminService.getPendingProperties();
  }

  /**
   * Get property review history with optional filters
   */
  @Get('property/history')
  @ApiOperation({ summary: 'Get property review history' })
  @ApiResponse({
    status: 200,
    description: 'Property review history retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - admin access required',
  })
  async getPropertyHistory(
    @Query('status') status?: PropertyStatus,
    @Query('adminId', new ParseIntPipe({ optional: true })) adminId?: number,
  ) {
    return this.adminService.getPropertyHistory({ status, adminId });
  }

  /**
   * Get property statistics for admin dashboard
   */
  @Get('property/stats')
  @ApiOperation({ summary: 'Get property statistics for admin dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Property statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - admin access required',
  })
  async getPropertyStats() {
    return this.adminService.getPropertyStats();
  }
}
