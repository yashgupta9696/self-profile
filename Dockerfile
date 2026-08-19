# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend
WORKDIR /web
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM golang:1.23-alpine AS backend
WORKDIR /src
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

FROM alpine:3.21
RUN apk add --no-cache ca-certificates \
	&& adduser -D -H -u 10001 app
WORKDIR /app
COPY --from=backend /out/server /app/server
COPY --from=frontend /web/out /app/static
ENV PORT=10000
ENV STATIC_DIR=/app/static
ENV CAL_USERNAME=lifesshake
EXPOSE 10000
USER app
CMD ["/app/server"]
