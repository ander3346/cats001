var express = require('express');
var app = express();
var fs = require("fs");
const cors=require("cors")
const db=require("./configDb.js")
var bodyParser = require('body-parser');
var multer  = require('multer');//上传文件模块
 app.use(bodyParser.urlencoded({
     extended:true
 }))
 app.use(bodyParser.json())
 app.use(cors())
app.use(express.static('views'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/views/" + "MyWeb.html" );
});
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/views/'}).array('image'));
 
app.get('/register.html', function (req, res) {
   res.sendFile( __dirname + "/views/" + "register.html" );
})
 
app.post('/register', function (req, res) {
 
   //检查用户名是否已经存在
   const name=req.body.name;
    console.log(name)
    const pwd=req.body.pwd;
    console.log(pwd)
    const email=req.body.email;
    console.log(email)
    let sql="select * from user where name=?"
    let sqlArr=[name];
     let callBack=(err,data1)=>{
            if(err){
                console.log(err)
                return;
            }
            console.log("wishing数据",data1)
            if (data1.length>=1){//测试查找的数据的长度，如果大于0就代表数据库中存在这个用户
                res.send({
                    code:400,
                    msg:"该用户已存在",
                    affectedRows:data1.affectedRows
                })
                return;
            }else{//新的用户名，可以注册
                //上传文件处理
                console.log(req.files[0]);  // 上传的文件信息 
                var des_file = __dirname + "/views/img/" + req.files[0].originalname;//绝对路径目标文件名，可以加时间戳防止文件名重名
                var des_file1 = "img/" + req.files[0].originalname;//相对路径文件名，保存到数据库中
                fs.readFile( req.files[0].path, function (err, data) {//从request对象读出文件
                       fs.writeFile(des_file, data, function (err) {//将读出的文件写到目标文件
                           if( err ){
                              console.log( err );
                             }else{
                                 response = {
                                  message:'File uploaded successfully', 
                                   filename:des_file
                               };
                         }
                     console.log( response );
                    // res.end( JSON.stringify( response ) );
                    });
                 });

                //注册用户信息保存到数据库，注册ip地址
                let sql ="insert into user set name=?,pwd=?,email=?,headpic=?,regdate=?,regtime=?,state=1";
                let headpic=des_file1;//头像保存头像文件的相对路径文件名
                let now = new Date();
                let regdate=now.toLocaleDateString();
                let regtime=now.toLocaleTimeString();
                let sqlArr=[name,pwd,email,headpic,regdate,regtime];
                let callBack=(err,data)=>{
                    if(err){
                        console.log(err)
                        return;
                    }
                  //  res.send({
                    //      code:200,       
                 //         msg:"注册成功",          
                   //       affectedRows:data.affectedRows  });
                    res.sendFile( __dirname + "/views/" + "login.html" );//注册成功，发送登录页面
                    //console.log(data)

                    return;
                }
                db.dbConn(sql,sqlArr,callBack);
            }
        }
    db.dbConn(sql,sqlArr,callBack);
})


app.get("/",(req,res)=>{
    console.log("hello!")
     res.send({
            msg:"欢迎来到本网站",
            code:200
        })
})
app.post("/login1",(req,res)=>{
    console.log("服务端",req.body)
    const {name,pwd}=req.body;
    let sql=`select * from user where name=? and pwd=?`
    console.log("sql",sql)
    let sqlObj=[name,pwd]
    console.log("sqlObj",sqlObj)
    let callBack=function(err,data){
        console.log("data:",data)
        if(err){
            console.log("失败")
            return
        }
        if(data.length!=1){
        console.log("密码或用户名出错")
        res.send({
            msg:"用户名或密码出错",
            code:400,
           
        })
        return
        }
      
        res.send({
            msg:"成功登录",
            code:200,
            name:data[0].name,
            headpic:data[0].headpic,
           
        })
    }
    db.dbConn(sql,sqlObj,callBack)
    
})
 
var server = app.listen(3000, function () {
 
  var host = "127.0.0.1";
  var port = 3000;
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
 
})