#!/bin/sh

#change on your path to PostgreSQL
pathA=/c/Program\ Files/PostgreSQL/13/bin
export PATH=$PATH:$pathA

#change on your password
PGPASSWORD=7f4837d6a03ee3ca96073a0a0fb295256f4e2f193ae5c8a730d787ae736df19a
export PGPASSWORD

#change to the path where the dump will be saved
pathB=../backup
#change on your user
dbUser=fmwcxyhjckqwga
#change on your database
database=d27evucpfis4qe
#change on your host
host=ec2-52-17-1-206.eu-west-1.compute.amazonaws.com
#change on your port
port=5432

pg_dump --no-owner -U $dbUser -h $host -p $port -d $database > $pathB/pgsql_$(date "+%Y-%m-%d-%H-%M").dump

unset PGPASSWORD