#!/bin/bash

#change on your path to PostgreSQL
pathA=/c/Program\ Files/PostgreSQL/13/bin
export PATH=$PATH:$pathA

#change on your password
PGPASSWORD=admin
export PGPASSWORD

#change the path to the file from which will be made restore
pathB=../backup/
#change to name of the file from which will be made restore
filename=pgsql_2021-07-21-18-18.dump
#change on your user
dbUser=postgres
#change on your database
database=schedule

dropdb --if-exists -U $dbUser $database
psql -U $dbUser -c "create database $database;"
psql --set ON_ERROR_STOP=on -U $dbUser -d $database -1 -f $pathB$filename

unset PGPASSWORD