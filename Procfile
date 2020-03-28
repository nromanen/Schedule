release: heroku pg:reset -r heroku  --confirm softservedemo
web: java $JAVA_OPTS -jar build/server/webapp-runner-*.jar --port $PORT build/libs/*.war
