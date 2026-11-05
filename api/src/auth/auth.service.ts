import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { hash, verify } from 'argon2';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly db: DataSource, private readonly jwt: JwtService) {}

  private token(u: { id: string; role: string; full_name: string }) {
    return {
      accessToken: this.jwt.sign({ sub: u.id, role: u.role }),
      user: { id: u.id, fullName: u.full_name, role: u.role },
    };
  }

  async register(d: RegisterDto) {
    if (!d.email && !d.phone) throw new BadRequestException('Email or phone is required');
    const email = d.email ? d.email.toLowerCase().trim() : null;
    const phone = d.phone ? d.phone.trim() : null;
    const passwordHash = await hash(d.password);
    try {
      const rows = await this.db.query(
        'INSERT INTO users (email, phone, password_hash, full_name) VALUES ($1,$2,$3,$4) RETURNING id, full_name, role',
        [email, phone, passwordHash, d.fullName.trim()],
      );
      return this.token(rows[0]);
    } catch (e: any) {
      const code = e?.code ?? e?.driverError?.code;
      if (code === '23505') throw new ConflictException('An account with these details already exists');
      throw e;
    }
  }

  async login(d: LoginDto) {
    const id = d.identifier.toLowerCase().trim();
    const rows = await this.db.query(
      'SELECT id, full_name, role, password_hash FROM users WHERE email = $1 OR phone = $1 LIMIT 1',
      [id],
    );
    const u = rows[0];
    const ok = u ? await verify(u.password_hash, d.password) : false;
    if (!u || !ok) throw new UnauthorizedException('Wrong login details');
    return this.token(u);
  }
}
