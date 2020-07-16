import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { WorkItemModule } from './work-item/work-item.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    ConfigModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.dbType as any,
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUsername,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: ["src/**/*.entity{.ts,.js}"],
        synchronize: true,
      }),
    }),
    WorkItemModule,
    CommonModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
