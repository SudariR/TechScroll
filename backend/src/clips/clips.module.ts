import { Module } from '@nestjs/common';
import { ClipsService } from './clips.service';
import { ClipsController } from './clips.controller';
import { AiModule } from '../ai/ai.module';

@Module({ imports: [AiModule], providers: [ClipsService], controllers: [ClipsController] })
export class ClipsModule {}