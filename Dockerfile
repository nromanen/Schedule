FROM tomcat:9.0.30-jdk8
COPY  ./build/libs/*.war  /usr/local/tomcat/webapps/ROOT.war

