import os

dbhost = os.environ['OPENSHIFT_MYSQL_DB_HOST']

dbuser = 'adminDm'
dbpass = 'OpenShift1582996'
dbname = 'enigma53'

#DB_URI = 'mysql://' + 'root' + ':' + 'root' + '@' + '127.0.0.1' + '/' +'qnet'
DB_URI = 'mysql://' + dbuser + ':' + dbpass + '@' + dbhost + '/' +dbname