import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import baseExceptions from 'src/helpers/baseExceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './entities/article.entity';
import { PaginateModel } from 'mongoose';
import { FilterArticletDto } from './dto/filter-article.dto';
import paginationQuery from 'src/pagination';
import queryFilters from 'src/pagination/filters';
import methodBase from 'src/helpers/methodBase';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: PaginateModel<Article>,
  ) {}
  //! create
  async create(createArticleDto: CreateArticleDto) {
    try {
      const article = new this.articleModel(createArticleDto);
      return article.save();
    } catch (error) {
      baseExceptions.HttpException(error);
    }
  }

  //! all
  async findAll(pagination: FilterArticletDto) {
    const options = paginationQuery(pagination.page, pagination.page_size);
    const filters = queryFilters(pagination);
    const articles = await this.articleModel.paginate(filters, options);
    return articles;
  }
  //! detail
  async findOne(_id: number): Promise<Article> {
    try {
      const article = await methodBase.findOneByCondition(
        { _id },
        this.articleModel,
      );
      if (!article) {
        baseExceptions.NotFound(_id);
      }
      return article;
    } catch (error) {
      baseExceptions.HttpException(error);
    }
  }
  //! update
  async update(
    _id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    try {
      const articleUpdate = await methodBase.findOneUpdate(
        { _id },
        this.articleModel,
        updateArticleDto,
      );
      if (!articleUpdate) {
        baseExceptions.NotFound(_id);
      }
      return articleUpdate;
    } catch (error) {
      baseExceptions.HttpException(error);
    }
  }

  async remove(_id: number) {
    try {
      const articleRemove = await methodBase.remove({ _id }, this.articleModel);
      if (!articleRemove) {
        baseExceptions.NotFound(_id);
      }
      throw new HttpException('Delete Success', HttpStatus.OK);
    } catch (error) {
      baseExceptions.HttpException(error);
    }
  }
}
