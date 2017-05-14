var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var UserSchema= new mongoose.Schema({ 	 
	email: {
        type: String,
        lowercase: true,  // why the hell lowercase is true here?
        unique: true,
        required: true
    },
    username:{
    	type:String,
    	unique:true,
    	required:true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['normal','admin'],
        default: 'normal'
    },
    reviews:[
    {
      description:String,
      rating:Number,
      route_name:String,    
      created_at:{type: Date, required: true, default: Date.now}
    }],
},{timestamps:true});

// hashing using pre hook .before save this one get called 
UserSchema.pre('save', function(next){
 
    var user = this;
    var SALT_FACTOR = 5;
 
    if(!user.isModified('password')){
        return next();
    } 
 
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
 
        if(err){
            return next(err);
        }
 
        bcrypt.hash(user.password, salt, null, function(err, hash){
 
            if(err){
                return next(err);
            }
 
            user.password = hash;
            next();
 
        });
 
    });
 
});
 
UserSchema.methods.comparePassword = function(passwordAttempt, cb){
 
    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){
 
        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
 
}
 
module.exports = mongoose.model('User', UserSchema);