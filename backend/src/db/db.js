import mongoose from 'mongoose';
import debug from 'debug';
const log = debug('current:db');
import config from '../config'

export function init() {
  const hostname = config.db.hostname;
  const port = config.db.port;
  const dbName = config.db.name;
  const username = config.db.username;
  const password = config.db.password;

  if(!hostname || !port) {
    throw new Error("Missing MongoDB environment variables");
  }
  log(`Connecting to DB: mongodb://${hostname}:${port}/${dbName}`)

  mongoose.set('useFindAndModify', false);


  try {
    mongoose.connect(`mongodb://${hostname}:${port}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: username,
      pass: password,
      "auth": {
        "authSource": "admin"
      },
    })
    .catch(e => {
      console.error(e);
      process.exit(1)  
    })
    
    ;
  } catch (e) {
    console.error(e);
    process.exit(1)  
  }

  const db = mongoose.connection;

  db.on('error', (e) => {
    console.error(e);
    log("DB Error");
    log(e);
  })

  db.once('open', () => {
    log("db connection established")
  })
}

export default {
  init
}