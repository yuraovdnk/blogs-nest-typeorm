import { getConfig } from './configuration/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BasicStrategy } from './modules/auth/strategies/basic.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { TruncateData } from './modules/testing/truncateData';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './adapters/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { BlogModule } from './modules/blogs/blog.module';
import { PostModule } from './modules/posts/post.module';
import { CommentModule } from './modules/comments/comment.module';
import { SecurityModule } from './modules/security/security.module';

const configModule = ConfigModule.forRoot({
  load: [getConfig],
  isGlobal: true,
  envFilePath: ['.env'],
});

@Module({
  imports: [
    configModule,
    DatabaseModule,
    CqrsModule,
    PassportModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot({}),
    AuthModule,
    UserModule,
    BlogModule,
    PostModule,
    CommentModule,
    SecurityModule,
  ],
  controllers: [TruncateData],
  providers: [
    ConfigService,
    JwtService,
    BasicStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
