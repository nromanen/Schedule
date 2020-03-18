FROM gradle:4.7.0-jdk8-alpine AS BUILDER

COPY --chown=gradle:gradle . /home/class_schedule/src
WORKDIR /home/class_schedule/src
RUN gradle build --quiet --no-daemon 


FROM tomcat:9.0-jdk8-openjdk-slim

COPY --from=BUILDER /home/class_schedule/src/build/libs/*.war /usr/local/tomcat/webapps/schedule.war
ENTRYPOINT ["catalina.sh", "run"]