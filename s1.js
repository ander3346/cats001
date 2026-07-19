var express = require('express');
var app = express();
var fs = require("fs");
const cors=require("cors")
const db=require("./configDb.js")//数据库对象
var bodyParser = require('body-parser');
var multer  = require('multer');//上传文件模块
const { userInfo } = require('os');
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
 


//注册用户信息
app.post('/register', function (req, res) {
 
   //检查用户名是否已经存在
    const name=req.body.name;//request请求对象包含了表单数据
    console.log(name)
    let pwd=req.body.pwd;
    console.log(pwd)
    const email=req.body.email;
    console.log(email)
    //let regIP = req.connection.remoteAddress;
     let regIP = req.socket.remoteAddress;
     console.log(regIP)
   
    let sql="select * from user where name=?"
    let sqlArr=[name];
    let callBack=(err,data1)=>{//执行查询用户是否存在的回调函数
            if(err){
                console.log(err);//查找失败
                return;
            }
            console.log("wishing数据",data1);//查找成功，结果数据集在data1
            if (data1.length>=1){//测试查找的数据的长度，如果大于0就代表数据库中存在这个用户
                res.send({
                    code:400,
                    msg:"该用户已存在",
                    affectedRows:data1.affectedRows
                })
                return;
            }else{//新的用户名，可以注册
                //上传文件处理
                console.log(req.files[0]);  // 上传的文件信息，第一个图片文件 
                var randomstr=Date.now() + '-' + Math.round(Math.random() * 1E9);;//产生随机字符串，加到文件名中，防止文件名重复 const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // 生成随机文件名
                var des_file = __dirname + "/views/images/" +randomstr+ req.files[0].originalname;//绝对路径目标文件名，可以加时间戳防止文件名重名
                var des_file1 = "images/" +randomstr+req.files[0].originalname;//相对路径文件名，保存到数据库中，用于前端页面显示图像
                fs.readFile( req.files[0].path, function (err, data) {//从request对象读出文件
                       fs.writeFile(des_file, data, function (err) {//将读出的文件在data中写到目标文件
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
                let sql ="insert into user set name=?,pwd=?,email=?,headpic=?,regdate=?,regtime=?,regIP=?,state=1";
                let headpic=des_file1;//头像保存头像文件的相对路径文件名
                let now = new Date();
                let regdate=now.toLocaleDateString();
                let regtime=now.toLocaleTimeString();
                //明文密码hash处理
                // Includes crypto module
                  const crypto = require('crypto');
               // Defining key
               const secret = 'qxf007';
                  // Calling createHmac method
               pwd = crypto.createHmac('sha256', secret)
					.update(pwd)  // updating data
                    .digest('hex');           // Encoding to be used
                let sqlArr=[name,pwd,email,headpic,regdate,regtime,regIP];
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
                db.dbConn(sql,sqlArr,callBack);//插入一条新用户数据
            }
        }
    db.dbConn(sql,sqlArr,callBack);//查询用户名是否已经存在
})


app.get("/",(req,res)=>{
    console.log("hello!")
     res.send({
            msg:"欢迎来到本网站",
            code:200
        })
})

//轮播图查找
app.get("/getslidepic",function (request, response) 
  {

      //明文密码hash生成，可以删除，单纯是为了生成一个hash密码
                // Includes crypto module
                 // const crypto = require('crypto');
               // Defining key
              // const secret = 'qxf001';
                  // Calling createHmac method
             // var pwd = crypto.createHmac('sha256', secret)
					           //      .update("123")  // updating data
                    //  .digest('hex');           // Encoding to be used
             // console.log("密码123hash=",pwd);
    let sql="select * from slidepic where state=?";
    let mydata = [];
    let state=1;
    let sqlArr=[state];
    db.dbConn(sql,sqlArr,(err,rows)=>{
        if(err){
            response.json({err:"chucuole"})
             }
        else{
            console.table(rows);
            for(let em of rows)
            {
                //console.log(em);
                let record = [em['picname']];
              
                mydata.push(record);
            }
            console.log(mydata);
            response.writeHead(200, {
                       "Content-Type": "application/json"
                  });
            response.write(JSON.stringify(mydata));
            response.end();
        };
      });
    }
  );

//生成token预备
const jwt = require('jsonwebtoken');
const secretKey = 'qxf007'; 

  //用户登录信息查找
app.post("/login1",(req,res)=>{
    console.log("服务端",req.body)
    let {name,pwd}=req.body;
      //明文密码hash处理
                // Includes crypto module
                  const crypto = require('crypto');
               // Defining key
               const secret = 'qxf007';
                  // Calling createHmac method
                pwd = crypto.createHmac('sha256', secret)
					.update(pwd)  // updating data
                    .digest('hex');           // Encoding to be used
    let sql=`select * from user where name=? and pwd=?`
    console.log("sql",sql)
    let sqlObj=[name,pwd]
    console.log("sqlObj",sqlObj)
    let callBack=function(err,data){
        console.log("data:",data);//查找用户执行成功返回数据集data
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
      
        var userInfo = { name:data[0].name, headpic:data[0].headpic };
        var  token = jwt.sign(userInfo, secretKey, { algorithm: 'HS256' });
        //利用用户名和用户头像名生成token
        res.send({//response对象,token返回给前端
            msg:"成功登录",
            code:200,
           // name:data[0].name,
           // headpic:data[0].headpic,
            token:token
        })
    }
    db.dbConn(sql,sqlObj,callBack);//执行查找用户
    
})

 //管理员登录信息查找
app.post("/adminlogin",(req,res)=>{
    console.log("服务端",req.body)
    let {name,pwd}=req.body;
      //明文密码hash处理
                // Includes crypto module
                  const crypto = require('crypto');
               // Defining key
               const secret = 'qxf001';
                  // Calling createHmac method
                pwd = crypto.createHmac('sha256', secret)
					.update(pwd)  // updating data
                    .digest('hex');           // Encoding to be used
    let sql=`select * from admininfo where name=? and pwd=?`
    console.log("sql",sql)
    let sqlObj=[name,pwd]
    console.log("sqlObj",sqlObj)
    let callBack=function(err,data){
        console.log("data:",data);//查找用户执行成功返回数据集data
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
      
        var adminInfo = { name:data[0].name, headpic:data[0].headpic };
        var  admintoken = jwt.sign(adminInfo, secretKey, { algorithm: 'HS256' });
        //利用用户名和用户头像名生成token
        res.send({//response对象,token返回给前端
            msg:"成功登录",
            code:200,
            admintoken:admintoken
        })
    }
    db.dbConn(sql,sqlObj,callBack);//执行查找用户
    
})

//管理员密码修改
app.post("/modifyadminpwd",(req,res)=>{
    console.log("服务端",req.body)
    let {name,pwd,pwd1}=req.body;
      //明文密码hash处理
      // Includes crypto module
       const crypto = require('crypto');
      // Defining key
      const secret = 'qxf001';
                  // Calling createHmac method
      pwd = crypto.createHmac('sha256', secret)
					.update(pwd)  // updating data
                    .digest('hex');           // Encoding to be used
      pwd1 = crypto.createHmac('sha256', secret)
					.update(pwd1)  // updating data
                    .digest('hex');           // Encoding to be used
    let sql=`select * from admininfo where name=? and pwd=?`;
    console.log("sql",sql);
    let sqlObj=[name,pwd];
    console.log("sqlObj",sqlObj);
    let callBack=function(err,data){
        console.log("data:",data);//查找用户执行成功返回数据集data
        if(err){
            console.log("管理员用户查找失败")
            return
        }
        if(data.length!=1){
          console.log("原密码出错")
           res.send({
            msg:"原密码出错",
            code:400,           
          })
        return;
        }
      
       //原始密码验证正确，用新密码修改
        let sql=`update admininfo set pwd=? where name=?`;
        console.log("sql",sql);

        let sqlObj=[pwd1,name];//注意参数次序
        console.log("sqlObj",sqlObj);
        let callBack=function(err,data){
            console.log("data:",data);//修改密码执行成功返回数据集data
            if(err)
            {
               console.log("管理员密码修改失败",err);
                res.send({
                      msg:"管理员密码修改失败",
                      code:400,           
                });                
            }
            else
            {
              console.log("管理员密码修改成功");
                res.send({
                      msg:"管理员密码修改成功",
                      code:200,           
                });
            }
             
         }
        

        db.dbConn(sql,sqlObj,callBack);//执行查找用户
    };
    db.dbConn(sql,sqlObj,callBack);//执行查找用户    
})

//管理员头像修改
app.post("/modifyadminheadpic",(req,res)=>{
    console.log("服务端",req.body);
     //上传文件处理
    console.log(req.files[0]);  // 上传的文件信息，第一个图片文件 
    var randomstr=Date.now() + '-' + Math.round(Math.random() * 1E9);;//产生随机字符串，加到文件名中，防止文件名重复 const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // 生成随机文件名
    var des_file = __dirname + "/views/images/" +randomstr+ req.files[0].originalname;//绝对路径目标文件名，可以加时间戳防止文件名重名
    var des_file1 = "../images/" +randomstr+req.files[0].originalname;//相对路径文件名，保存到数据库中，用于前端页面显示图像
    fs.readFile( req.files[0].path, function (err, data) {//从request对象读出文件
                       fs.writeFile(des_file, data, function (err) {//将读出的文件在data中写到目标文件
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
     name1=req.body.name;
     let sql=`update admininfo set headpic=? where name=?`;
        console.log("sql",sql);

      let sqlObj=[des_file1,name1];//注意参数次序
        console.log("sqlObj",sqlObj);
      let callBack=function(err,data){
            console.log("data:",data);//修改密码执行成功返回数据集data
            if(err)
            {
               console.log("管理员头像修改失败",err);
                res.send({
                      msg:"管理员头像修改失败",
                      code:400,           
                });                
            }
            else
            {
              console.log("管理员头像修改成功");
              res.sendFile( __dirname + "/views/admin/" + "admin.html" );//注册成功，发送登录页面
               // res.send({
                 //     msg:"管理员头像修改成功",
                  //    name:name1,
                  //    headpic:des_file1,
                    //  code:200,           
               // });
            }             
         }        

        db.dbConn(sql,sqlObj,callBack);//执行查找用户


});


//校验token 用户是否登录
app.post("/verify",(req,res)=>{
    console.log("服务端",req.body)
    let {token}=req.body;//收到前端发来的token
     
   
       //校验token
      // const jwt = require('jsonwebtoken');
      // const secretKey = 'qxf007';

        try {
           const decoded = jwt.verify(token, secretKey);//验证token,并解码token中的用户名和头像名
            console.log('登录Token校验成功', decoded);
            res.send({//response对象,解码token中的用户名和头像名返回给前端
                 msg:"登录校验成功",
                 code:200,
                 name:decoded.name,//解码后的用户名
                 headpic:decoded.headpic,  //解码后的用户头像名        
               })
           } catch (err) {
                 console.log('登录Token校验失败', err);
                  res.send({
                       msg:"登录Token校验失败",
                       code:400,
           
                    })
                    return
            }
      
       
})

//校验admintoken 管理员是否登录
app.post("/adminverify",(req,res)=>{
    console.log("服务端",req.body)
    let {admintoken}=req.body;//收到前端发来的token
     
   
       //校验token
      // const jwt = require('jsonwebtoken');
      // const secretKey = 'qxf001';

        try {
           const decoded = jwt.verify(admintoken, secretKey);//验证token,并解码token中的用户名和头像名
            console.log('登录Token校验成功', decoded);
            res.send({//response对象,解码token中的用户名和头像名返回给前端
                 msg:"登录校验成功",
                 code:200,
                 name:decoded.name,//解码后的用户名
                 headpic:decoded.headpic,  //解码后的用户头像名        
               })
           } catch (err) {
                 console.log('登录Token校验失败', err);
                  res.send({
                       msg:"登录Token校验失败",
                       code:400,
           
                    })
                    return
            }
      
       
})


//管理员登录信息查找
app.post("/adminsearch",(req,res)=>{
    console.log("服务端",req.body)
    let {name}=req.body;
      
    let sql=`select * from admininfo where name=? `
    console.log("sql",sql)
    let sqlObj=[name]
    console.log("sqlObj",sqlObj)
    let callBack=function(err,data){
        console.log("data:",data);//查找用户执行成功返回数据集data
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
      
        var admininfo = { uid:data[0].uid,name:data[0].name, headpic:data[0].headpic,email:data[0].email,phone:data[0].phone, regdate:data[0].regdate, regtime:data[0].regtime, regip:data[0].regip};
        //利用用户名和用户头像名生成token
        res.send({//response对象,token返回给前端
            msg:"成功登录",
            code:200,
            admininfo:admininfo
        })
    }
    db.dbConn(sql,sqlObj,callBack);//执行查找用户
    
})
 
//新闻信息查找，教育咨询
app.get("/getnews",function (request, response) 
  {
    let sql="select newsid,newstitle from news where state=?";
    let mydata = [];
    let state=1;
    let sqlArr=[state];
    db.dbConn(sql,sqlArr,(err,rows)=>{
        if(err){
            response.json({err:"chucuole"})
             }
        else{
            console.table(rows);
            for(let em of rows)
            {
                //console.log(em);
                let record = [em['newstitle']];//只返回新闻标题              
                mydata.push(record);
            }
            console.log(mydata);
            response.writeHead(200, {
                       "Content-Type": "application/json"
                  });
            response.write(JSON.stringify(mydata));
            response.end();
        };
      });
    }
  );




var server = app.listen(3000, function () {
 
  var host = "127.0.0.1";
  var port = 3000;
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
 
})