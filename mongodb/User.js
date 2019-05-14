let {
    mongoose
} = require('./mongodb-connect')

let userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token: {
        type: String,
        required: true
    },
    acceso: {
        type: String,
        enum: ["guest", "registrado", "admin"],
        required: true,
    }
});

userSchema.methods.generateToken = function () {
    let user = this;
    let token = jwt.sign({
            _id: user._id.toHexString(),
            acceso: user.acceso
        },
        'claveSecreta', {
            expiresIn: 60 * 60  // 60 segundos * 60
        }).toString();
    return token;
}

userSchema.statics.validarUsuario =  function (email, password) {
    
    return new Promise((resolve, reject) => {
        User.findOne({
            email, password
        }).then((user) => {
            if (user) {
                let newToken = user.generateToken();
                User.updateOne({email:email},{token:newToken}).then((doc)=>{
                    resolve(newToken)
                }).catch((er)=>{
                    console.log(er);
                    reject({error:"error al actualizar"});
                })
            } else {
                reject({error:"no existe email"})
            }
        }).catch((err) => {
            reject({error:"no se encontró"})
        })
    })



}


let User = mongoose.model('users', userSchema);

// let newUser = new User({email: "testg2@test", password:"123456", token:"123", acceso: "admin" });
// newUser.save().then((doc)=>{
//     console.log(doc);
// }).catch((err)=>{
//     console.log(err);
// })

module.exports = {
    User
}