import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');
export const DATA_DIR = path.join(ROOT, 'data/catch_all');
export const RAW_DIR = path.join(DATA_DIR, 'raw');
export const RECORDS_PATH = path.join(DATA_DIR, 'records.jsonl');
export const AGGREGATES_PATH = path.join(DATA_DIR, 'aggregates.json');
export const META_PATH = path.join(DATA_DIR, 'meta.json');
export const CONFIG_PATH = path.join(DATA_DIR, 'config.json');
