import { Module, ValidationPipe } from '@nestjs/common';
import { AppDefaultController } from './controllers/AppDefaultController';
import { ClsModule } from 'nestjs-cls';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PromoCodeModule } from '@/promocode/PromoCodeModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from '@/Config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        // Get the CorrelationID set by nginx or any other proxy
        idGenerator: (req: Request) =>
          (req.headers['x-request-id'] as string) ?? uuidv4(),
      },
    }),
    TypeOrmModule.forRoot(Config.getDataSourceOptions()),
    PromoCodeModule,
  ],
  controllers: [AppDefaultController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
  ],
})
export class AppModule {}
