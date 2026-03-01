import express,  { type Request, type Response } from 'express';
import server from './server.ts'
import { initDb, getDb } from "../database/config/db.ts";

const app = server;
const port = 3000;



app.listen(port, async () => {
  try {
     const sequelize = await initDb();
    
    // Теперь можно использовать модели

    
    // или через getDb()

  } catch (error) {
    
  }
});