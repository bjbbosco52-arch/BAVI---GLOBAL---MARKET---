import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { JwtGuard } from '../auth/jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ secret: c.getOrThrow<string>('JWT_SECRET') }),
    }),
  ],
  controllers: [ListingsController],
  providers: [ListingsService, JwtGuard],
})
export class ListingsModule {}
