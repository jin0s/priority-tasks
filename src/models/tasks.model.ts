import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize/types';

@Table({ modelName: 'task', timestamps: true, paranoid: true })
export default class Task extends Model<Task> {
  @PrimaryKey
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  taskId: string;

  // @ForeignKey
  // @Column({
  //   defaultValue: DataType.UUIDV4,
  //   type: DataType.UUID,
  // })
  // userId: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  title: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(1, 2))
  UserWeight: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(1, 2))
  ComputedWeight: number;

  @AllowNull(false)
  @Column(DataTypes.BOOLEAN)
  IsDeferred: boolean;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
    },
  })
  RepeatFloor: number;

  @AllowNull(true)
  @Column({
    type: DataTypes.INTEGER,
    validate: {
      max: 365,
    },
  })
  RepeatCeiling: number;

  @AllowNull(true)
  @Column(DataTypes.DATE)
  LastCompletedDt: Date;

  @AllowNull(true)
  @Column(DataTypes.DATE)
  LastDeferredDt: Date;
}