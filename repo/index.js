import { createInMemoryRepo } from './in-memory.js';
import { createMySQLRepo } from './mysql2.js';
import { createMongoRepo } from './mongo.js';
import { defineRepository } from './define.js';

export const memory = () => defineRepository(createInMemoryRepo());
export const mysql2 = (options) => defineRepository(createMySQLRepo(options));
export const mongodb = (options) => defineRepository(createMongoRepo(options));
