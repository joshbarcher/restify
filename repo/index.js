import { createInMemoryRepo } from './in-memory.js';
import { createMySQLRepo } from './mysql2.js';
import { createMongoRepo } from './mongo.js';
import { validateRepository } from './../utils/repo.utils.js';

export const inMemoryProvider = () => validateRepository(createInMemoryRepo());
export const mysql2Provider = (options) => validateRepository(createMySQLRepo(options));
export const mongodbProvider = (options) => validateRepository(createMongoRepo(options));
