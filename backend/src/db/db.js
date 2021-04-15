import mongoose from 'mongoose';
import debug from '../services/debug';

export function init() {
  const hostname = process.env.MONGO_HOSTNAME;
  const port = process.env.MONGO_PORT;
  const dbName = process.env.MONGO_DB_NAME;
  const username = process.env.MONGO_ADMIN_USERNAME;
  const password = process.env.MONGO_ADMIN_PASSWORD;

  if(!hostname || !port) {
    throw new Error("Missing MongoDB environment variables");
  }
  debug(`Connecting to DB: mongodb://${hostname}:${port}/${dbName}`)

  try {
    mongoose.connect(`mongodb://${hostname}:${port}/${dbName}`, {
      useNewUrlParser: true,
      autoIndex: false,
      useUnifiedTopology: true,
      user: username,
      pass: password,
      "auth": {
        "authSource": "admin"
      },
    });
  } catch (e) {
    console.error(e);
    process.exit(1)  
  }

  const db = mongoose.connection;

  db.on('error', (e) => {
    console.error(e);
    debug("DB Error");
    debug(e);
  })

  db.once('open', () => {
    debug("db connection established")
  })
}

export default {
  init
}