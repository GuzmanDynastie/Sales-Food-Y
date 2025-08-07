import { master } from "./connection.js";

export async function initDB() {
  // Crea la tabla de tipos de productos (salsa, frijoles, etc.)
  await master.query(`
        CREATE TABLE IF NOT EXISTS types (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla para las presentaciones de los productos (cuarto, litro, etc.)
  await master.query(`
        CREATE TABLE IF NOT EXISTS presentations (
            id SERIAL PRIMARY KEY,
            descrption TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla para los origenes de las ventas de productos (venta directa, carniceria, etc.)
  await master.query(`
        CREATE TABLE IF NOT EXISTS origins (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla de productos en venta (Salsa Roja, Frijoles Fritos, etc.)
  await master.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            type_id INTEGER NOT NULL REFERENCES types(id),
            presentation_id INTEGER NOT NULL REFERENCES presentations(id),
            price NUMERIC(10, 2) NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla de usuarios
  await master.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla de ventas registradas
  await master.query(`
        CREATE TABLE IF NOT EXISTS sales (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES products(id), 
            user_id INTEGER NOT NULL REFERENCES users(id),
            origin_id INTEGER NOT NULL REFERENCES origins(id),
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            quantity INTEGER NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL,
            reason TEXT NULL
        );
    `);

  // Crea la tabla de insumos e ingredientes (chiles, frijoles, moldes, tapas)
  await master.query(`
        CREATE TABLE IF NOT EXISTS supplies (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            unit TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla de entrada de insumos (cuando se compran insumos o ingredientes)
  await master.query(`
        CREATE TABLE IF NOT EXISTS supply_entries (
            id SERIAL PRIMARY KEY,
            supply_id INTEGER NOT NULL REFERENCES supplies(id),
            quantity NUMERIC(10, 2) NOT NULL,
            total_price NUMERIC(10, 2) NOT NULL,
            unit_cost NUMERIC(10, 2) NOT NULL,
            date TIMESTAMP NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla consumo de insumos (por venta o manualmente)
  await master.query(`
        CREATE TABLE IF NOT EXISTS supply_consumptions (
            id SERIAL PRIMARY KEY,
            supply_id INTEGER NOT NULL REFERENCES supplies(id),
            quantity NUMERIC(10, 2) NOT NULL,
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            reason TEXT,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);

  // Crea la tabla Recetas (relacion producto-insumo)
  await master.query(`
        CREATE TABLE IF NOT EXISTS recipes (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES products(id),
            supply_id INTEGER NOT NULL REFERENCES supplies(id),
            quantity_per_unit NUMERIC(10, 2) NOT NULL,
            status TEXT DEFAULT 'active',
            cancelled_at TIMESTAMP NULL
        );
    `);
}
