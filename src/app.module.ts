import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { loggerConfig } from './core/logger/winston.config';
import { AiIntegrationModule } from './modules/ai-integration/ai-integration.module';
import { AuthModule } from './modules/auth/auth.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ProductModule } from './modules/product/product.module';
import { ProjectModule } from './modules/project/project.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({ global: true }),
    WinstonModule.forRoot(loggerConfig),
    UserModule,
    AuthModule,
    ProjectModule,
    ProductModule,
    AiIntegrationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AllExceptionsFilter,
    LoggingInterceptor,
    TransformInterceptor,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [JwtModule],
})
export class AppModule {}
