import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Property } from '../property/entities/property.entity';
import { PropertyStatus, ApprovalAction } from '../../common/enums';
import { ApprovePropertyDto } from './dto/approve-property.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UsersService } from '../users/users.service';
import { UserRole, UserStatus } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { agentWelcomeEmailTemplate } from './templates/agent-welcome-email.template';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a secure random password
   */
  private generateRandomPassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;

    let password = '';
    // Ensure at least one character from each set
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Create a new agent account (Admin only)
   * Generates a temporary password and sends welcome email
   */
  async createAgent(adminId: number, createAgentDto: CreateAgentDto) {
    // Validate admin role
    const admin = await this.usersService.findOne(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can create agent accounts');
    }

    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createAgentDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createAgentDto.email} already exists`,
      );
    }

    // Generate temporary password
    const temporaryPassword = this.generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Create agent user
    const agent = this.userRepository.create({
      firstName: createAgentDto.firstName,
      lastName: createAgentDto.lastName,
      email: createAgentDto.email,
      phone: createAgentDto.phone,
      password: hashedPassword,
      role: UserRole.AGENT,
      status: UserStatus.ACTIVE,
      emailVerified: false,
      phoneVerified: false,
    });

    const savedAgent = await this.userRepository.save(agent);

    // Send welcome email with credentials
    const loginUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000/login');
    const emailHtml = agentWelcomeEmailTemplate({
      agentName: `${savedAgent.firstName} ${savedAgent.lastName}`,
      email: savedAgent.email,
      temporaryPassword,
      loginUrl,
    });

    try {
      await this.notificationService.sendEmail({
        to: savedAgent.email,
        subject: '🎉 Welcome to Breedgestone - Your Agent Account',
        html: emailHtml,
      });
    } catch (error) {
      // Log error but don't fail agent creation
      console.error('Failed to send welcome email:', error);
    }

    return {
      message: 'Agent account created successfully. Welcome email sent with temporary password.',
    };
  }

  /**
   * Approve or reject a property based on admin review
   */
  async reviewProperty(
    propertyId: number,
    adminId: number,
    approveDto: ApprovePropertyDto,
  ) {
    const admin = await this.usersService.findOne(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can review properties');
    }

    // Find the property
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['agent', 'reviewer'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // Validate property is in pending approval status
    if (property.status !== PropertyStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'Only properties with pending approval status can be reviewed',
      );
    }

    // Update property based on approval action
    if (approveDto.action === ApprovalAction.APPROVE) {
      property.status = PropertyStatus.APPROVED;
      property.approvedAt = new Date();
      property.rejectionReason = undefined;
    } else if (approveDto.action === ApprovalAction.REJECT) {
      if (!approveDto.rejectionReason) {
        throw new BadRequestException(
          'Rejection reason is required when rejecting a property',
        );
      }
      property.status = PropertyStatus.REJECTED;
      property.approvedAt = new Date();
      property.rejectionReason = approveDto.rejectionReason;
    }

    await this.propertyRepository.save(property);

    return {
      title: property.title,
      status: property.status,
      rejectionReason: property.rejectionReason,
      approvedAt: property.approvedAt,
      agentId: property.agentId,
    };
  }

  /**
   * Mark a property as featured (highlight on platform)
   */
  async featureProperty(propertyId: number, adminId: number) {
    // Validate admin role
    const admin = await this.usersService.findOne(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can feature properties');
    }

    // Find the property
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // Validate property is approved
    if (property.status !== PropertyStatus.APPROVED) {
      throw new BadRequestException(
        'Only approved properties can be featured',
      );
    }

    // Mark as featured
    property.isFeatured = true;
    await this.propertyRepository.save(property);

    return {
      id: property.id,
      title: property.title,
      isFeatured: property.isFeatured,
      message: 'Property marked as featured successfully',
    };
  }

  /**
   * Unfeature a property
   */
  async unfeatureProperty(propertyId: number, adminId: number) {
    // Validate admin role
    const admin = await this.usersService.findOne(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can unfeature properties');
    }

    // Find the property
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // Remove featured status
    property.isFeatured = false;
    await this.propertyRepository.save(property);

    return {
      id: property.id,
      title: property.title,
      isFeatured: property.isFeatured,
      message: 'Property unfeatured successfully',
    };
  }

  /**
   * Get all properties pending approval
   */
  async getPendingProperties() {
    const properties = await this.propertyRepository.find({
      where: { status: PropertyStatus.PENDING_APPROVAL },
      relations: ['agent'],
      order: { createdAt: 'DESC' },
    });

    return properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      address: property.address,
      city: property.city,
      state: property.state,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      areaSqm: property.areaSqm,
      status: property.status,
      agentId: property.agentId,
      agentName: property.agent?.firstName + ' ' + property.agent?.lastName,
      agentEmail: property.agent?.email,
      submittedAt: property.updatedAt,
    }));
  }

  /**
   * Get property review history (all reviewed properties)
   */
  async getPropertyHistory(filters?: {
    status?: PropertyStatus;
    adminId?: number;
  }) {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.agent', 'agent')
      .leftJoinAndSelect('property.reviewer', 'reviewer')
      .where('property.reviewedBy IS NOT NULL');

    // Apply filters
    if (filters?.status) {
      queryBuilder.andWhere('property.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.adminId) {
      queryBuilder.andWhere('property.reviewedBy = :adminId', {
        adminId: filters.adminId,
      });
    }

    queryBuilder.orderBy('property.updatedAt', 'DESC');

    const properties = await queryBuilder.getMany();

    return properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      address: property.address,
      city: property.city,
      state: property.state,
      status: property.status,
      rejectionReason: property.rejectionReason,
      agentId: property.agentId,
      approverName:
        property.approver?.firstName + ' ' + property.approver?.lastName,
      approvedAt: property.approvedAt,
    }));
  }

  /**
   * Get property statistics for admin dashboard
   */
  async getPropertyStats() {
    const [
      totalProperties,
      pendingApproval,
      approved,
      rejected,
      inactive,
      draft,
      featured,
    ] = await Promise.all([
      this.propertyRepository.count(),
      this.propertyRepository.count({
        where: { status: PropertyStatus.PENDING_APPROVAL },
      }),
      this.propertyRepository.count({
        where: { status: PropertyStatus.APPROVED },
      }),
      this.propertyRepository.count({
        where: { status: PropertyStatus.REJECTED },
      }),
      this.propertyRepository.count({
        where: { status: PropertyStatus.INACTIVE },
      }),
      this.propertyRepository.count({
        where: { status: PropertyStatus.DRAFT },
      }),
      this.propertyRepository.count({
        where: { isFeatured: true },
      }),
    ]);

    return {
      totalProperties,
      pendingApproval,
      approved,
      rejected,
      inactive,
      draft,
      featured,
    };
  }
}
