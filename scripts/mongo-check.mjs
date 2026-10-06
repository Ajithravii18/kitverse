import {spawn} from 'node:child_process';
import {mkdtemp,mkdir} from 'node:fs/promises';
import {createServer} from 'node:net';
import mongoose from 'mongoose';
import {resolve} from 'node:path';

const binary=process.env.MONGOD_BINARY;
if(!binary)throw new Error('Set MONGOD_BINARY to an installed mongod executable. This check starts a separate temporary replica set.');
await mkdir('artifacts',{recursive:true});
const directory=await mkdtemp(resolve('artifacts','mongo-audit-'));
const socket=createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
const child=spawn(binary,['--dbpath',directory,'--port',String(port),'--bind_ip','127.0.0.1','--replSet','kitverseAudit','--noauth'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
let logs='';child.stdout.on('data',s=>{logs=(logs+s).slice(-6000);});child.stderr.on('data',s=>{logs=(logs+s).slice(-6000);});
let connection;
try{
 for(let i=0;i<80;i++){
  try{connection=new mongoose.mongo.MongoClient(`mongodb://127.0.0.1:${port}/?directConnection=true`,{serverSelectionTimeoutMS:500});await connection.connect();break;}
  catch{await connection?.close();connection=null;await new Promise(r=>setTimeout(r,250));}
 }
 if(!connection)throw new Error('Temporary MongoDB failed to start: '+logs);
 await connection.db('admin').command({replSetInitiate:{_id:'kitverseAudit',members:[{_id:0,host:`127.0.0.1:${port}`}]}});
 for(let i=0;i<80;i++){if((await connection.db('admin').command({hello:1})).isWritablePrimary)break;await new Promise(r=>setTimeout(r,250));}
 const tests=spawn(process.execPath,['--test','server/order-integration.test.js'],{windowsHide:true,stdio:'inherit',env:{...process.env,NODE_ENV:'test',TEST_MONGODB_URI:`mongodb://127.0.0.1:${port}/kitverse_audit?replicaSet=kitverseAudit`}});
 process.exitCode=await new Promise((r,reject)=>{tests.on('error',reject);tests.on('exit',code=>r(code??1));});
}finally{
 if(connection){try{await connection.db('admin').command({shutdown:1,force:true});}catch{}await connection.close();}
 child.kill();
}
