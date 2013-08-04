/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     01.02.2013 7:05:21                           */
/*==============================================================*/

drop table if exists answers;

drop table if exists questions;

drop table if exists questionrevisions;

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
  questionid           integer not null,
  revisionid          integer not null,
  correct              text not null,
  PRIMARY KEY (id)
);

/*==============================================================*/
/* Table: questions                                             */
/*==============================================================*/
create table questions
(
   id                   integer not null AUTO_INCREMENT,
   quizid               integer,
   revisionid           integer,
   userid               integer,
   active               integer default 0,
   PRIMARY KEY (id)
);

/*==============================================================*/
/* Table: questions                                             */
/*==============================================================*/
create table questionrevisions
(
   id                   integer not null AUTO_INCREMENT,
   questionid          integer not null,
   qtext               text,
   qtextcache          text,
   latitude            text not null,
   longitude           text not null,
   PRIMARY KEY (id)
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
   PRIMARY KEY (id)
);

/*==============================================================*/
/* Table: quizes                                                */
/*==============================================================*/
create table answerhistory
(
  id                   integer not null AUTO_INCREMENT,
  revisionid           integer,
  historysessionid     integer not null,
  questionid           integer not null,
  answerid             integer not null,
  value                text not null,
  PRIMARY KEY (id)
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
  PRIMARY KEY (id)
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
   trained              integer default 0,
   PRIMARY KEY (id)
);
insert into users values (1, 'Dmitriy', '1@gmail.com', '1234567');

/*==============================================================*/
/* Table: quizresults                                               */
/*==============================================================*/
create table quizresults
(
   sessionid            integer not null AUTO_INCREMENT,
   quizid               integer not null,
   ncorrect             integer,
   nquestion            integer,   
   PRIMARY KEY (sessionid)
);


/*==============================================================*/
/* Table: questionresults                                               */
/*==============================================================*/
create table questionresults
(
   sessionid            integer,
   questionid           integer,
   revisionid           integer,
   correct              integer default 0,
   PRIMARY KEY (sessionid, questionid)
);

/*==============================================================*/
/* Table: answerresults                                               */
/*==============================================================*/
create table answerresults
(
   sessionid            integer,
   answerid             integer,
   revisionid           integer,
   value                text,
   PRIMARY KEY (sessionid, answerid)
);
