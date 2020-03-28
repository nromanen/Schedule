release: bundle exec rake db:migrate
web: java $JAVA_OPTS -jar build/server/webapp-runner-*.jar --port $PORT build/libs/*.war