FROM gradle:8.14.3-jdk21 AS build
WORKDIR /workspace
COPY backend/build.gradle backend/settings.gradle ./
COPY backend/src ./src
RUN gradle bootJar --no-daemon \
    && find build/libs -maxdepth 1 -type f -name "*.jar" ! -name "*-plain.jar" -exec cp {} /workspace/app.jar \;

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 10001 appuser
COPY --from=build /workspace/app.jar /app/app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
