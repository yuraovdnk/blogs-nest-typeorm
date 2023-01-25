import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Comment } from '../../../comments/domain/comment.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  login: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  confirmCode: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationConfirmCode: Date;

  @Column({ type: 'boolean' })
  isConfirmedEmail: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  passwordRecoveryCode: string;

  @Column({ type: 'timestamp', default: null, nullable: true })
  expirationPasswordRecoveryCode: Date;

  updateConfirmCode(newCode: string, expirationCode: Date) {
    this.confirmCode = newCode;
    this.expirationConfirmCode = expirationCode;
  }

  confirmEmail(confirmCode: string) {
    if (
      this.isConfirmedEmail ||
      this.expirationConfirmCode < new Date() ||
      this.confirmCode !== confirmCode
    ) {
      //TODO exception
      throw new Error();
    }
    this.isConfirmedEmail = true;
    this.confirmCode = null;
    this.expirationConfirmCode = null;
  }
  recoveryPassword(newRecoveryCode: string, expirationCode: Date) {
    this.passwordRecoveryCode = newRecoveryCode;
    this.expirationPasswordRecoveryCode = expirationCode;
  }
  async changePassword(newPassword: string) {
    if (this.expirationPasswordRecoveryCode < new Date()) {
      throw new BadRequestException();
    }

    this.passwordHash = await bcrypt.hash(newPassword, 10);

    this.passwordRecoveryCode = null;
    this.expirationPasswordRecoveryCode = null;
  }
}
