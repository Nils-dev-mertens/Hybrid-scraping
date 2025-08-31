import sql from "mysql2/promise";
import dotenv from 'dotenv';
import { Company, Extension, Aimodel, Aiprovider, ExtensionInput } from "./types";

dotenv.config();

export const pool = sql.createPool({
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

export async function getAllCompanies(): Promise<Company[] | undefined> {
  try {
    const [rows] = await pool.query('SELECT * FROM companies');
    return <Company[]>rows;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return undefined;
  }
}

export async function getAllExtensions(): Promise<Extension[] | undefined> {
  try {
    const [rows] = await pool.query('SELECT * FROM extensions');
    return <Extension[]>rows;
  } catch (error) {
    console.error('Error fetching extensions:', error);
    return undefined;
  }
}

export async function addNewModule(temp:ExtensionInput):Promise<boolean> {
  try {
    return true;
  } catch (error) {
    return false; 
  }
}

export async function getAiModelByname(aiModelName:string){
  try {
    const [rows] = await pool.query(`SELECT * FROM models WHERE NAME == "${aiModelName}"`);
    return <Aimodel[]>rows;
  } catch (error) {
    console.error('Error fetching extensions:', error);
    return undefined;
  }
}