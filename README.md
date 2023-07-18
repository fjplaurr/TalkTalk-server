# TalkTalk Api

## Description

This is an API for a project called TalkTalk. TalkTalk is a platform that allows you to add other users as friends and write posts to share your thoughts.

## Installation Guide

### Prerequisites

Make sure your machine has installed: [git](https://git-scm.com/), [docker](https://www.docker.com/).

### Setup instructions

1. Clone this repository.
   ```sh
   git clone https://github.com/fjplaurr/TalkTalk-server.git
   ```
2. Once cloned, change the directory to the newly cloned folder.

   ```sh
   cd whatifipost-server
   ```

3. Create a .env file in the root of the project with values for a development environment.

   ```sh
   cp .example.env .env
   ```

4. Build the images and start the containers.
   ```sh
   docker compose -f docker-compose.dev.yml up
   ```
   The api should be running at the port defined by the variable `API_PORT` in the `.env` file (port 5002 if you did not modify it).
5. Seed some data for demo purposes.
   ```sh
   curl -X POST http://localhost:5002/mongodb/seed
   ```

## API Endpoints

You have different options to interact with the API:

- [Postman](https://www.postman.com/) or similar software: Use Postman or a similar tool with a user-friendly interface to send requests to the API endpoints.
- `curl` command: Use the `curl` command in your terminal to send HTTP requests directly.

#### <b><u>Users</u></b>

| HTTP Verbs | Endpoints                | Action                                  |
| ---------- | ------------------------ | --------------------------------------- |
| GET        | /users                   | Retrieve all users                      |
| GET        | /users/:userId           | Retrieve a user                         |
| POST       | /users                   | Save a new user                         |
| POST       | /users/:userId/posts     | Retrieve all posts from a user          |
| PATCH      | /users/:userId           | Edit a user                             |
| DELETE     | /users/:userId           | Delete a user                           |
| GET        | /users/:userId/following | Retrieve users being followed by a user |

#### <b><u>Posts</u></b>

| HTTP Verbs | Endpoints      | Action             |
| ---------- | -------------- | ------------------ |
| GET        | /posts         | Retrieve all posts |
| GET        | /posts/:postId | Retrieve a post    |
| POST       | /posts         | Save a new post    |
| PATCH      | /posts/:postId | Edit a post        |
| DELETE     | /users/:postId | Delete a post      |

#### <b><u>Authentication</u></b>

| HTTP Verbs | Endpoints                  | Action                                      |
| ---------- | -------------------------- | ------------------------------------------- |
| POST       | /loginWithEmailAndPassword | Authenticate a user with email and password |
| POST       | /loginWithToken            | Authenticate a user with access token       |
| POST       | /signup                    | Sign up a new user                          |

#### <b><u>MongoDB</u></b>

| HTTP Verbs | Endpoints     | Action                   |
| ---------- | ------------- | ------------------------ |
| POST       | /mongodb/drop | Drop the entire database |
| POST       | /mongodb/seed | Seed some demo data      |

### Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com/)
- [Typescript](https://www.typescriptlang.org)
- [Docker](https://www.docker.com)

### Authors

- [Francisco Javier Plaza Urrutia](https://github.com/fjplaurr)
