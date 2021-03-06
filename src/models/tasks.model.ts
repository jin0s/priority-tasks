import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ modelName: 'tasks', timestamps: true, paranoid: true })
export default class Task extends Model<Task> {
  @PrimaryKey
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  taskId: string;

  @Column({
    type: DataType.UUID,
    references: {
      model: 'users', // 'users' refers to table name
      key: 'userId', // 'userId' refers to column name in users table
    },
  })
  userId: string;

  @AllowNull(false)
  @Column(DataType.STRING(40))
  title: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 100,
    },
  })
  userWeight: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 100,
    },
  })
  computedWeight: number;

  @AllowNull(false)
  @Column(DataTypes.BOOLEAN)
  isDeferred: boolean;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
    },
  })
  repeatFloor: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
    validate: {
      max: 365,
    },
  })
  repeatCeiling: number;

  @AllowNull(true)
  @Column(DataTypes.DATE)
  lastCompletedDt: Date;

  @AllowNull(true)
  @Column(DataTypes.DATE)
  lastDeferredDt: Date;

  @AllowNull(true)
  @Column(DataTypes.DATE)
  deferredUntilDt: Date;
}
