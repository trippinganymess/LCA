# Multi-stage build for Spring Boot application
# Stage 1: Build the application
FROM maven:3.8.7-eclipse-temurin-11 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src
COPY liveProblems.json ./liveProblems.json

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:11-jre-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Copy liveProblems.json for problem seeding
COPY liveProblems.json /app/liveProblems.json

# Expose the port that Spring Boot runs on
EXPOSE 8080

# Set environment variables for production
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
