import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '../../../common/enums';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ enum: AppointmentStatus, description: 'Appointment status', example: AppointmentStatus.CONFIRMED })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Scheduled appointment time', example: '2025-10-15T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  scheduledAt?: Date;

  @ApiPropertyOptional({ description: 'Confirmation timestamp', example: '2025-10-14T09:00:00Z' })
  @IsDateString()
  @IsOptional()
  confirmedAt?: Date;

  @ApiPropertyOptional({ description: 'Completion timestamp', example: '2025-10-15T12:00:00Z' })
  @IsDateString()
  @IsOptional()
  completedAt?: Date;

  @ApiPropertyOptional({ description: 'Cancellation timestamp', example: '2025-10-14T15:00:00Z' })
  @IsDateString()
  @IsOptional()
  cancelledAt?: Date;

  @ApiPropertyOptional({ description: 'Reason for cancellation', example: 'Client requested rescheduling' })
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
