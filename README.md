
# NoteSphere — DevOps CI/CD and Kubernetes Deployment Project

## 1. Project Overview

NoteSphere is a web application I use to practice a real-world DevOps deployment workflow.

The application is developed using **Java and Spring Boot**. My main focus in this project is to automate the process of building the application, creating a Docker image, and deploying it to Kubernetes.

This project demonstrates how application code moves from GitHub to a running application that can be accessed through a web browser.

## 2. Project Architecture

```text
Developer updates application code
              |
              v
           GitHub
              |
              v
      Jenkins Controller
              |
              v
        Jenkins Agent
       (AlmaLinux 9)
              |
              v
        Maven Build and Test
              |
              v
         Docker Image Build
              |
              v
          Docker Hub
              |
              v
       Kubernetes Deployment
              |
       +------+------+
       |             |
       v             v
  NoteSphere App    MySQL
       Pod            Pod
       |               |
       +-------+-------+
               |
               v
         Web Browser
```

## 3. Tools and Technologies

| Tool | How I use it |
|---|---|
| GitHub | Stores the application source code and pipeline files |
| Jenkins | Automates the build, Docker image creation, image push, and deployment |
| Jenkins Agent | Runs the pipeline commands |
| Maven | Builds and packages the Java application |
| Docker | Packages the application into a Docker image |
| Docker Hub | Stores the Docker image |
| Kubernetes | Runs and manages the application and database Pods |
| MySQL | Stores the application data |
| AlmaLinux 9 | Used for my Jenkins and Kubernetes lab environment |
| Spring Boot | Framework used by the Java application |

## 4. What Is Spring Boot?

Spring Boot is the framework used to run the NoteSphere Java application.

In this project, I use Maven to build the application, Docker to package it, and Kubernetes to run it. The application listens on port **8000** inside its container and connects to MySQL through the Kubernetes database Service.

## 5. CI/CD Workflow

When I update the project source code in GitHub, Jenkins runs the pipeline.

1. Jenkins checks out the source code from GitHub.
2. Maven builds the Java application and creates the application JAR file.
3. Docker builds an image containing the application.
4. Jenkins pushes the image to Docker Hub.
5. Jenkins applies the Kubernetes deployment configuration.
6. Kubernetes starts the application Pod using the image.
7. I verify the deployment and access the application through a web browser.

**CI** means Continuous Integration: automatically building and checking code.

**CD** means Continuous Delivery or Continuous Deployment: preparing or deploying the built application to an environment.

## 6. Jenkins Pipeline

The Jenkins pipeline is defined in:

```text
Jenkinsfile
```

The pipeline includes these stages:

- Checkout source code
- Build and test the application
- Build the Docker image
- Push the image to Docker Hub
- Deploy the application to Kubernetes

The Jenkins Controller manages the pipeline, while the Jenkins Agent runs the pipeline commands. Jenkins uses configured credentials to access GitHub, Docker Hub, and Kubernetes.

### Successful Jenkins Pipeline

The screenshot below shows the pipeline stages completed successfully.

jenkins-pipeline.png

## 7. Docker Image

After the Maven build, Jenkins creates a Docker image for NoteSphere and pushes it to Docker Hub.

Docker Hub image:

```text
kshamasingh854/notesphere
```

Kubernetes uses this image to start the application container.

## 8. Kubernetes Deployment

The application runs in my Kubernetes cluster.

The cluster includes:

- **Control-plane node:** Manages the Kubernetes cluster.
- **Worker node:** Runs the application and database Pods.
- **NoteSphere Deployment:** Manages the application Pod.
- **MySQL Deployment:** Runs the database Pod.
- **Kubernetes Services:** Provide network access to the application and database.

The application connects to MySQL through the Kubernetes Service:

```text
db-cont:3306
```

The database username and password are provided to the application through a Kubernetes Secret instead of being written directly in the application configuration.

### Kubernetes Deployment Status

The screenshot shows the NoteSphere Deployment ready, the application and database Pods running on the worker node, and the rollout completed successfully.

![Kubernetes deployment and Pod status](screenshots/kubernetes-status.png)

## 9. How I Verify the Deployment

I use these commands on the Kubernetes control-plane node.

Check the cluster nodes:

```bash
kubectl get nodes -o wide
```

Check the application and database Pods:

```bash
kubectl get pods -o wide
```

Check the application Deployment:

```bash
kubectl get deployment notesphere
```

Check the application Service:

```bash
kubectl get service notesphere-service
```

Check whether the rollout is complete:

```bash
kubectl rollout status deployment/notesphere
```

View the application logs:

```bash
kubectl logs deployment/notesphere --tail=50
```

## 10. Accessing the Application

The NoteSphere application is exposed through a Kubernetes NodePort Service.

- **Service port:** `8080`
- **NodePort:** `30081`
- **Application container port:** `8000`

I access the application using the worker node IP and NodePort:

**Application URL:** [http://192.168.2.238:30081](http://192.168.2.238:30081)

### NoteSphere Running in the Browser

![NoteSphere application running in the browser](screenshots/notesphere-browser.png)

## 11. What I Learned

Through this project, I practiced:

- Connecting GitHub with Jenkins.
- Building a Java application using Maven.
- Creating and pushing a Docker image.
- Deploying an application to Kubernetes.
- Connecting an application Pod to a MySQL database.
- Checking Kubernetes Pods, Deployments, Services, and application logs.
- Verifying the deployed application through a web browser.

## 12. Project Summary

This project demonstrates my hands-on practice with a complete DevOps workflow:

**GitHub → Jenkins → Maven → Docker → Docker Hub → Kubernetes → Web Browser**

I used Jenkins to automate the build and deployment process, Docker to package the application, and Kubernetes to run the application and database. I verified the deployment by checking the Kubernetes resources and opening the application in a web browser.
