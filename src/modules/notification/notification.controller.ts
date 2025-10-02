import { Controller } from '@nestjs/common';
import { 
  ApiTags, 
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth('accessToken')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

}
