import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateListingDto } from './listings.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly db: DataSource) {}

  async create(userId: string, d: CreateListingDto) {
    await this.db.query("UPDATE users SET role = 'seller' WHERE id = $1 AND role = 'buyer'", [userId]);
    const rows = await this.db.query(
      `INSERT INTO listings (seller_id, category_id, title, brand, description, price_pesewas, condition, stock, allow_preorder, city)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [userId, d.categoryId, d.title.trim(), d.brand ?? null, d.description ?? '', d.pricePesewas,
       d.condition ?? 'new', d.stock ?? 0, d.allowPreorder ?? false, d.city ?? null],
    );
    return { id: rows[0].id };
  }

  list(q?: string) {
    const term = (q ?? '').trim();
    const like = '%' + term.replace(/[%_]/g, '') + '%';
    return this.db.query(
      `SELECT l.id, l.title, l.brand, l.price_pesewas AS "pricePesewas", l.currency, l.condition,
              l.stock, l.allow_preorder AS "allowPreorder", l.city, c.name AS category
       FROM listings l JOIN categories c ON c.id = l.category_id
       WHERE l.status = 'active'
         AND ($1 = '' OR l.title ILIKE $2 OR l.brand ILIKE $2 OR c.name ILIKE $2)
       ORDER BY l.created_at DESC LIMIT 50`,
      [term, like],
    );
  }

  async one(id: string) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new NotFoundException();
    const rows = await this.db.query(
      `SELECT l.id, l.title, l.brand, l.description, l.price_pesewas AS "pricePesewas", l.currency,
              l.condition, l.stock, l.allow_preorder AS "allowPreorder", l.city, c.name AS category,
              u.full_name AS seller
       FROM listings l JOIN categories c ON c.id = l.category_id JOIN users u ON u.id = l.seller_id
       WHERE l.id = $1 AND l.status = 'active'`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException();
    return rows[0];
  }
}
