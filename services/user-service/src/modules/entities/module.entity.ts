import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleDocument = Module & Document;
@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    type: [{
      name: { type: String, required: true },
      slug: { type: String, required: true },
      description: { type: String, required: false },
      isActive: { type: Boolean, required: true , default: true }
    }],
    required: false,
    default: []
  })
  subModules: {
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
  }[];

  @Prop({ required: false })
  description: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module); 