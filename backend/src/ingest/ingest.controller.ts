import { Controller, Post, Headers, UnauthorizedException, Get } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
    constructor(private ingest: IngestService) { }

    private assertAdmin(key?: string) {
        if (key !== process.env.ADMIN_KEY) throw new UnauthorizedException();
    }

    @Post('fetch')
    fetch(@Headers('x-admin-key') key?: string) {
        this.assertAdmin(key);
        return this.ingest.fetchArticles();
    }

    @Post('process')
    process(@Headers('x-admin-key') key?: string) {
        this.assertAdmin(key);
        return this.ingest.processPending();
    }

    @Post('run')
    async run(@Headers('x-admin-key') key?: string) {
        this.assertAdmin(key);
        const fetched = await this.ingest.fetchArticles(6);
        const processed = await this.ingest.processPending(6);
        return { fetched, processed };
    }
}