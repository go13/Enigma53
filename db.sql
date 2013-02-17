/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     01.02.2013 7:05:21                           */
/*==============================================================*/


drop table if exists answers;

drop table if exists questions;

drop table if exists quizes;

/*==============================================================*/
/* Table: answers                                               */
/*==============================================================*/
create table answers
(
   id                   integer not null,
   questionid           integer,
   answer               text,
   correct              integer,
   primary key (id)
);

/*==============================================================*/
/* Table: questions                                             */
/*==============================================================*/
create table questions
(
   id                   integer not null,
   quizid               integer,
   nextquestionid       integer,
   question             text,
   type                 integer,
   primary key (id)
);

/*==============================================================*/
/* Table: quizes                                                */
/*==============================================================*/
create table quizes
(
   id                   integer not null,
   title                text,
   description          text,
   primary key (id)
);

