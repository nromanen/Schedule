# Build stage
FROM gradle:8.5-jdk21 AS build
COPY . .
RUN gradle build -x test

# Package stage
FROM --platform=linux/amd64 eclipse-temurin:21-jdk-alpine
COPY --from=build /home/gradle/build/libs/*.jar schedule.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx400m", "-jar", "schedule.jar"]