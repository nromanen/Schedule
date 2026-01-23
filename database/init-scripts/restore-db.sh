#!/bin/bash

set -e

# Wait for PostgreSQL to be ready
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
    echo "Waiting for PostgreSQL to be ready..."
    sleep 2
done

# Check if dump file exists
if [ -f /dumps/mydump.sql ]; then
    echo "Restoring from SQL dump..."
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /dumps/mydump.sql
elif [ -f /dumps/mydump.sql.gz ]; then
    echo "Restoring from compressed SQL dump..."
    gunzip -c /dumps/mydump.sql.gz | psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
elif [ -f /dumps/mydump.dump ]; then
    echo "Restoring from custom format dump..."
    pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" /dumps/mydump.dump
else
    echo "No dump file found in /dumps/ directory."
fi

echo "Database restoration process completed."