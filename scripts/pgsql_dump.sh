#!/bin/sh

#change on your path to PostgreSQL
pathA=/c/Program\ Files/PostgreSQL/13/bin
export PATH=$PATH:$pathA

#change on your password
PGPASSWORD=admin
export PGPASSWORD

#change to the path where the dump will be saved
pathB=../backup
#change on your user
dbUser=postgres
#change on your database
database=schedule

pg_dump -U $dbUser $database > $pathB/pgsql_$(date "+%Y-%m-%d-%H-%M").dump

unset PGPASSWORD