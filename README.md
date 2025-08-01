# TalkTalk API

## Table of Contents

1. [Description](#description)
2. [Installation Guide](#installation-guide)
   - [Prerequisites](#prerequisites)
   - [Setup Instructions](#setup-instructions)
3. [API Endpoints](#api-endpoints)
   - [Users Endpoints](#users-endpoints)
   - [Posts Endpoints](#posts-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Me Endpoints](#me-endpoints)
   - [MongoDB](#mongodb)
4. [Examples of API Requests and Responses](#examples-of-api-requests-and-responses)
   - [Users Endpoints](#users-endpoints-1)
   - [Posts Endpoints](#posts-endpoints-1)
   - [Authentication Endpoints](#authentication-endpoints-1)
5. [Environment Variables](#environment-variables)
6. [Running Tests](#running-tests)
7. [Technologies Used](#technologies-used)
8. [Authors](#authors)

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

4. Run the application

   ```sh
   npm run start:dev
   ```

   The api should be running at the port defined by the variable `API_PORT` in the `.env` file (port 5002 if you did not modify it).

   If the setup is successful, you will see the following message in your terminal: `Server listening on port 5002`

5. Seed some data for demo purposes.

   ```sh
   curl -X POST http://localhost:5002/mongodb/seed
   ```

6. Explore the available endpoints. For example, to retrieve all the users from the seeded data, use the following command:
   ```sh
   curl http://localhost:5002/users
   ```
   You will see a list of users from the seed data.

## API Endpoints

You have different options to interact with the API:

- <b>[Postman](https://www.postman.com/)</b>: Use Postman to send requests to the API. Import the API endpoints in your workspace by clicking `Run in Postman` in this [link](https://documenter.getpostman.com/view/8562186/2s946h9sM4). This will automatically import the endpoints into your Postman workspace, allowing you to quickly start making requests.
- <b>cUrl command</b>: Use the `curl` command in your terminal to send HTTP requests.

Choose the method that suits your preference and workflow.

#### <b><u>Users Endpoints</u></b>

| HTTP Verbs | Endpoints                | Action                                  |
| ---------- | ------------------------ | --------------------------------------- |
| GET        | /users                   | Retrieve all users                      |
| GET        | /users/:id               | Retrieve a user                         |
| GET        | /users/:id/posts         | Retrieve all posts from a user          |
| GET        | /users/:id/following     | Retrieve users being followed by a user |
| POST       | /users/:id/follow        | Follow a user                           |

#### <b><u>Posts Endpoints</u></b>

| HTTP Verbs | Endpoints      | Action             |
| ---------- | -------------- | ------------------ |
| GET        | /posts         | Retrieve all posts |
| GET        | /posts/:id     | Retrieve a post    |
| POST       | /posts         | Save a new post    |
| PATCH      | /posts/:id     | Edit a post        |
| DELETE     | /posts/:id     | Delete a post      |

#### <b><u>Authentication Endpoints</u></b>

| HTTP Verbs | Endpoints         | Action                                      |
| ---------- | ---------------- | ------------------------------------------- |
| POST       | /auth/login      | Authenticate a user with email and password |
| POST       | /auth/signup     | Sign up a new user                          |

#### <b><u>Me Endpoints</u></b>

| HTTP Verbs | Endpoints     | Action                                 |
| ---------- | -------------| ---------------------------------------|
| PATCH      | /me/avatar   | Edit the authenticated user's avatar    |
| PATCH      | /me/profile  | Update the authenticated user's profile |
| DELETE     | /me          | Delete the authenticated user           |

#### <b><u>MongoDB</u></b>

The MongoDB endpoints are only available in the development environment for local testing.

| HTTP Verbs | Endpoints     | Action                   |
| ---------- | ------------- | ------------------------ |
| POST       | /mongodb/drop | Drop the entire database |
| POST       | /mongodb/seed | Seed some demo data      |

## Examples of API Requests and Responses

### Users Endpoints
#### Create a User
**Request:**
```bash
POST /users
Content-Type: application/json
{
  "email": "example@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```
**Response:**
```json
{
  "id": "user_id123"
}
```

#### Retrieve All Users
**Request:**
```bash
GET /users
```
**Response:**
```json
[
  {
    "_id": "user_id123",
    "email": "example@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "followingUsers": [],
    "status": "",
    "pictureSrc": ""
  }
]
```

### Posts Endpoints
#### Create a Post
**Request:**
```bash
POST /posts
Content-Type: application/json
{
  "text": "This is a post",
  "authorId": "user_id123",
  "date": "2025-05-07T12:00:00.000Z"
}
```
**Response:**
```json
{
  "id": "post_id123"
}
```

#### Retrieve All Posts
**Request:**
```bash
GET /posts
```
**Response:**
```json
[
  {
    "_id": "post_id123",
    "text": "This is a post",
    "authorId": "user_id123",
    "date": "2025-05-07T12:00:00.000Z"
  }
]
```

### Authentication Endpoints
#### Login
**Request:**
```bash
POST /auth/login
Content-Type: application/json
{
  "email": "example@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "accessToken": "jwt_token",
  "user": {
    "_id": "user_id123",
    "email": "example@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Environment Variables

The application requires certain environment variables to function correctly. These variables are sensitive and should not be shared publicly. Below is a list of the required environment variables and their purposes:

| Variable Name              | Description                                |
|----------------------------|--------------------------------------------|
| `AUTHENTICATION_SECRET_KEY`| Secret key for JWT authentication.         |
| `MONGO_URI`                | MongoDB connection string.                 |
| `API_PORT`                 | Port on which the API runs.                |
| `CLOUDINARY_API_KEY`       | API key for Cloudinary.                    |
| `CLOUDINARY_API_SECRET`    | API secret for Cloudinary.                 |

#### Important:
- **Do not hardcode these values in the codebase.** Use a `.env` file to store them securely.
- **Never commit the `.env` file to version control.** Add it to your `.gitignore` file to prevent accidental exposure.

### Running Tests
To run the test suite, use the following command:
```bash
npm test
```
This will execute all unit and integration tests located in the `test/` directory.

### Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com/)
- [Typescript](https://www.typescriptlang.org)
- [Docker](https://www.docker.com)

### Authors

- [Francisco Javier Plaza Urrutia](https://github.com/fjplaurr)
