//서버사이드의 시작점.

const express = require("express"); //모듈가지고옴
const app = express(); //모듈사용
const port = 3000;
const bodyParser = require("body-parser");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const {auth} = require("./middleware/auth");
const {User} = require("./models/User"); //유저모델가져오기

//application/x-www-form-urlencoded 형태로 되어있는 데이터를 분석할수있게해줌.
app.use(bodyParser.urlencoded({extended:true})); //bodyparser관련설정.

//application/json 형태로 되어있는 데이터를 분석할 수 있게해줌.
app.use(bodyParser.json());

app.use(cookieParser());
const mongoose = require("mongoose");
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log("MongoDB connected!!"))
.catch((err) => console.log(err)); //에러안뜨게끔 설정까지 마쳐주자.
//<password>부분에 내가 설정해놓은 비밀번호 입력해주면됨.

app.get("/", function(req,res){
    res.send("Hello World!!asdfasdfasdf");
});

app.post("/api/users/login",function(req,res){
    //요청된 이메일을 데이터베이스에서 찾아보자.
    //비밀번호까지 맞다면 토큰을 생성하기.

    User.findOne({
        email:req.body.email
    },(err,user) => { //여기서 user는 자료형이 UserSchema일거임.
        //있으면 user에 들옴
        if(!user){
            res.json({
                loginSuccess:false,
                message:"해당 이메일이 존재하지 않습니다."
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다"});
            }

            user.generateToken((err,user) => {
                if(err) return res.status(400).send(err);

                //쿠키에 토큰을 저장하자!
                res.cookie("x_auth",user.token)
                .status(200).json({loginSuccess:true,
                userId:user._id});
            })
        })



    })

})

app.post("/api/users/register",function(req,res){
    //회원가입정보들을 받아와서
    //데이터베이스에 넣어보자.
    const user = new User(req.body); //bodyparser써서 req.body쓸수있는거다 ㅋㅋ
    user.save((err,doc) => {
        if(err) return res.json({success:false, err}); //데이터베이스에 저장하는데 에러가나면 json형식으로 실패메세지를 보내고
        return res.status(200).json({ //성공하면 json형식으로 성공메세지를 보낸다.
            success:true
        });
    });
    
});

app.get("/api/users/auth",auth,function(req,res){
    
    //미들웨어란? 
    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.roll == 0 ? false : true,
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        image:req.user.image

    })

});

app.get("/api/users/logout",auth,function(req,res){
    User.findOneAndUpdate({_id:req.user._id},
        {token:""},
    (err,user) => {
        if(err) return res.json({success:false, err});
        return res.status(200).send({success:true})
    })
});


app.listen(port, () => console.log(`Example app listening on port ${port}`));