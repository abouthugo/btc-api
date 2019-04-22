import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
 username: {type: String, required: true, index: {unique: true}},
 password: {type: String, required: true} 
});

UserSchema.pre('save', hashPassword);
UserSchema.methods.comparePassword = comparePassword;

/**
 * Hashes a cleartext password with bcrypt
 * @param {Function} next A callback function to be executed after the password is hashed
 */
function hashPassword(next){
  let user = this;
  // only trigger when password is modified, or new account comes in
  if(!user.isModified('password')) return next();

  // Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) return next(err);

      // overwrite the clear text password
      user.password = hash;
      next();
    });
  })
}

/**
 * Checks if the password in the database matches with the password being passed in
 * @param {String} candidatePassword The password to check against 
 * @param {Function} cb A callback to execute after the comparison
 */
function comparePassword(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if(err) return cb(err);
    cb(null, isMatch);
  })
}

export {UserSchema}