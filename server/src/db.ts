import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "node:path";

export type Product = {
  id: number;
  name: string;
  alt: string;
  banner: string;
  images: string[];
  price: string;
  filter: string;
  mouseover: string;
  mouseout: string;
  cartpic: string;
  options: string[];
};

export type NewsEntry = {
  date: string;
  arr: Array<Record<string, unknown>>;
};

export type DbSchema = {
  products: Product[];
  admins: Record<string, string>;
  ids: number;
  news?: NewsEntry;
};

export async function createDb() {
  const dbPath = path.resolve(process.cwd(), "..", "db", "db.json");
  const db = new Low<DbSchema>(new JSONFile<DbSchema>(dbPath), {
    products: [],
    admins: {},
    ids: 0,
  });
  await db.read();
  db.data ||= {
    products: [],
    admins: {},
    ids: 0,
  };
  db.data.products ||= [];
  db.data.admins ||= {};
  db.data.ids ||= 0;
  return db;
}
