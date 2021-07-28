import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    trim: true,
  })
  password: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop()
  profilePhoto: string;

  @Prop()
  description: string;

  @Prop({
    type: [String],
  })
  movies: string[];

  @Prop({
    type: [{ type: MSchema.Types.ObjectId, ref: 'User' }],
  })
  following: [User];

  @Prop({
    type: [{ type: MSchema.Types.ObjectId, ref: 'User' }],
  })
  followers: [User];

  @Prop({
    required: true,
  })
  validationCode: string;

  @Prop({
    default: false,
  })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
