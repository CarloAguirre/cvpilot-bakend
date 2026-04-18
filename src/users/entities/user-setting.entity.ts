import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedUpdatedEntity } from '../../common/entities/timestamped.entity';
import { User } from './user.entity';

@Entity({ name: 'user_settings' })
export class UserSetting extends CreatedUpdatedEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'user_id', type: 'bigint', unique: true })
  userId!: string;

  @Column({
    name: 'email_notifications',
    type: 'boolean',
    default: true,
  })
  emailNotifications!: boolean;

  @Column({
    name: 'auto_save_history',
    type: 'boolean',
    default: true,
  })
  autoSaveHistory!: boolean;

  @Column({
    name: 'default_language',
    type: 'varchar',
    length: 20,
    default: 'en',
  })
  defaultLanguage!: string;

  @OneToOne(() => User, (user) => user.setting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}