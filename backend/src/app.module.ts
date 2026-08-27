import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClipsModule } from './clips/clips.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ClipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
