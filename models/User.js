
const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      crypto = require('crypto'),
      jwt = require('jsonwebtoken'),
      secret = require('../config').secret,
      bcrypt = require('bcrypt-nodejs'),
      Schema = mongoose.Schema;
      


// Create UserSchema
const UserSchema = new Schema({

  username: {type: String, lowercase: true, unique: true, required: [true, "لطفا پر کنید"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], trim: true, index: true},

  email: {type: String, lowercase: true, unique: true, required: [true, "لطفا پر کنید"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true, trim: true},

  password: String,

  profile:{
    name: {
        type: String,
         default: '',
         trim: true,
        },

    image: String,

    bio: String,

    address: String,

    phone: String,

    mobile: String,

    favorites: [{ 
        type: Schema.Types.ObjectId,
         ref: 'Article'
         }],

         shares: [{ 
          type: Schema.Types.ObjectId,
           ref: 'User'
           }],

           likes: [{ 
            type: Schema.Types.ObjectId,
             ref: 'Product'
             }],

    following: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
  },

history: [{
    date: Date,
    paid:{ 
        type: Number, 
        default: 0
    },
    item:{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product'
    }
}],

  hash: String,

  salt: String,

  passwordResetToken: String,
  
  passwordResetExpires: Date,

}, {timestamps: true});


// Mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema.
UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});


//  Hash the password before we even save it to the database
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, console.log('Hashing is under processing ...'), function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// compare password in the database and the one that the user type in
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = size => {
if(this.size) size = 200;
if(!this.email) return 'https://gravatar.com/avatar/?s' +size+'$d=retro';
let md5 = crypto.createHash('md5').update(this.email).digest('hex');
return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro'
}

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};

UserSchema.methods.toProfileJSONFor = function(user){
  return {
    username: this.username,
    bio: this.bio,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    following: user ? user.isFollowing(this._id) : false
  };
};

UserSchema.methods.favorite = function(id){
  if(this.favorites.indexOf(id) === -1){
    this.favorites.push(id);
  }
  return this.save();
};

UserSchema.methods.unfavorite = function(id){
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function(id){
  return this.favorites.some(function(favoriteId){
    return favoriteId.toString() === id.toString();
  });
};

UserSchema.methods.follow = function(id){
  if(this.following.indexOf(id) === -1){
    this.following.push(id);
  }
  return this.save();
};

UserSchema.methods.unfollow = function(id){
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function(id){
  return this.following.some(function(followId){
    return followId.toString() === id.toString();
  });
};

module.exports =  mongoose.model('User', UserSchema);

