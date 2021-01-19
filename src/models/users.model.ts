import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ modelName: 'users', timestamps: true, paranoid: true })
export default class User extends Model<User> {
  @PrimaryKey
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  userId: string;

  @AllowNull(false)
  @Column(DataType.STRING(45))
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password: string;
}
