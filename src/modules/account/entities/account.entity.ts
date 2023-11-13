import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as panigate from 'mongoose-paginate-v2';
import { IsEmail } from 'class-validator';
import {
  AutoIncrementID,
  AutoIncrementIDOptions,
} from '@typegoose/auto-increment';
import { BadRequestException } from '@nestjs/common';
import { BaseEntity } from 'src/shared/base/base.entity';
export enum GENDER {
  Male = 1,
  Female = 2,
  Other = 3,
}
@Schema({ versionKey: false, timestamps: true })
export class Account extends BaseEntity {
  @Prop({ type: Number, unique: true })
  _id: number;

  @IsEmail({}, { message: 'Email is invalid' })
  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({ required: true, trim: true, minlength: 5, maxlength: 150 })
  fullname: string;

  @Prop({
    required: true,
    select: false,
    trim: true,
    minlength: 6,
    match: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  })
  password: string;

  @Prop({ required: true, unique: true, match: /^([+]\d{2})?\d{10}$/ })
  phonenumber: string;

  @Prop({ default: '2001-12-19T00:00:00.000+00:00' })
  date_of_birth: Date;

  @Prop({
    enum: GENDER,
    default: GENDER.Other,
  })
  gender: number;

  @Prop({
    default: null,
    select: false,
  })
  refreshToken: string;
  @Prop({
    default: 2,
  })
  role: number;

  @Prop({ default: true })
  isVerify: boolean;

  @Prop({ default: false })
  isBlock: boolean;
}
export type AccountDocument = HydratedDocument<Account>;

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.post('save', function (error, doc, next) {
  if (error.code === 11000) {
    const [fieldName, value] = Object.entries(error.keyValue)[0];
    const errorMessage = `Duplicate ${[fieldName]}`;
    next(new BadRequestException(errorMessage));
  } else {
    next();
  }
});

AccountSchema.plugin(AutoIncrementID, {
  field: '_id',
  startAt: 5,
} as AutoIncrementIDOptions);
AccountSchema.plugin(panigate);
