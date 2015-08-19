#!/bin/bash
USER=`whoami`
api_db=dev_places_api
pgs_db=dev_places_pgs
backupDate="$(date +'%Y%m%d%H%M')"

PROD_api_db=places_api
PROD_pgs_db=places_pgs

if [ $USER = "postgres" ]; then

  echo "**** backing up the dev databases ****"
  pg_dump -Fc "$api_db" > "./backups/api_backup_$backupDate"
  pg_dump -Fc "$pgs_db" > "./backups/pgs_backup_$backupDate"

  echo "**** backup up the production databases ****"
  pg_dump -Fc "$PROD_api_db" > "./backups/PROD_api_backup_$backupDate"
  pg_dump -Fc "$PROD_pgs_db" > "./backups/PROD_pgs_backup_$backupDate"

  echo "**** Dropping and recreating the dev databases ****"
  psql -c "DROP DATABASE IF EXISTS $api_db;"
  psql -c "CREATE DATABASE $api_db;"
  psql -c "DROP DATABASE IF EXISTS $pgs_db;"
  psql -c "CREATE DATABASE $pgs_db;"

  echo "**** Loading the former prod db into dev ****"
  pg_restore -d $api_db "./backups/PROD_api_backup_$backupDate"
  pg_restore -d $pgs_db "./backups/PROD_pgs_backup_$backupDate"

  echo "**** Done! ***"
else
  echo You must run this from the postgres users
fi

