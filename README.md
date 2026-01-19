# My Book Collection

This is a simple CRUD application with a 3-tier architecture:
- Frontend: Angular using Material UI
- Backend: Spring Boot
- Database: MySQL

## Preview

![preview](./preview.png)

## How to run the application?

In order to run the application you need to have Docker and docker-compose installed on your machine. Execute the following command to start the whole application:

```sh
docker-compose up
```

Then open the web page http://localhost:4200 in a browser.

## Adminer

The docker compose setup includes Adminer for adminstrating the data base. Once the data base is started open http://localhost:8081 in a browser and log into the data base:

| Setting          | Value        |
|------------------|--------------|
| Data base system | MySQL        |
| Server           | db           |
| User             | root         |
| Password         | springCRUD   |
| Data base        | bookDatabase |
# trigger ci
