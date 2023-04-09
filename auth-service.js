
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    loginHistory: [
      {
        dateTime: {
          type: Date,
          default: Date.now
        },
        userAgent: {
          type: String,
          required: true
        }
      }
    ]
  });
  

let User;

// create a new company


module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    const db = mongoose.createConnection("mongodb+srv://kkc0252:Kranti99@senecaweb.cydsxbt.mongodb.net/web322?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});
    db.on('error', (err) => {
        console.log("fail");
      reject(err);
    });

    db.once('open', () => {
        console.log("pass");
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function(userData) {
  return new Promise((resolve, reject) => {
    // Check if passwords match
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    // Encrypt user password
    bcrypt.hash(userData.password, 10)
      .then((hash) => {
        // Replace plain text password with hash
        userData.password = hash;
        // Create new User from userData
        let newUser = new User(userData);

        // Save new User to database
        newUser.save()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            // Check for duplicate user name error
            if (err.code === 11000) {
              reject("User Name already taken");
            } else {
              reject(`There was an error creating the user: ${err}`);
            }
          });
      })
      .catch((err) => {
        reject("There was an error encrypting the password");
      });
  });
};

  
  


  module.exports.checkUser = function(userData) {
    return new Promise((resolve, reject) => {
      User.find({ userName: userData.userName })
        .then((users) => {
          if (users.length === 0) {
            reject(`Unable to find user: ${userData.userName}`);
            return;
          }
  
          const user = users[0];
  
          bcrypt.compare(userData.password, user.password)
            .then((passwordMatch) => {
              if (!passwordMatch) {
                reject(`Incorrect Password for user: ${userData.userName}`);
                return;
              }
  
              user.loginHistory.push({
                dateTime: (new Date()).toString(),
                userAgent: userData.userAgent
              });
  
              User.updateOne({ userName: user.userName }, { $set: { loginHistory: user.loginHistory } })
                .then(() => {
                  resolve(user);
                })
                .catch((err) => {
                  reject(`There was an error verifying the user: ${err}`);
                });
            })
            .catch((err) => {
              reject(`There was an error verifying the user: ${err}`);
            });
        })
        .catch((err) => {
          reject(`Unable to find user: ${userData.userName}`);
        });
    });
  }
  
  
  

  