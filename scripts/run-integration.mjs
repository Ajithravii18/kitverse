import {MongoMemoryReplSet} from 'mongodb-memory-server';
import {spawn} from 'node:child_process';
import {readdirSync} from 'node:fs';
const replSet=await MongoMemoryReplSet.create({replSet:{count:1}});
try {
  for(const file of readdirSync('server').filter(f=>f.endsWith('.test.js'))) {
    const code=await new Promise((resolve,reject)=>{
      const child=spawn(process.execPath,['--test',`server/${file}`],{windowsHide:true,stdio:'inherit',env:{...process.env,NODE_ENV:'test',TEST_MONGODB_URI:replSet.getUri('kitverse_audit')}});
      child.on('error',reject);child.on('exit',resolve);
    });
    if(code!==0){process.exitCode=1;break;}
  }
}finally{await replSet.stop();}
