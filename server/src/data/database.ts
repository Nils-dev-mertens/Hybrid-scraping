import sql, { Pool } from "mysql2/promise";
import dotenv from 'dotenv';
import { AiModel, AiProvider, Company, Extension, InputTypeModule, ReturnTypeModule } from "./types";

dotenv.config();

export const pool:Pool = sql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'roottest',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10', 10),
  maxIdle: parseInt(process.env.DATABASE_MAX_IDLE || '10', 10),
  idleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '60000', 10),
  queueLimit: parseInt(process.env.DATABASE_QUEUE_LIMIT || '0', 10),
  enableKeepAlive: true,
  keepAliveInitialDelay: parseInt(process.env.DATABASE_KEEP_ALIVE_INITIAL_DELAY || '0', 10),
});

// ** companies ** //
export async function getAllCompanies(): Promise<Company[] | undefined> {
  try {
    const [rows] = await pool.query('SELECT * FROM companies');
    return rows as Company[];
  } catch (error) {
    console.error('Error fetching companies:', error);
    return undefined;
  }
}

export async function addCompany(base_url: string, company_name: string): Promise<number | undefined> {
  try {
    const [result] = await pool.query(
      'INSERT INTO companies (base_url, company_name) VALUES (?, ?)',
      [base_url, company_name]
    );
    return (result as any).insertId;
  } catch (error) {
    console.error('Error adding company:', error);
    return undefined;
  }
}

export async function deleteCompany(id: number): Promise<boolean> {
  try {
    const [result] = await pool.query('DELETE FROM companies WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error deleting company:', error);
    return false;
  }
}

// ** AI providers ** //

export async function getAllAiProviders(): Promise<AiProvider[] | undefined> {
  try {
    const [rows] = await pool.query('SELECT * FROM ai_providers');
    return rows as AiProvider[];
  } catch (error) {
    console.error('Error fetching AI providers:', error);
    return undefined;
  }
}

export async function addAiProvider(name: string): Promise<number | undefined> {
  try {
    const [result] = await pool.query('INSERT INTO ai_providers (name) VALUES (?)', [name]);
    return (result as any).insertId;
  } catch (error) {
    console.error('Error adding AI provider:', error);
    return undefined;
  }
}

// ** AI Models ** //
export async function getAllAiModels(): Promise<AiModel[] | undefined> {
  try {
    const [rows] = await pool.query('SELECT * FROM ai_models');
    return rows as AiModel[];
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return undefined;
  }
}

export async function addAiModel(model: {
  model_name: string;
  thought: boolean;
  fast_generation: boolean;
  ai_provider_id: number;
}): Promise<number | undefined> {
  try {
    const [result] = await pool.query(
      'INSERT INTO ai_models (model_name, thought, fast_generation, ai_provider_id) VALUES (?, ?, ?, ?)',
      [model.model_name, model.thought, model.fast_generation, model.ai_provider_id]
    );
    return (result as any).insertId;
  } catch (error) {
    console.error('Error adding AI model:', error);
    return undefined;
  }
}

//** return/input types ** //
export async function getAllInputTypes(): Promise<InputTypeModule[] | undefined> {
  try {
    const [rows] = await pool.query('SELECT * FROM input_types');
    return rows as InputTypeModule[];
  } catch (error) {
    console.error('Error fetching input types:', error);
    return undefined;
  }
}

export async function insertInputType(value:string): Promise<number | undefined> {
  try {
    const [result] = await pool.query(`INSERT IGNORE INTO input_types (value) VALUES (?)`, [value]);
    return (result as any).insertId;
  } catch (error) {
    console.error(error)
  }
}

export async function getAllReturnTypes(): Promise<ReturnTypeModule[] | undefined> {
  try {
    const [rows] = await pool.query('SELECT * FROM return_types');
    return rows as ReturnTypeModule[];
  } catch (error) {
    console.error('Error fetching return types:', error);
    return undefined;
  }
}

export async function insertReturnType(value:string): Promise<number | undefined> {
  try {
    const [result] = await pool.query(`INSERT IGNORE INTO return_types (value) VALUES (?)`, [value]);
    return (result as any).insertId;
  } catch (error) {
    console.error(error)
  }
}

// ** Companies ** //
export async function getExtensionsByCompany(company_id: number): Promise<Extension[] | undefined> {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, i.value AS input_type, r.value AS return_type
       FROM extensions e
       JOIN input_types i ON e.input_type_id = i.id
       JOIN return_types r ON e.return_type_id = r.id
       WHERE e.company_id = ?`,
      [company_id]
    );
    return rows as Extension[];
  } catch (error) {
    console.error('Error fetching extensions:', error);
    return undefined;
  }
}

export async function addExtension(extension: {
  company_id: number;
  ai_model_id: number;
  action_name: string;
  ai_generated: boolean;
  verified: boolean;
  tag: string;
  last_edited: Date;
  query_selectors: string[];
  input_type_id: number;
  return_type_id: number;
}): Promise<number | undefined> {
  try {
    const [result] = await pool.query(
      `INSERT INTO extensions
      (company_id, ai_model_id, action_name, ai_generated, verified, tag, last_edited, query_selectors, input_type_id, return_type_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        extension.company_id,
        extension.ai_model_id,
        extension.action_name,
        extension.ai_generated,
        extension.verified,
        extension.tag,
        extension.last_edited,
        JSON.stringify(extension.query_selectors),
        extension.input_type_id,
        extension.return_type_id,
      ]
    );
    return (result as any).insertId;
  } catch (error) {
    console.error('Error adding extension:', error);
    return undefined;
  }
}

export async function deleteExtension(id: number): Promise<boolean> {
  try {
    const [result] = await pool.query('DELETE FROM extensions WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error deleting extension:', error);
    return false;
  }
}
