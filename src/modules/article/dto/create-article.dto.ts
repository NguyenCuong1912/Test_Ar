import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Topic } from '../entities/article.entity';
export class CreateArticleDto {
  @ApiProperty({
    description: 'title of article',
    example: 'Title Article',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'sub_title of article',
    example: 'Sub_Title Article',
  })
  @IsString()
  sub_title: string;

  @ApiProperty({
    description: 'image of article',
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  article_background: string;

  @ApiProperty({
    description: 'topic of article',
    example: Topic.CHARITY,
  })
  @IsEnum(Topic)
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    description: 'content of article',
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
