# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM gradle:8.7-jdk21 AS builder

WORKDIR /app

# Cache Gradle dependencies first (layer cache optimization)
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle dependencies --no-daemon || true

# Copy source and build
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# ── Stage 2: Run ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
