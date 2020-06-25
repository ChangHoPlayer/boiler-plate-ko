const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name:{
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

//모델만들기
const user = mongoose.model("User",userSchema);

module.exports = {user} //모델을 다른곳에서도 쓸수있게 해주자.