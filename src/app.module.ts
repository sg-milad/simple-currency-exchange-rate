import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModuleOptions } from './configs/config-module-options';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './configs/typeorm.config.service';

@Module({
  imports: [ConfigModule.forRoot(ConfigModuleOptions()),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useClass: TypeOrmConfigService,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
