import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserSettingDocument = UserSetting & Document;
@Schema({ timestamps: true })
export class UserSetting {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: false })
    ipAddress: string;

    @Prop({ required: false })
    countryId: number;

    @Prop({ required: false })
    currencyId: number;

    @Prop({ required: false })
    timezoneId: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Types.ObjectId, default: null })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, default: null })
    updatedBy: Types.ObjectId;

    @Prop()
    deletedAt: Date;
}

export const UserSettingSchema = SchemaFactory.createForClass(UserSetting); 