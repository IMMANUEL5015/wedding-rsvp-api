import {config} from 'dotenv'
import dns from 'node:dns';
import http from 'http';

config();
dns.setServers(['8.8.8.8', '1.1.1.1']); 

import mongoose from 'mongoose';

const databaseURI = process.env.DATABASE_URI || '';
const PORT: number = Number(process.env.PORT) || 3000;

const connectToDatabase = async (server: http.Server) => {
    try {
        await mongoose.connect(databaseURI);
        console.log("Connected to database successfully");
        
        server.listen(PORT, (): void => {
        console.log(`Listening on port ${PORT}`);
    });
    } catch (error) {
        console.log(error);
    }
}

export default connectToDatabase;