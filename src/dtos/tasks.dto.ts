import { IsBoolean, IsDate, IsDateString, IsDecimal, IsNumber, IsString, IsUUID, MaxLength, IsInt, Max, Min, IsOptional } from 'class-validator';
import { Task } from '../interfaces/tasks.interface';

export class TaskDto implements Task {
  public constructor(init: Task) {
    Object.assign(this, init);
  }

  @MaxLength(50, {
    message: 'Title is too long',
  })
  @IsString()
  public title: string;

  @IsInt()
  @Min(1)
  @Max(100)
  public userWeight: number;

  @IsInt()
  @Min(1)
  @Max(100)
  public computedWeight: number;

  @IsBoolean()
  public isDeferred: boolean;

  @IsNumber()
  // @Min(1)
  public repeatFloor: number;

  @IsInt()
  // @Max(365)
  public repeatCeiling: number;

  @IsDateString()
  lastCompletedDt: Date;

  @IsDateString()
  lastDeferredDt: Date;
}

export class DeferredUntilDto {
  @IsOptional()
  @IsDateString()
  deferredUntilDt: Date;
}