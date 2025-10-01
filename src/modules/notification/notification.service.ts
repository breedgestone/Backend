import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import { SendPushDto } from './dto/send-push.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import * as nodemailer from 'nodemailer';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter;
  private firebaseInitialized = false;

  constructor(private configService: ConfigService) {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host', 'smtp.gmail.com'),
      port: this.configService.get<number>('email.port', 587),
      secure: this.configService.get<boolean>('email.secure', false),
      auth: {
        user: this.configService.get<string>('email.user', ''),
        pass: this.configService.get<string>('email.password', ''),
      },
    });

    // Initialize Firebase for push notifications (optional)
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const serviceAccountKey = this.configService.get<string>('firebase.serviceAccountKey', '');

      if (serviceAccountKey && !admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
        });
        this.firebaseInitialized = true;
        this.logger.log('Firebase Admin SDK initialized for push notifications');
      } else if (admin.apps.length) {
        this.firebaseInitialized = true;
      }
    } catch (error) {
      this.logger.warn('Firebase not initialized. Push notifications disabled:', error.message);
    }
  }

  /**
   * Send notification - supports both email and push notifications
   * Default: sends email only
   * If sendPush is true: sends both email and push notification
   */
  async sendNotification(dto: SendNotificationDto): Promise<{ email?: boolean; push?: boolean }> {
    const result: { email?: boolean; push?: boolean } = {};

    result.email = await this.sendEmail({
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
      html: dto.html,
    });


    if (dto.sendPush && dto.deviceToken && dto.title && dto.body) {
      result.push = await this.sendPushNotification({
        deviceToken: dto.deviceToken,
        title: dto.title,
        body: dto.body,
        data: dto.data,
      });
    }

    return result;
  }

  async sendEmail(dto: SendEmailDto): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('email.from', 'noreply@breedgestone.com'),
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
        html: dto.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${dto.to}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${dto.to}:`, error);
      return false;
    }
  }

  async sendPushNotification(dto: SendPushDto): Promise<boolean> {
    if (!this.firebaseInitialized) {
      this.logger.warn('Firebase not initialized. Cannot send push notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token: dto.deviceToken,
        notification: {
          title: dto.title,
          body: dto.body,
        },
        data: dto.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Push notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send push notification:`, error);
      return false;
    }
  }
}
