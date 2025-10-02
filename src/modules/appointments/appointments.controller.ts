import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentStatus } from '../../common/enums';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('inspections')
  @ApiOperation({ summary: 'Create property inspection request' })
  @ApiResponse({ status: 201, description: 'Inspection created successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  createInspection(@Request() req, @Body() createInspectionDto: CreateInspectionDto) {
    return this.appointmentsService.createInspection(req.user.id, createInspectionDto);
  }

  @Get('inspections')
  @ApiOperation({ summary: 'Get all inspections' })
  @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false, description: 'Filter by appointment status' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'agentId', required: false, description: 'Filter by agent ID' })
  @ApiResponse({ status: 200, description: 'List of inspections' })
  findAllInspections(
    @Query('status') status?: AppointmentStatus,
    @Query('userId') userId?: number,
    @Query('agentId') agentId?: number,
  ) {
    return this.appointmentsService.findAllInspections(status, userId, agentId);
  }

  @Get('inspections/:id')
  @ApiOperation({ summary: 'Get single inspection by ID' })
  @ApiParam({ name: 'id', description: 'Inspection ID' })
  @ApiResponse({ status: 200, description: 'Inspection details' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  findOneInspection(@Param('id') id: string) {
    return this.appointmentsService.findOneInspection(+id);
  }

  @Patch('inspections/:id')
  @ApiOperation({ summary: 'Update inspection status or details' })
  @ApiParam({ name: 'id', description: 'Inspection ID' })
  @ApiResponse({ status: 200, description: 'Inspection updated successfully' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  updateInspection(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.updateInspection(+id, updateAppointmentDto);
  }

  @Delete('inspections/:id')
  @ApiOperation({ summary: 'Delete inspection' })
  @ApiParam({ name: 'id', description: 'Inspection ID' })
  @ApiResponse({ status: 200, description: 'Inspection deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  deleteInspection(@Param('id') id: string) {
    return this.appointmentsService.deleteInspection(+id);
  }

  @Post('consultations')
  @ApiOperation({ summary: 'Create consultation request' })
  @ApiResponse({ status: 201, description: 'Consultation created successfully' })
  createConsultation(@Request() req, @Body() createConsultationDto: CreateConsultationDto) {
    return this.appointmentsService.createConsultation(req.user.id, createConsultationDto);
  }

  @Get('consultations')
  @ApiOperation({ summary: 'Get all consultations' })
  @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false, description: 'Filter by appointment status' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'List of consultations' })
  findAllConsultations(@Query('status') status?: AppointmentStatus, @Query('userId') userId?: number) {
    return this.appointmentsService.findAllConsultations(status, userId);
  }

  @Get('consultations/:id')
  @ApiOperation({ summary: 'Get single consultation by ID' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation details' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  findOneConsultation(@Param('id') id: string) {
    return this.appointmentsService.findOneConsultation(+id);
  }

  @Patch('consultations/:id')
  @ApiOperation({ summary: 'Update consultation status or details' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation updated successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  updateConsultation(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.updateConsultation(+id, updateAppointmentDto);
  }

  @Delete('consultations/:id')
  @ApiOperation({ summary: 'Delete consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  deleteConsultation(@Param('id') id: string) {
    return this.appointmentsService.deleteConsultation(+id);
  }

  // Payment endpoints
  @Post('inspections/:id/initialize-payment')
  @ApiOperation({ 
    summary: 'Initialize payment for inspection',
    description: 'Generate payment link for inspection appointment. Works with any configured payment provider (Paystack/Flutterwave).'
  })
  @ApiParam({ name: 'id', description: 'Inspection ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment initialized successfully',
    schema: {
      example: {
        inspection: {
          id: 1,
          status: 'pending',
          amount: 5000,
          paymentReference: 'INSP_1_1234567890'
        },
        payment: {
          authorizationUrl: 'https://checkout.paystack.com/abc123',
          reference: 'INSP_1_1234567890'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid inspection status or amount' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  initializeInspectionPayment(@Param('id') id: string) {
    return this.appointmentsService.initializeInspectionPayment(+id);
  }

  @Post('consultations/:id/initialize-payment')
  @ApiOperation({ 
    summary: 'Initialize payment for consultation',
    description: 'Generate payment link for consultation appointment. Works with any configured payment provider (Paystack/Flutterwave). After payment, user is redirected to /api/payment/callback which automatically updates the consultation status.'
  })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment initialized successfully',
    schema: {
      example: {
        consultation: {
          id: 1,
          status: 'pending',
          amount: 3000,
          paymentReference: 'PAY_CONS_1_1234567890'
        },
        payment: {
          authorizationUrl: 'https://checkout.paystack.com/abc123',
          reference: 'PAY_CONS_1_1234567890',
          amount: 300000,
          currency: 'NGN'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid consultation status or amount' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  initializeConsultationPayment(@Param('id') id: string) {
    return this.appointmentsService.initializeConsultationPayment(+id);
  }
}
