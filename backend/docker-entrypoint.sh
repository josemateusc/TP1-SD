#!/bin/sh

echo "Waiting for the first MongoDB database (db) to start..."
./wait-for db:27017 -t 60

echo "Waiting for the second MongoDB database (db2) to start..."
./wait-for db2:27017 -t 60

echo "Migrating the databases..."
npm run db:up 

echo "Starting the server..."
npm start 
