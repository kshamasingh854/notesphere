# NoteSphere

NoteSphere is an original learning project: a notes application built with Java 21, Spring Boot, Maven, and MySQL. It includes a browser UI and REST API for creating, listing, editing, and deleting notes.

## Requirements

- Java 21 and Maven 3.9+
- Docker and Docker Compose (for containerized run)

## Run with Maven

A MySQL server must be available. Configure the connection using `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

```bash
mvn spring-boot:run
```

Open http://localhost:8000.

## Run with Docker Compose

The included Compose file starts MySQL and the application:

```bash
docker compose up --build -d
docker compose ps
```

Open http://localhost:8000. Stop the services with:

```bash
docker compose down
```

To remove the local database volume as well (this deletes saved notes):

```bash
docker compose down -v
```

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notes` | List notes |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |

Example:

```bash
curl -X POST http://localhost:8000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First note","content":"Hello from NoteSphere"}'
```

## Build with Maven

```bash
mvn clean package
java -jar target/notesphere.jar
```

## Build the Docker image

```bash
docker build -t notesphere:1.0 .
```

## Configuration

The application listens on port `8000`. Database settings are supplied through environment variables. The credentials in the included Compose file are local-development examples only; replace them before using the project in a shared or production environment.

## DevOps learning path

The application source is the starting point for a separate DevOps repository containing the Jenkins pipeline, Docker Hub publishing, Kubernetes manifests, deployment scripts, architecture, and screenshots.
