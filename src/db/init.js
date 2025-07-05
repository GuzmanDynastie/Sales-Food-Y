import { turso } from "./connection.js";

export async function initDB() {
  // Crea la tabla de tipos de productos (salsa, frijoles, etc.)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'active'
        );
    `);

  // Crea la tabla para las presentaciones de los productos (cuarto, litro, etc.)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS presentations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descrption TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'active'
        );
    `);

  // Crea la tabla para los origenes de las ventas de productos (venta directa, carniceria, etc.)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS origins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'active'
        );
    `);

  // Crea la tabla de productos en venta (Salsa Roja, Frijoles Fritos, etc.)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type_id INTEGER NOT NULL,
            presentation_id INTEGER NOT NULL,
            price REAL NOT NULL,
            status TEXT DEFAULT 'active',
            FOREIGN KEY(type_id) REFERENCES types(id),
            FOREIGN KEY(presentation_id) REFERENCES presentations(id)
        );
    `);

  // Crea la tabla de usuarios
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            status TEXT DEFAULT 'active'
        );
    `);

  // Crea la tabla de ventas registradas
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            origin_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY(product_id) REFERENCES products(id),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(origin_id) REFERENCES origins(id)
        );
    `);

  // Crea la tabla de insumos e ingredientes (chiles, frijoles, moldes, tapas)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS supplies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            unit TEXT NOT NULL,
            status TEXT DEFAULT 'active'
        );
    `);

  // Crea la tabla de entrada de insumos (cuando se compran insumos o ingredientes)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS supply_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supply_id INTEGER NOT NULL,
            quantity REAL NOT NULL,
            total_price REAL NOT NULL,
            unit_cost REAL NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY(supply_id) REFERENCES supplies(id)
        );
    `);

  // Crea la tabla consumo de insumos (por venta o manualmente)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS supply_consumptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supply_id INTEGER NOT NULL,
            quantity REAL NOT NULL,
            date TEXT NOT NULL,
            reason TEXT,
            FOREIGN KEY(supply_id) REFERENCES supplies(id)
        );
    `);

  // Crea la tabla Recetas (relacion producto-insumo)
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            supply_id INTEGER NOT NULL,
            quantity_per_unit REAL NOT NULL,
            status TEXT DEFAULT 'active',
            FOREIGN KEY(product_id) REFERENCES products(id),
            FOREIGN KEY(supply_id) REFERENCES supplies(id)
        );
    `);
}
