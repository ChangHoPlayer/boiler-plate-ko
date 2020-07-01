const {User} = require("../models/User");
const jwt = require("jsonwebtoken");
let auth = (req, res, next) => {

    //클라이언트 쿠키에서 토큰을 가져옴
    //토큰을 복호화한후, 데이터베이스에서 해당 유저를 찾는다.
    //유저가 있으면 인증 오케이
    //유저가 없으면 인증 x

    let token = req.cookies.x_auth;

    jwt.verify(token,"secretToken",function(err,decoded){
        if(err) throw err;
        User.findOne({_id:decoded,token:token},function(err,user){
            if(err) return res.json({success:false,err});
            if(!user) return res.json({success:false, error:true});

            req.token = token;
            req.user = user;
            next();
        })
    });


}

module.exports = {auth};