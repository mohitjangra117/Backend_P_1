   //   Faker -->  Give fake data for sql,etc 

//        npm i @faker-js/faker



//   Mysql2  Package for connection between server and the database


// const mysql = require('mysql2');
const express=require("express");
const mysql = require('mysql2');

const { faker } = require('@faker-js/faker');       //  faker require  

const app = express();

const path=require("path");

const methodOverride= require("method-override");

app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));        // To parse form data which come from edit form  

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname , "/views"));


          






// Create the connection to database
const connection =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password:'12345',
  port: 3308
});


// we have created database delta and we work in this database 
// let q="show tables";    // we can also  use q insted of writing "show tables" by storing it in q variable.






// Inserting Data using placeholders 

// ? will be replace with the values which we want to insert 




// let user=["123" , "123_user" , "123@gmail.com" , "123123" ];
// let q = "INSERT into user (id,username, email , password) values (? , ? , ? , ?)  "; 
// for this we use      connection.query(q, user , (err,result)=>{ 



// //Inserting Multiple values using nested array

// let q = "INSERT into user (id,username, email , password) values ?  ";    // only one  ?  is used for nedted array

// // connection.query(q, [user] , (err,result)=>{       // [users] - > users is written in [] for nested arrays

// let user=[["123B" , "123_userB" , "123@gmail.comB" , "123123B" ],["123C" , "123_userC" , "123@gmail.comC" , "123123C" ]];



// //  Inserting Data of 100 users using faker 


// let q = "INSERT into user (id,username, email , password) values ?  ";    // only one  ?  is used for nedted array



// let  randomUser=()=> {                    // create a random user 
//   return [
//      faker.string.uuid(),
//      faker.internet.username(), 
//     faker.internet.email(),
//      faker.internet.password(),
//   ];
// }


// let data=[];

// for(let i=0;i<100;i++){
  
//   data.push(randomUser());

// }



// // user is passed to replace placeholders in connecton.query
 
// try{                                                       //we can try catch for exception handling if sql command is wrong or database error
//     connection.query(q, [data] , (err,result)=>{                       // used to run sql queries   
//         if (err) throw err;
//         console.log(result);         //  The result will be an array , so we can also print the length of the array , ex
       
//     })
// }catch(err){
//     console.log(err);
// }

// connection.end();






      //  To connect to SQl use  either             // mysql -u root -p     or          mysql -u root -p --port=3308

      ////////////////////////////////////////                         // change default port 3306  to 3308

  //   After connection we can directly use sql commands in terminal   to exit  type exit  or quit






// Get request 

 
app.get("/",(req,res)=>{                       //   localhost:3030
   
//  showing no of users using sql query

let q=`select count(*) from user`;

try{                                                       
    connection.query(q , (err,result)=>{                     
        if (err) throw err;
        let count=result[0]["count(*)"];           // result of database query ,  shown on terminal  
      //  res.send(result);                    // response of get request           //////////   API      //  show on webpage   as   API  
                                     //  Both will be same but only difference is console.log(result) will show in terminal whereas the
                                   //     res.send(result);  will send it to webpage and show it as API 
            
      res.render("home.ejs",{count}); 
      
   })
}catch(err){                         
    console.log(err);
}

// connection.end();



         
});



// show users Route  


app.get("/users",(req,res)=>{
  let q=`select * from user`;

  try{                                                       
      connection.query(q , (err,result)=>{                     
          if (err) throw err;
         

       let users=(result);

        res.render("users.ejs",{users}); 
        
     })
  }catch(err){                         
      console.log(err);
  }
  
  // connection.end();


});






// Edit Route 


app.get("/user/:id/edit",(req,res)=>{

let {id}=req.params;
console.log(id);                         

let q=`select * from user where id="${id}"`;           // getting user data from database 
                                        // Add "" to id to make it string 
try{                                                       
  connection.query(q , (err,result)=>{                     
      if (err) throw err;
     let user=(result[0]);
    res.render("edit.ejs",{user}); 
 })
}catch(err){                         
  console.log(err);
}
// connection.end();


});







//  Update Route using PATCH request


app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formpass, username:newusername }=req.body;
console.log(id);                         

let q=`select * from user where id="${id}"`;           // getting user data from database 
                                        // Add "" to id to make it string 
try{                                                       
  connection.query(q , (err,result)=>{                     
      if (err) throw err;

     let user=(result[0]);
if(formpass!=user.password){
  res.send("Wrong password");
}
else{

  

  let q2=`update user set username="${newusername}" where id="${id}"`;               // Sql query to update the username

  try{                                                       
    connection.query(q2 , (err,result)=>{                     
        if (err) throw err;
      //  let user=(result[0]);
      res.redirect("/users"); 
   })
  }catch(err){                         
    console.log(err);
  }
  
}   //  else end 

   
 })
}catch(err){                         
  console.log(err);
}
// connection.end();

});




//    Create User Route


app.get("/users/new",(req,res)=>{
  res.render("create.ejs");
});



//  Create user Post Request


app.post("/user/add",(req,res)=>{
  let { username:newusername ,email:newemail, password:newpassword, }=req.body;
  let newid=faker.string.uuid();   // get userid from uuid
  console.log(newid,newemail,newusername,newpassword);         //  show data in terminal 
  let q3=`Insert into user(id,username,email,password) values(
  '${newid}','${newusername}','${newemail}','${newpassword}');`;

  try{                                                       
    connection.query(q3 , (err,result)=>{                     
        if (err) throw err;
       res.redirect("/users");
   })
  }catch(err){                         
    console.log(err);
  }

});




//  Delete user Route

app.delete("/user/:id",(req,res)=>{
   let {id}=req.params;                    //  get user id 
  //  console.log(id);
  // res.send("DEleteeeeeeeee");           // write deleteee on webpage

  let q4=`DELETE FROM user WHERE id ="${id}";`;

  try{                                                       
    connection.query(q4 , (err,result)=>{                     
        if (err) throw err;
       res.redirect("/users");
   })
  }catch(err){                         
    console.log(err);
  }
  

});





//    Starting server 

app.listen("3030",()=>{
  console.log("Server is running"); 

});











// console.log(randomUser());




///////////////////////////////////////      To run sql file type       source  filename.sql     in      mysql> 


      //  To connect to SQl use  either      // mysql -u root -p     or     mysql -u root -p --port=3308



