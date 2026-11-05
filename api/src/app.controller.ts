import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly db: DataSource) {}

  @Get('health')
  async health() {
    const r = await this.db.query('SELECT PostGIS_Version() AS postgis');
    return { status: 'ok', database: 'connected', postgis: r[0].postgis };
  }
}
