import { IsBoolean, IsDate, IsDateString, IsDecimal, IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';
import { Max, Min } from 'sequelize-typescript';
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

  @IsDecimal()
  // @Min(0.01)
  // @Max(1.0)
  public userWeight: string;

  @IsDecimal()
  // @Min(0.01)
  // @Max(1.0)
  public computedWeight: string;

  @IsBoolean()
  public isDeferred: boolean;

  @IsNumber()
  // @Min(1)
  public repeatFloor: number;

  @IsNumber()
  // @Max(365)
  public repeatCeiling: number;

  @IsDateString()
  lastCompletedDt: Date;

  @IsDateString()
  lastDeferredDt: Date;
}
