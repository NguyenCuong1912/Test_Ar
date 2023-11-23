import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/pagination/dto/index.dto';
import { Topic } from '../entities/article.entity';
export class FilterArticletDto extends PaginationDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    name: 'title',
  })
  title: string;

  @ApiPropertyOptional({
    enum: Topic,
    default: Topic.CHARITY,
  })
  @IsOptional()
  @IsEnum(Topic)
  topic?: Topic;
}
