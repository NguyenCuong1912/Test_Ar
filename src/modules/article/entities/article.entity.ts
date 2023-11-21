import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as panigate from 'mongoose-paginate-v2';
import {
  AutoIncrementID,
  AutoIncrementIDOptions,
} from '@typegoose/auto-increment';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/shared/base/base.entity';

export enum Topic {
  EVENTS = 'Events',
  THREE_F = '3F',
  TOP_PLUS = 'Top +',
  THE_FACE_DEWEY = 'The face Dewey',
  SHOCK = 'Shock',
  STUDY_CORNER = 'Study corner',
  CHARITY = 'Charity',
}

@Schema({ versionKey: false, timestamps: true })
export class Article extends BaseEntity {
  @Prop({ type: Number, unique: true })
  _id: number;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: false,
  })
  sub_title: string;

  @Prop({
    type: String,
    required: true,
  })
  article_background: string;

  @Prop({
    enum: Topic,
    default: Topic.CHARITY,
  })
  topic: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string;
}
export type ArticleDocument = HydratedDocument<Article>;

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.plugin(AutoIncrementID, {
  field: '_id',
  startAt: 1,
} as AutoIncrementIDOptions);
ArticleSchema.plugin(panigate);
