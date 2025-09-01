import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmployeeProfileDocument = EmployeeProfile & Document;

@Schema({ timestamps: true })
export class EmployeeProfile {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: false })
    organizationName: string;

    @Prop({ required: false , default: '' })
    orgSlug: string;

    @Prop({ required: false })
    trainingProviderId: string;

    @Prop({ required: true, default: 49 })
    corporateCurrency: number;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    designation: string;

    @Prop({ required: false })
    gstNumber: string;

    @Prop({ required: false })
    panNumber: string;

    @Prop({ required: false, default: 101 })
    orgPhoneDialId: number;

    @Prop({ required: false })
    organizationPhone: string;

    @Prop({ required: true, default: 2 })
    numRecruiters: number;

    @Prop({ required: false })
    image: string;

    @Prop({ required: false })
    address: string;

    @Prop({ required: false })
    zipCode: string;

    @Prop({ required: false })
    countryId: number;

    @Prop({ required: false })
    stateId: number;

    @Prop({ required: false })
    cityId: number;

    @Prop({ required: false })
    alternateEmail: string;

    @Prop({ required: true, default: false })
    createPage: boolean;

    @Prop({ required: true, default: false })
    pageActiveStatus: boolean;

    @Prop({ required: false })
    shortDescription: string;

    @Prop({ required: false })
    productsServices: string;

    @Prop({ required: false })
    culturePolicies: string;

    @Prop({ required: false })
    website: string;

    @Prop({ required: false })
    videoLink: string;

    @Prop({ required: false })
    createdBy: string;

    @Prop({ required: false })
    updatedBy: string;
}

export const EmployeeProfileSchema = SchemaFactory.createForClass(EmployeeProfile); 