import {
  Body, Controller, Delete, Get, Param, Post, Headers, UnauthorizedException,
} from '@nestjs/common';
import { ClipsService } from './clips.service';

@Controller('clips')
export class ClipsController {
  constructor(private clips: ClipsService) {}

  private assertAdmin(key?: string) {
    if (key !== process.env.ADMIN_KEY) throw new UnauthorizedException();
  }

  @Get()
  list() { return this.clips.findPublished(); }

  @Get('all')
  all(@Headers('x-admin-key') key?: string) {
    this.assertAdmin(key);
    return this.clips.findAll();
  }

  @Post('generate')
  generate(
    @Body() body: { title: string; source: string; content: string; sourceUrl?: string },
    @Headers('x-admin-key') key?: string,
  ) {
    this.assertAdmin(key);
    return this.clips.generate(body);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string, @Headers('x-admin-key') key?: string) {
    this.assertAdmin(key);
    return this.clips.publish(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-admin-key') key?: string) {
    this.assertAdmin(key);
    return this.clips.remove(id);
  }
}