FROM gradle:8.14.3-jdk21 AS build
WORKDIR /workspace
COPY backend/build.gradle backend/settings.gradle ./
COPY backend/src ./src
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 10001 appuser
COPY --from=build /workspace/build/libs/*.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
