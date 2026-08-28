import { Module } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestController } from './ingest.controller';
import { AiModule } from '../ai/ai.module';

@Module({ imports: [AiModule], providers: [IngestService], controllers: [IngestController] })
export class IngestModule { }