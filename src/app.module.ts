import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { MongooseConnectionTest } from './health/mongoose-connection.test';
import { HealthController } from './health/health.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/genz-chat'),
    UsersModule,
    ChatModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, MongooseConnectionTest],
})
export class AppModule {}
