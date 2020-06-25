//서버사이드의 시작점.

const express = require("express"); //모듈가지고옴
const app = express(); //모듈사용
const port = 3000;

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://kimchangho:123@boilerplate-ugtai.mongodb.net/<dbname>?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log("MongoDB connected!!"))
.catch((err) => console.log(err)); //에러안뜨게끔 설정까지 마쳐주자.
//<password>부분에 내가 설정해놓은 비밀번호 입력해주면됨.

app.get("/", function(req,res){
    res.send("Hello World!!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));