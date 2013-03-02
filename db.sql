/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     01.02.2013 7:05:21                           */
/*==============================================================*/


drop table if exists answers;

drop table if exists questions;

drop table if exists quizes;

drop table if exists answerhistory;

drop table if exists users;

/*==============================================================*/
/* Table: answers                                               */
/*==============================================================*/
create table answers
(
   id                   integer not null AUTO_INCREMENT,
   questionid           integer,
   atext                text,
   correct              integer,
   primary key (id)
);
insert into answers values (1, 1, 'Cporrect answer 1 ', 0);
insert into answers values (2, 1, 'Cporrect answer 2 ', 0);
insert into answers values (3, 1, 'Cporrect answer 3 ', 0);

/*==============================================================*/
/* Table: questions                                             */
/*==============================================================*/
create table questions
(
   id                   integer not null AUTO_INCREMENT,
   quizid               integer,
   nextquestionid       integer,
   qtext                text,
   type                 integer,
   primary key (id)
);
insert into questions values (1, 1, 2,'Question 1', 1);
insert into questions values (2, 1, 3,'Question 2', 1);
insert into questions values (3, 1, null,'Question 3', 1);

/*==============================================================*/
/* Table: quizes                                                */
/*==============================================================*/
create table quizes
(
   id                   integer not null AUTO_INCREMENT,
   title                text,
   description          text,
   primary key (id)
);

insert into quizes values (1, 'Quiz 1', 'Quiz description');
insert into quizes values (2, 'Quiz 2', 'Quiz description');

/*==============================================================*/
/* Table: quizes                                                */
/*==============================================================*/
create table answerhistory
(
   id                   integer not null AUTO_INCREMENT,
   userid               integer not null,
   questionid           integer not null,
   answerid             integer not null,
   submittime           timestamp not null,
   primary key (id)
);
insert into answerhistory values (1, 1, 1, 1, sysdate());
insert into answerhistory values (2, 1, 1, 3, sysdate());

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

insert into users values (1, 'Dmitiry', 'dima.blinkov@gmail.com', 'Enigma');
