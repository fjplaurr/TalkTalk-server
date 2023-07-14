# TalkTalk Api
## Description
This is an API for a project called TalkTalk. TalkTalk is a platform that allows you to add other users as friends and write posts to share your thoughts.

## Installation Guide

### Prerequisites
Make sure your machine has installed: [git](https://git-scm.com/), [docker](https://www.docker.com/).

### Setup instructions
1. Clone this repository.
    ```
    git clone https://github.com/fjplaurr/TalkTalk-server.git
    ```
2. Once cloned, change the directory to the new cloned folder.
    ```
    cd whatifipost-server
    ```
3. Create a .env file in the root of the project with values for a development environment
    ```
    cp .example.env .env
    ```
4. Build the docker images using the `docker-compose.dev.yml` file which is to setup a development environment.
    ```
    docker compose -f docker-compose.dev.yml build
    ```
5. Build the docker images. After running the next command, the api should be running at the port defined by the variable `API_PORT` in the `.env` file (port 5002 if you did not modify it).
    ```
    docker compose -f docker-compose.dev.yml up
    ```
6. Seed some data for demo purposes.
    ```
    curl -X POST http://localhost:5002/mongodb/seed
    ```    

## Usage
You can use [Postman](https://www.postman.com/) or another software to use the next API endpoints. You can also use the `curl` command in your terminal.

### API Endpoints
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| GET | /users | To retrieve all users |
| GET | /users/:userId | To retrieve an existing user |
| POST | /users/:userId/posts | To retrieve all the posts from an user  |
| PATCH | /users/:userId | To edit an user |
| DELETE | /users/:userId | To delete an user |
| GET | /users/:userId/following | To retieve all the users being followed by an user |

### Technologies Used

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com)
* [MongoDB](https://www.mongodb.com/)
* [Typescript](https://www.typescriptlang.org)
* [Docker](https://www.docker.com)

### Authors
* [Francisco Javier Plaza Urrutia](https://github.com/fjplaurr)
