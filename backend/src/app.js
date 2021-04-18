import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'
import logger from 'morgan';
import routes from './routes';
import db from "./db/db"

var app = express();

db.init();

app.disable('x-powered-by');  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), '/public')));

app.use('/posts', routes.posts);
app.use('/users', routes.users);
app.use('/auth', routes.auth);

export default app;