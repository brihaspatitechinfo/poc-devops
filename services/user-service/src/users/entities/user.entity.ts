import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoleDto } from '../dto/create-user.dto';
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  companyLogo: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  // @Prop({ type: Types.ObjectId, ref: 'Role', required: false, default: null })
  // roleId: Types.ObjectId;

  // @Prop({ type: [String], default: [] })
  // rolePermissions: string[];

  // @Prop({ type: [String], default: [] })
  // directPermissions: string[];

  @Prop({ type: [RoleDto], default: [] })
  roles: RoleDto[];

  @Prop({ required: false , default: null })
  dialCodeId: number;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false, default: null })
  userId: string;

  @Prop({ type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' })
  gender: string;

  @Prop({ type: String, default: 'null' })
  role: string;

  @Prop()
  designation: string;

  @Prop()
  alternateEmail: string;

  @Prop({ required: false }) //make true
  companyName: string;

  @Prop({ maxlength: 500 })
  companyOverview: string;

  @Prop()
  taxIdentification: string;

  @Prop()
  officeNumber: string;

  @Prop()
  companyHeadquarters: string;

  @Prop({ required: false }) //make true
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  pinCode: string;

  @Prop({
    type: String,
    enum: ['USD', 'AED', 'GBP', 'INR'],
    default: 'INR'
  })
  corporateCurrency: string;
  @Prop({ default: false })
  createCompanyPage: boolean;

  @Prop()
  companyHeadline: string;

  @Prop({ maxlength: 1000 })
  productsServices: string;

  @Prop({ maxlength: 1000 })
  deiCulturePolicies: string;

  @Prop()
  industry: string;

  @Prop()
  websiteLink: string;

  @Prop()
  videoLink: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, default: null })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null })
  organisationId: Types.ObjectId;

  @Prop()
  firstLoginAt: Date;

  @Prop({ default: false })
  shouldReLogin: boolean;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop()
  deletedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);

