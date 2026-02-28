import express,  { type Request, type Response } from 'express';
import server from './server.ts'

const app = server;
const port = 3000;



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});