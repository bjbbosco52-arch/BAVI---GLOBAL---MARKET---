import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() d: RegisterDto) {
    return this.auth.register(d);
  }

  @Post('login')
  login(@Body() d: LoginDto) {
    return this.auth.login(d);
  }
}
