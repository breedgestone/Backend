import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalAction } from '../../../common/enums';

export class ApprovePropertyDto {
  @ApiProperty({
    description: 'Action to take on the property',
    example: 'approve',
    enum: ApprovalAction,
  })
  @IsEnum(ApprovalAction)
  @IsNotEmpty()
  action: ApprovalAction;

  @ApiPropertyOptional({
    description: 'Reason for rejection (required if action is reject)',
    example: 'Property does not meet our quality standards',
    type: String,
  })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
