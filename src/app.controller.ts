import { Controller, Get, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { winstonLogger } from './utils/winston-logger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async readData() {
    return await this.appService.readData();
  }
}
 