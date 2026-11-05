CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'buyer'
    CHECK (role IN ('buyer','seller','admin','owner')),
  email_verified boolean NOT NULL DEFAULT false,
  phone_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES users(id),
  category_id int NOT NULL REFERENCES categories(id),
  title text NOT NULL,
  brand text,
  description text NOT NULL DEFAULT '',
  price_pesewas bigint NOT NULL CHECK (price_pesewas >= 0),
  currency char(3) NOT NULL DEFAULT 'GHS',
  condition text NOT NULL DEFAULT 'new'
    CHECK (condition IN ('new','used','refurbished')),
  stock int NOT NULL DEFAULT 0 CHECK (stock >= 0),
  allow_preorder boolean NOT NULL DEFAULT false,
  city text,
  location geography(Point,4326),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft','active','sold','removed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX listings_title_trgm ON listings USING gin (title gin_trgm_ops);
CREATE INDEX listings_brand_trgm ON listings USING gin (brand gin_trgm_ops);
CREATE INDEX listings_location_gix ON listings USING gist (location);

INSERT INTO categories (name, slug) VALUES
  ('Electronics','electronics'),('Phones','phones'),
  ('Vehicles','vehicles'),('Home','home'),('Fashion','fashion');
