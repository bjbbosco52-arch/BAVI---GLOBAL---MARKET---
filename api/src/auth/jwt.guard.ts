import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const h: string = req.headers['authorization'] ?? '';
    if (!h.startsWith('Bearer ')) throw new UnauthorizedException();
    try {
      req.user = this.jwt.verify(h.slice(7));
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
