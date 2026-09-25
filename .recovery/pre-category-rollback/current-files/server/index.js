import mongoose from 'mongoose';
import {createApp} from './app.js';
const uri=process.env.MONGODB_URI;
if(uri){try{await mongoose.connect(uri,{serverSelectionTimeoutMS:8000});console.log('MongoDB connected');}catch{console.error('MongoDB connection failed. Check MONGODB_URI and database access.');process.exit(1)}}
const app=createApp({hasDatabase:Boolean(uri),databaseReady:()=>mongoose.connection.readyState===1});
const host=process.env.HOST||'127.0.0.1';
const server=app.listen(Number(process.env.PORT)||4000,host,()=>console.log(`Kitverse API: http://${host}:${Number(process.env.PORT)||4000} (${uri?'MongoDB':'sample catalogue'})`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await mongoose.disconnect();process.exit(0)}));
