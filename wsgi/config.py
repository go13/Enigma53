import os

dbhost = os.environ['OPENSHIFT_MYSQL_DB_HOST'] #:$OPENSHIFT_MYSQL_DB_PORT'

dbuser = 'adminuWJebAu'
dbpass = 'CbbTZnik1KrN'
dbname = 'enigma53'

#DB_URI = 'mysql://' + 'root' + ':' + 'root' + '@' + '127.0.0.1' + '/' +'qnet'
DB_URI = 'mysql://' + dbuser + ':' + dbpass + '@' + dbhost + '/' +dbname