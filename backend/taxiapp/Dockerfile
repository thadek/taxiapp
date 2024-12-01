FROM openjdk:17-jdk-slim
ARG JAR_FILE=target/api-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} taxiapp.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/taxiapp.jar"]