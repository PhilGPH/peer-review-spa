import { ConfigService } from './../config/config.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CoreModule } from '../core/core.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '../config/config.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    CoreModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.jwtSecret,
        signOptions: {
          expiresIn: configService.jwtExpireTime,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
