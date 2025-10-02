import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { Consultation } from './entities/consultation.entity';
import { Property } from '../property/entities/property.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '../../common/enums';
import { PaymentService } from '../payment/payment.service';
import { PaymentType } from '../payment/dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Inspection)
    private inspectionRepository: Repository<Inspection>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private readonly paymentService: PaymentService,
  ) {}


  async createInspection(userId: number, createInspectionDto: CreateInspectionDto) {
    const property = await this.propertyRepository.findOne({
      where: { id: createInspectionDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${createInspectionDto.propertyId} not found`);
    }

    const inspection = this.inspectionRepository.create({
      userId,
      propertyId: createInspectionDto.propertyId,
      agentId: property.agentId,
      firstName: createInspectionDto.firstName,
      lastName: createInspectionDto.lastName,
      email: createInspectionDto.email,
      phone: createInspectionDto.phone,
      preferredDateTime: new Date(createInspectionDto.preferredDateTime),
      message: createInspectionDto.message,
      amount: createInspectionDto.amount,
      status: AppointmentStatus.PENDING,
    });

    return await this.inspectionRepository.save(inspection);
  }

  async findAllInspections(status?: AppointmentStatus, userId?: number, agentId?: number) {
    const query = this.inspectionRepository
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.user', 'user')
      .leftJoinAndSelect('inspection.property', 'property')
      .leftJoinAndSelect('inspection.agent', 'agent');

    if (status) {
      query.andWhere('inspection.status = :status', { status });
    }

    if (userId) {
      query.andWhere('inspection.userId = :userId', { userId });
    }

    if (agentId) {
      query.andWhere('inspection.agentId = :agentId', { agentId });
    }

    query.orderBy('inspection.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOneInspection(id: number) {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
      relations: ['user', 'property', 'agent'],
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    return inspection;
  }

  async updateInspection(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const inspection = await this.findOneInspection(id);

    Object.assign(inspection, updateAppointmentDto);

    return await this.inspectionRepository.save(inspection);
  }

  async deleteInspection(id: number) {
    const inspection = await this.findOneInspection(id);
    await this.inspectionRepository.remove(inspection);
    return { message: 'Inspection deleted successfully' };
  }


  async createConsultation(userId: number, createConsultationDto: CreateConsultationDto) {
    const consultation = this.consultationRepository.create({
      userId,
      firstName: createConsultationDto.firstName,
      lastName: createConsultationDto.lastName,
      email: createConsultationDto.email,
      phone: createConsultationDto.phone,
      preferredDateTime: new Date(createConsultationDto.preferredDateTime),
      message: createConsultationDto.message,
      amount: createConsultationDto.amount,
      status: AppointmentStatus.PENDING,
    });

    return await this.consultationRepository.save(consultation);
  }

  async findAllConsultations(status?: AppointmentStatus, userId?: number) {
    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.user', 'user');

    if (status) {
      query.andWhere('consultation.status = :status', { status });
    }

    if (userId) {
      query.andWhere('consultation.userId = :userId', { userId });
    }

    query.orderBy('consultation.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOneConsultation(id: number) {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }

    return consultation;
  }

  async updateConsultation(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const consultation = await this.findOneConsultation(id);

    Object.assign(consultation, updateAppointmentDto);

    return await this.consultationRepository.save(consultation);
  }

  async deleteConsultation(id: number) {
    const consultation = await this.findOneConsultation(id);
    await this.consultationRepository.remove(consultation);
    return { message: 'Consultation deleted successfully' };
  }

  /**
   * Initialize payment for inspection
   * Simply calls payment service - all logic handled there
   */
  async initializeInspectionPayment(id: number) {
    const inspection = await this.findOneInspection(id);

    if (inspection.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException('Payment can only be initialized for pending inspections');
    }

    if (!inspection.amount || inspection.amount <= 0) {
      throw new BadRequestException('Invalid inspection amount');
    }

    // Let payment service handle everything
    const paymentSession = await this.paymentService.createPaymentSession({
      paymentType: PaymentType.INSPECTION,
      entityId: inspection.id,
      userId: inspection.userId,
      amount: inspection.amount,
      email: inspection.email,
      firstName: inspection.firstName,
      lastName: inspection.lastName,
      phone: inspection.phone,
      metadata: {
        propertyId: inspection.propertyId,
        agentId: inspection.agentId,
      },
    });

    // Store reference locally for quick lookup
    inspection.paymentReference = paymentSession.reference;
    await this.inspectionRepository.save(inspection);

    return {
      inspection,
      payment: paymentSession,
    };
  }

  /**
   * Initialize payment for consultation
   * Simply calls payment service - all logic handled there
   */
  async initializeConsultationPayment(id: number) {
    const consultation = await this.findOneConsultation(id);

    if (consultation.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException('Payment can only be initialized for pending consultations');
    }

    if (!consultation.amount || consultation.amount <= 0) {
      throw new BadRequestException('Invalid consultation amount');
    }

    // Let payment service handle everything
    const paymentSession = await this.paymentService.createPaymentSession({
      paymentType: PaymentType.CONSULTATION,
      entityId: consultation.id,
      userId: consultation.userId,
      amount: consultation.amount,
      email: consultation.email,
      firstName: consultation.firstName,
      lastName: consultation.lastName,
      phone: consultation.phone,
    });

    // Store reference locally for quick lookup
    consultation.paymentReference = paymentSession.reference;
    await this.consultationRepository.save(consultation);

    return {
      consultation,
      payment: paymentSession,
    };
  }

  /**
   * Check payment status and update inspection if paid
   * Can be called manually or via cron job
   */
  async checkInspectionPaymentStatus(id: number) {
    const inspection = await this.findOneInspection(id);

    if (!inspection.paymentReference) {
      throw new BadRequestException('No payment reference found for this inspection');
    }

    // Check payment status from payment service
    const payment = await this.paymentService.getPaymentByReference(inspection.paymentReference);

    // Update status based on payment status
    if (payment.status === 'success' && inspection.status === AppointmentStatus.PENDING) {
      inspection.status = AppointmentStatus.SCHEDULED;
      await this.inspectionRepository.save(inspection);
    }

    return {
      inspection,
      paymentStatus: payment.status,
    };
  }

  /**
   * Check payment status and update consultation if paid
   * Can be called manually or via cron job
   */
  async checkConsultationPaymentStatus(id: number) {
    const consultation = await this.findOneConsultation(id);

    if (!consultation.paymentReference) {
      throw new BadRequestException('No payment reference found for this consultation');
    }

    // Check payment status from payment service
    const payment = await this.paymentService.getPaymentByReference(consultation.paymentReference);

    // Update status based on payment status
    if (payment.status === 'success' && consultation.status === AppointmentStatus.PENDING) {
      consultation.status = AppointmentStatus.SCHEDULED;
      await this.consultationRepository.save(consultation);
    }

    return {
      consultation,
      paymentStatus: payment.status,
    };
  }

  // Legacy methods - kept for backward compatibility
  // Method to update payment reference after payment is completed (called by payment module)
  async updateInspectionPayment(id: number, paymentReference: string) {
    const inspection = await this.findOneInspection(id);
    inspection.paymentReference = paymentReference;
    inspection.status = AppointmentStatus.SCHEDULED; // Update status to scheduled after payment
    return await this.inspectionRepository.save(inspection);
  }

  async updateConsultationPayment(id: number, paymentReference: string) {
    const consultation = await this.findOneConsultation(id);
    consultation.paymentReference = paymentReference;
    consultation.status = AppointmentStatus.SCHEDULED; // Update status to scheduled after payment
    return await this.consultationRepository.save(consultation);
  }
}
