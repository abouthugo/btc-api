import mongoose from 'mongoose';
import {UserSchema} from './User';

const {DB_HOST, DB_USER, DB_PASSWD} = process.env;
const url = `mongodb://${DB_USER}:${DB_PASSWD}@${DB_HOST}`;
mongoose.set('debug', true);

mongoose.connect(url, {useNewUrlParser: true});
const User = mongoose.model("User", UserSchema);

export {User};