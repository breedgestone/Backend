import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Retrieve full profile information for authenticated user including metadata and linked auth providers.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: 1,
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+2348012345678',
        role: 'user',
        status: 'active',
        userMeta: {
          gender: 'male',
          dateOfBirth: '1990-01-15',
          city: 'Lagos',
          country: 'Nigeria'
        },
        authProviders: ['local', 'google']
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get current user (alias)',
    description: 'Alternative endpoint to retrieve authenticated user profile. Same as /users/profile.'
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create new user (Admin)',
    description: 'Create a new user account. This endpoint is for admin use to create users directly.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      example: {
        id: 1,
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
        status: 'active'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get all users (Admin)',
    description: 'Retrieve list of all users. Admin only endpoint.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users retrieved successfully',
    schema: {
      example: [
        {
          id: 1,
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          status: 'active'
        },
        {
          id: 2,
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'agent',
          status: 'active'
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve specific user information by user ID.'
  })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    schema: {
      example: {
        id: 1,
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        status: 'active',
        userMeta: {
          city: 'Lagos',
          country: 'Nigeria'
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update user information. Users can update their own profile, admins can update any user.'
  })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    schema: {
      example: {
        id: 1,
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe Updated',
        role: 'user',
        status: 'active'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot update other users' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Delete user (Admin)',
    description: 'Soft delete user account. Admin only endpoint.'
  })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User deleted successfully'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
