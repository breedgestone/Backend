import { Controller, Post, Body, UseGuards, Get, Request, Req, Param } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiParam 
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '../users/dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { DynamicOAuthGuard } from './guards/dynamic-oauth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register new user',
    description: 'Create a new user account with email and password. User must login separately after registration.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        message: 'Registration successful. Please login with your credentials.',
        user: {
          id: 1,
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input or email already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ 
    summary: 'Login with email and password',
    description: 'Authenticate using email/password credentials. Returns JWT access token.'
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginUserDto: LoginUserDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Request password reset',
    description: 'Send OTP code to user email for password reset. OTP expires in 10 minutes.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP sent successfully',
    schema: {
      example: {
        message: 'Password reset OTP sent to your email'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset password with OTP',
    description: 'Confirm password reset using OTP code sent to email. Sets new password.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successful',
    schema: {
      example: {
        message: 'Password reset successfully'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Change password (authenticated)',
    description: 'Change password for authenticated user. Requires current password verification.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password changed successfully',
    schema: {
      example: {
        message: 'Password changed successfully'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @Get('oauth/:provider')
  @UseGuards(DynamicOAuthGuard)
  @ApiOperation({ 
    summary: 'Initiate OAuth login',
    description: 'Redirect user to OAuth provider (Google or Facebook) for authentication. Supports dynamic provider routing.'
  })
  @ApiParam({ 
    name: 'provider', 
    enum: ['google', 'facebook'],
    description: 'OAuth provider name',
    example: 'google'
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirects to OAuth provider login page'
  })
  @ApiResponse({ status: 400, description: 'Unsupported OAuth provider' })
  async oauthAuth(@Req() req, @Param('provider') provider: string) {
    // Initiates OAuth flow for the specified provider
  }

  @Get('oauth/:provider/callback')
  @UseGuards(DynamicOAuthGuard)
  @ApiOperation({ 
    summary: 'OAuth callback endpoint',
    description: 'Handles OAuth callback from provider. Creates or links user account, returns JWT token.'
  })
  @ApiParam({ 
    name: 'provider', 
    enum: ['google', 'facebook'],
    description: 'OAuth provider name'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'OAuth authentication successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'john@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          linkedProviders: ['local', 'google']
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'OAuth authentication failed' })
  async oauthCallback(@Req() req, @Param('provider') provider: string) {
    return this.authService.oauthLogin(req.user);
  }
}
