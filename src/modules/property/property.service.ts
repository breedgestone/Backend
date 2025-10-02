import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertyStatus } from '../../common/enums';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  // Create a new property (Agent only)
  async create(agentId: number, createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      agentId,
      status: PropertyStatus.DRAFT,
    });

    return await this.propertyRepository.save(property);
  }

  // Get all properties (with optional filters)
  async findAll(filters?: {
    status?: PropertyStatus;
    type?: string;
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]> {
    const query = this.propertyRepository.createQueryBuilder('property')
      .leftJoinAndSelect('property.agent', 'agent')
      .leftJoinAndSelect('property.assets', 'assets')
      .leftJoinAndSelect('property.fees', 'fees')
      .where('property.deletedAt IS NULL');

    if (filters?.status) {
      query.andWhere('property.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('property.type = :type', { type: filters.type });
    }

    if (filters?.city) {
      query.andWhere('property.city = :city', { city: filters.city });
    }

    if (filters?.state) {
      query.andWhere('property.state = :state', { state: filters.state });
    }

    if (filters?.minPrice) {
      query.andWhere('property.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters?.maxPrice) {
      query.andWhere('property.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    return await query.orderBy('property.createdAt', 'DESC').getMany();
  }

  // Get approved properties (public)
  async findApproved(): Promise<Property[]> {
    return await this.propertyRepository.find({
      where: { status: PropertyStatus.APPROVED },
      relations: ['agent', 'assets', 'fees'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get agent's properties
  async findByAgent(agentId: number): Promise<Property[]> {
    return await this.propertyRepository.find({
      where: { agentId },
      relations: ['agent', 'assets', 'fees'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get single property
  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['agent', 'assets', 'fees'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Increment views
    property.views += 1;
    await this.propertyRepository.save(property);

    return property;
  }

  // Update property (Agent only - own properties)
  async update(id: number, agentId: number, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);

    if (property.agentId !== agentId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    // Don't allow updates to approved properties without admin approval
    if (property.status === PropertyStatus.APPROVED) {
      throw new BadRequestException('Cannot update approved property. Please contact admin.');
    }

    Object.assign(property, updatePropertyDto);
    return await this.propertyRepository.save(property);
  }

  // Submit property for approval (Agent)
  async submitForApproval(id: number, agentId: number): Promise<Property> {
    const property = await this.findOne(id);

    if (property.agentId !== agentId) {
      throw new ForbiddenException('You can only submit your own properties');
    }

    if (property.status === PropertyStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Property is already pending approval');
    }

    if (property.status === PropertyStatus.APPROVED) {
      throw new BadRequestException('Property is already approved');
    }

    property.status = PropertyStatus.PENDING_APPROVAL;
    return await this.propertyRepository.save(property);
  }

  // Delete property (Agent only - own properties)
  async remove(id: number, agentId: number): Promise<void> {
    const property = await this.findOne(id);

    if (property.agentId !== agentId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.propertyRepository.softDelete(id);
  }
}
