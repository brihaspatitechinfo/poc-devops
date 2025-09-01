import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  Notification,
  NotificationDocument,
  NotificationStatus,
  NotificationType,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel({
      ...createNotificationDto,
      scheduledAt: createNotificationDto.scheduledAt 
        ? new Date(createNotificationDto.scheduledAt) 
        : undefined,
    });

    const savedNotification = await notification.save();

    // Send notification immediately if not scheduled
    if (!createNotificationDto.scheduledAt) {
      await this.sendNotification(savedNotification);
    }

    return savedNotification;
  }

  async sendBulk(notifications: CreateNotificationDto[]) {
    const createdNotifications = await Promise.all(
      notifications.map(dto => this.create(dto))
    );

    return {
      message: `${createdNotifications.length} notifications sent successfully`,
      notifications: createdNotifications,
    };
  }

  async findAll(page: number = 1, limit: number = 10, userId?: string, status?: string) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    
    if (userId) filter.userId = userId;
    if (status) filter.status = status;

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(filter).exec(),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 10) {
    return this.findAll(page, limit, userId);
  }

  async findOne(id: string) {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return notification.save();
  }

  async markAsRead(id: string) {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();
    await notification.save();
    
    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { userId, status: { $ne: NotificationStatus.READ } },
      { 
        status: NotificationStatus.READ,
        readAt: new Date(),
      }
    );

    return { message: 'All notifications marked as read' };
  }

  async remove(id: string) {
    const notification = await this.findOne(id);
    await this.notificationModel.findByIdAndDelete(id).exec();
    return { message: 'Notification deleted successfully' };
  }

  async getStats() {
    const stats = await this.notificationModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const typeStats = await this.notificationModel.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await this.notificationModel.countDocuments();

    return {
      total,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      byType: typeStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };
  }

  private async sendNotification(notification: NotificationDocument) {
    try {
      // Simulate sending notification based on type
      switch (notification.type) {
        case NotificationType.EMAIL:
          await this.sendEmail(notification);
          break;
        case NotificationType.PUSH:
          await this.sendPushNotification(notification);
          break;
        case NotificationType.SMS:
          await this.sendSMS(notification);
          break;
        case NotificationType.IN_APP:
          // In-app notifications are just stored in database
          break;
      }

      notification.status = NotificationStatus.SENT;
      notification.sentAt = new Date();
      await notification.save();

    } catch (error) {
      notification.status = NotificationStatus.FAILED;
      notification.errorMessage = error.message;
      await notification.save();
    }
  }

  private async sendEmail(notification: NotificationDocument) {
    // Simulate email sending
    console.log(`📧 Sending email to ${notification.recipient}: ${notification.title}`);
    
    // In a real implementation, you would use a service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async sendPushNotification(notification: NotificationDocument) {
    // Simulate push notification
    console.log(`📱 Sending push notification: ${notification.title}`);
    
    // In a real implementation, you would use:
    // - Firebase Cloud Messaging (FCM)
    // - Apple Push Notification Service (APNs)
    // - OneSignal
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private async sendSMS(notification: NotificationDocument) {
    // Simulate SMS sending
    console.log(`📱 Sending SMS to ${notification.recipient}: ${notification.message}`);
    
    // In a real implementation, you would use:
    // - Twilio
    // - AWS SNS
    // - Nexmo/Vonage
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 75));
  }
}
