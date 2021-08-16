#!/bin/bash

#change on your path to PostgreSQL
pathA=/c/Program\ Files/PostgreSQL/13/bin
export PATH=$PATH:$pathA

#change on your password
PGPASSWORD=7f4837d6a03ee3ca96073a0a0fb295256f4e2f193ae5c8a730d787ae736df19a
export PGPASSWORD

#change the path to the file from which will be made restore
pathB=../backup/
#write this on the command line as the first parameter
filename=$1
#change on your user
dbUser=fmwcxyhjckqwga
#change on your database
database=d27evucpfis4qe
#change on your host
host=ec2-52-17-1-206.eu-west-1.compute.amazonaws.com
#change on your port
port=5432

psql -U $dbUser -h $host -p $port -d $database -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql --set ON_ERROR_STOP=off -U $dbUser -h $host -p $port -d $database -1 -f $pathB$filename

unset PGPASSWORD