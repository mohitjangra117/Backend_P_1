use delta;

-- show tables;


-- creating user table 

create table user(

id varchar(20) primary key,
username varchar(30) unique,
email varchar(40) unique not null,
password varchar(20) not null

);

desc user;
