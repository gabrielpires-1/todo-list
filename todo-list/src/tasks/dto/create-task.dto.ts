import {
  IsString,
  IsNumber,
  IsDate,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  difficulty: number;

  @IsDate()
  deadline: Date;

  @IsInt()
  order: number;

  @IsUUID()
  userId: string;
}
