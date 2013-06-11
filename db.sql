/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     01.02.2013 7:05:21                           */
/*==============================================================*/

drop table if exists answers;

drop table if exists questions;

drop table if exists quizes;

drop table if exists answerhistory;

drop table if exists users;

drop table if exists historysessions;

drop table if exists quizresults;

drop table if exists answerresults;

drop table if exists questionresults;

/*==============================================================*/
/* Table: answers                                               */
/*==============================================================*/
create table answers
(
   id                   integer not null AUTO_INCREMENT,
   questionid           integer,
   atext                text,
   correct              text not null,
   primary key (id)
);

/*==============================================================*/
/* Table: questions                                             */
/*==============================================================*/
create table questions
(
   id                   integer not null AUTO_INCREMENT,
   quizid               integer,
   userid               integer,
   nextquestionid       integer,
   qtext                text,
   type                 integer,
   lattitude            text not null,
   longitude            text not null,
   primary key (id)
);

/*==============================================================*/
/* Table: quizes                                                */
/*==============================================================*/
create table quizes
(
   id                   integer not null AUTO_INCREMENT,
   title                text,
   description          text,
   userid               integer not null,
   primary key (id)
);


/*==============================================================*/
/* Table: quizes                                                */
/*==============================================================*/
create table answerhistory
(
   id                   integer not null AUTO_INCREMENT,
   historysessionid     integer not null,
   questionid           integer not null,
   answerid             integer not null,
   value                text not null,
   primary key (id)
);


/*==============================================================*/
/* Table: historysessions                                                */
/*==============================================================*/
create table historysessions
(
   id                   integer not null AUTO_INCREMENT,
   userid               integer not null,
   starttime            timestamp not null,
   endtime              timestamp NULL,
   primary key (id)
);


/*==============================================================*/
/* Table: users                                                */
/*==============================================================*/
create table users
(
   id                   integer not null AUTO_INCREMENT,
   username             text    not null,
   email                text    not null,
   password             text    not null,
   primary key (id)
);


/*==============================================================*/
/* Table: quizresults                                               */
/*==============================================================*/
create table quizresults
(
   sessionid            integer not null AUTO_INCREMENT,
   quizid               integer,
   correctqnum          integer,
   qnum                 integer,
   primary key (sessionid)
);


/*==============================================================*/
/* Table: questionresults                                               */
/*==============================================================*/
create table questionresults
(
   sessionid            integer,
   questionid           integer,
   correct              integer default 0,
   primary key (sessionid, questionid)
);

/*==============================================================*/
/* Table: answerresults                                               */
/*==============================================================*/
create table answerresults
(
   sessionid            integer,
   answerid             integer,
   value                text,
   primary key (sessionid, answerid)
);