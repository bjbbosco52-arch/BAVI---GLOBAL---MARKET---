import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateListingDto } from './listings.dto';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly s: ListingsService) {}

  @Get() list(@Query('q') q?: string) { return this.s.list(q); }
  @Get(':id') one(@Param('id') id: string) { return this.s.one(id); }

  @Post() @UseGuards(JwtGuard)
  create(@Req() req: any, @Body() d: CreateListingDto) { return this.s.create(req.user.sub, d); }
}
