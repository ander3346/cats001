const mysql=require("mysql")

module.exports={
    config:{
        host:"localhost",
        user:"root",
        password:"112033",
        database:"test"
    },
    dbConn:function(sql,sqlObj,callBack){
        let pool=mysql.createPool(this.config)
        pool.getConnection((err,conn)=>{
            if(err){
                console.log(err)
                return;
            }
            conn.query(sql,sqlObj,callBack)
            conn.release();
            
        })
    }
}