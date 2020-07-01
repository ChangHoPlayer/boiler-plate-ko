const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength: 50
    },
    lastname:{
        type:String,
        maxlength: 50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    role:{ //역할을 의미함.
        type:Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp:{
        type:Number
    }
});
//스케마는 데이터의 형태를 잡아주는거다.

// 해당 메소드를 실행하기전 뭔가를 해주겠다는 의미.
userSchema.pre('save',function(next){
    var user = this; //ㄷㄷㄷ //데이터를 관리하고있는 유저모델 가져옴
    //비밀번호를 암호화 시킨다.

    //패스워드가 변경됐을때.
    if(user.isModified("password")){
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err){
                return next(err);
            }
            bcrypt.hash(user.password,salt,function(err,hash){
                //hash값이 암호화된비밀번호임.
                if(err){
                    return next(err);
                }
                user.password = hash; //
                next();
            })
        })
    }else{
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);

    })

}

userSchema.methods.generateToken = function(cb){
    //jsonwebtoken을 이용해서 토큰을 생성하기.
    var user = this;


    var token = jwt.sign(user._id.toHexString(), "secretToken");

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
    //토큰을 만들어줌.
    //해당토큰을 가지고 유저를 식별할 수 있음.

}

// userSchema.statics.findByToken = function(token,cb){
    
//     //토큰을 디코드한다.
//     jwt.verify(token,"secretToken",function(err,decoded){
//         user.findOne({"_Id":decoded, "token":token},function(err,user){
//             if(err) return cb(err);
//             cb(null,user);
//         })
//     })
// }

//모델만들기
const User = mongoose.model("User",userSchema);



module.exports = {User} //모델을 다른곳에서도 쓸수있게 해주자.