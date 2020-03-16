#FROM tomcat:9.0.30-jdk8
#COPY  ./build/libs/*.war  /usr/local/tomcat/webapps/ROOT.war

FROM tomcat:9.0.30-jdk8
#RUN echo "export JAVA_OPTS=\"-Dapp.env=staging\"" > /usr/local/tomcat/bin/setenv.sh
COPY ./build/libs/*.war /usr/local/tomcat/webapps/ROOT.war
CMD ["catalina.sh", "run"]