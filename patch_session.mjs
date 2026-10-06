import fs from 'fs';
let content = fs.readFileSync('server/app.js', 'utf8');

const oldSession = `  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-do-not-use-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    }
  }));`;

const newSession = `  app.set('trust proxy', 1);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-do-not-use-in-prod',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kitverse' }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    }
  }));`;

if (content.includes("app.use(session({")) && !content.includes("MongoStore.create")) {
  content = content.replace(oldSession, newSession);
  fs.writeFileSync('server/app.js', content);
  console.log('Fixed session store & proxy config');
}
