import cors from 'cors';
import express from 'express';
const server = express();

// Configuring NodeJS Server Functionality
server.use(cors());
server.use(express.json());

export default server