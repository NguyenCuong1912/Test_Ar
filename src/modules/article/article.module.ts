import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import {
  ModelDefinition,
  MongooseModule,
  getConnectionToken,
} from '@nestjs/mongoose';
import { Article, ArticleSchema } from './entities/article.entity';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Article.name,
        inject: [getConnectionToken()],
        useFactory: (
          connection: mongoose.Connection,
        ): ModelDefinition['schema'] => {
          const schema = ArticleSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
