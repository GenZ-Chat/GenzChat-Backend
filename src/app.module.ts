import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { MongooseConnectionTest } from './health/mongoose-connection.test';
import { HealthController } from './health/health.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { UserStatusService } from './users/service/users.service.user_status_service';
import { UserStatusModule } from './users/user_status_module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      (() => {
        if (!process.env.MONGODB_URI) {
          throw new Error('MONGODB_URI environment variable is not set.');
        }
        return process.env.MONGODB_URI;
      })()
    ),
    UsersModule,
    UserStatusModule,
    // Register CacheModule globally
    CacheModule.register({
      isGlobal: true,
    }),
    ChatModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, MongooseConnectionTest,UserStatusService],
})
export class AppModule {}
