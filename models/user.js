const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  password: {
    type: String,
    select: false
  },
  username: {
    type: String,
    required: true
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }]
});

// Before saving the user give them created at and updated at attributes
UserSchema.pre("save", function (next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  // ENCRYPT PASSWORD
  const user = this;
  if (!user.isModified("password")) { // If user is not modifing password send request
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => { // Ten rounds of salting
    bcrypt.hash(user.password, salt, (err, hash) => { // Hash user password with salt
      user.password = hash; // Update password attribute to be the hash password
      next(); // Continue
    });
  });
});

// Need to use function to enable this.password to work.
UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => { // Comapre hashed password to rehashed password to confirm
    done(err, isMatch);
  });
};
module.exports = mongoose.model("User", UserSchema);