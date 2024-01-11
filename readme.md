-   API endpoints below

### Project structure

```
-- config (project wide configurations)
-- tests (all tests are here)
-- src
---- controllers (web controllers - they decide what happens with api requests )
---- services (core logic)
---- loaders (things to setup the project; setup the db, DI container, and others...)
---- common
-------- interfaces
-------- dtos
-------- services (external services; cache, logger, storage  )
---- routes (setup routes and routes)

```

### Tools used

-   Node.js
-   Express
-   PostgreSQL
-   TypeORM
-   Type DI - for Dependency Injection

### Installation and local setup

-   Run the command `git clone https://github.com/Aptcoder/project-x` on your terminal to clone this repo to your current directory.

-   Run the command to check out to the project directory; `cd project-x`

#### Starting up

-   Run `npm install` to install all required dependencies.

-   Create a `.env` file and fill it according to `.env.sample`

-   Run `make migrate-up` to run db migrations

-   Run `npm run test` to run tests.

-   Run `npm run start:dev` to run the project.

You're all set :)

![ERD diagram for project X](/erd.png?raw=true "ERD diagram for project X")

## API endpoints

`Endpoint`: POST /api/users/business-owners

Summary: Create a business owner account

Description: Use this endpoint to create an account for a business owner. It also creates the company for the owner

**URL parameters:**

None

**Request payload**

| name        | type   | description               | required | validation                                                              |
| ----------- | ------ | ------------------------- | -------- | ----------------------------------------------------------------------- |
| email       | string | The email of the new user | yes      | a standard email validation                                             |
| password    | string | A strong password         | yes      | string with upper and lowercase letters, digits and a special character |
| firstName   | string | User's first name         | yes      | string                                                                  |
| lastName    | string | User's last name          | yes      | string                                                                  |
| companyName | string | Company's name            | yes      | string                                                                  |

**Response**

status-code: `200`

A successful response. The new email address was created successfully

```
{
    "status": "success",
    "message": "Super admin created",
    "data": {
        "user": {
            "companyId": "0a85da52-b90b-45c2-9a6e-0b68f794b4d8",
            "userId": "1bdec3a8-6846-4069-b00f-96d9cd051ac5",
            "roleId": "1b880937-76e3-45c4-956b-c66e724ac694"
        }
    }
}
```

status-code: `400`

An invalid email or other parameter was used.

```
{
    "status": "error",
    "message": "[field with validation error] - [error message] "
}

```

status-code: `409`

An existing user is trying to create another account or same company

```
{
    "status": "error",
    "message": "This user is already part of the company"
}

```

<hr>

`Endpoint`: POST /api/companies/:companyId/invite-user

Summary: Create a user account as member of company

Description: Use this endpoint to create an account for a another member of the business

**URL parameters:**

| name      | type   | description           | required | validation |
| --------- | ------ | --------------------- | -------- | ---------- |
| companyId | string | The Id of the company | yes      | UUID       |

**Request payload**

| name      | type   | description                                | required | validation                                                              |
| --------- | ------ | ------------------------------------------ | -------- | ----------------------------------------------------------------------- |
| email     | string | The email of the new user                  | yes      | a standard email validation                                             |
| password  | string | A strong password                          | yes      | string with upper and lowercase letters, digits and a special character |
| firstName | string | User's first name                          | yes      | string                                                                  |
| lastName  | string | User's last name                           | yes      | string                                                                  |
| roleId    | string | The Id of the role the user is to be given | yes      | UUID                                                                    |

**Response**

status-code: `200`

A successful response. The new email address was created successfully

```
{
    "status": "success",
    "message": "User created",
    "data": {
        "user": {
            "companyId": "b9ee0db9-3fd9-4f4a-80d7-4154da170b36",
            "userId": "f5b7dfe7-27d8-459d-a178-68ed0d0d3772",
            "roleId": "f2c76c5e-0b3f-49fb-9caa-8ab36073e69d"
        }
    }
}
```

status-code: `400`

An invalid email or other parameter was used.

```
{
    "status": "error",
    "message": "[field with validation error] - [error message] "
}

```

status-code: `409`

<hr>

`Endpoint`: GET /api/company/:companyId/roles

Summary: Get all roles related to the company.

Description: Anyone with a role with permission "view-roles" can use this endpoint to get all default roles and custom roles created for the company

**Auth requirement**  
Only people with roles with permission "view-roles"

**URL parameters:**

| name      | type   | description           | required | validation |
| --------- | ------ | --------------------- | -------- | ---------- |
| companyId | string | The Id of the company | yes      | UUID       |

**Request payload**

None

**Response**

status-code: `200`

A successful response. All roles related to a company

```
{
    {
    "status": "success",
    "message": "Roles",
    "data": {
        "roles": [
            {
                "id": "1b880937-76e3-45c4-956b-c66e724ac694",
                "companyId": null,
                "name": "super-admin",
                "type": "default",
                "permissions": [
                    "invite-user",
                    "view-users",
                    "create-role",
                    "view-roles"
                ]
            },
            {
                "id": "e054d62a-313d-448d-bad5-e6c3ca3a3e5c",
                "companyId": null,
                "name": "guest-user",
                "type": "default",
                "permissions": [
                    "view-users"
                ]
            },
            {
                "id": "ba80667f-6fdc-4a3a-9cba-b0796eacadef",
                "companyId": "0a85da52-b90b-45c2-9a6e-0b68f794b4d8",
                "name": "Senior man",
                "type": "default",
                "permissions": [
                    "view-roles",
                    "view-users",
                    "invite-user"
                ]
            }
        ]
    }
}
}

```

status-code: `403`

The user is not allowed due to invalid authorization

```
{
    "message": "Not allowed, Kindly log in",
    "status": "failed",
    "data": {}
}

```

<hr>

`Endpoint`: POST /api/companies/:companyId/roles

Summary: Create a role for company

Description: Use this endpoint to a custom role for a company

**URL parameters:**

| name      | type   | description           | required | validation |
| --------- | ------ | --------------------- | -------- | ---------- |
| companyId | string | The Id of the company | yes      | UUID       |

**Request payload**

| name        | type     | description                        | required | validation        |
| ----------- | -------- | ---------------------------------- | -------- | ----------------- |
| name        | string   | The name of the role               | yes      | srting validation |
| permissions | string[] | An array of acceptable permissions | yes      | string            |

**Response**

status-code: `200`

A successful response. The new email address was created successfully

```
{
    "status": "success",
    "message": "Custom role created",
    "data": {
        "role": {
            "companyId": "0a85da52-b90b-45c2-9a6e-0b68f794b4d8",
            "name": "Senior man",
            "permissions": [
                "view-roles",
                "view-users",
                "invite-user"
            ],
            "type": "default",
            "id": "ba80667f-6fdc-4a3a-9cba-b0796eacadef"
        }
    }
}
```

status-code: `400`

An invalid email or other parameter was used.

```
{
    "status": "error",
    "message": "[field with validation error] - [error message] "
}

```

<hr>

`Endpoint`: POST /api/users/auth

Summary: Login any user

Description: Use this endpoint to login to any user account

**URL parameters:**

None

**Request payload**

| name     | type   | description               | required | validation                                                              |
| -------- | ------ | ------------------------- | -------- | ----------------------------------------------------------------------- |
| email    | string | The email of the new user | yes      | a standard email validation                                             |
| password | string | A strong password         | yes      | string with upper and lowercase letters, digits and a special character |

**Response**

status-code: `200`

A successful response. Login successful

```
"status": "success",
    "message": "User auth successful",
    "data": {
        "token": "<token>",
        "user": {
            "id": "1bdec3a8-6846-4069-b00f-96d9cd051ac5",
            "firstName": "Samuel",
            "lastName": "Omilo",
            "email": "o.m.i.l.o.s.a.m.u.el@gmail.com",
            "dateJoined": "2024-01-11T12:54:03.137Z",
            "userToCompanies": [
                {
                    "id": "897e0ffd-b443-4a81-aaa4-d43a56a07654",
                    "companyId": "0a85da52-b90b-45c2-9a6e-0b68f794b4d8",
                    "userId": "1bdec3a8-6846-4069-b00f-96d9cd051ac5",
                    "roleId": "1b880937-76e3-45c4-956b-c66e724ac694",
                    "role": {
                        "id": "1b880937-76e3-45c4-956b-c66e724ac694",
                        "companyId": null,
                        "name": "super-admin",
                        "type": "default",
                        "permissions": [
                            "invite-user",
                            "view-users",
                            "create-role",
                            "view-roles"
                        ]
                    },
                    "company": {
                        "id": "0a85da52-b90b-45c2-9a6e-0b68f794b4d8",
                        "companyName": "Samuel's",
                        "slug": "samuels3e6ed195-3420-4abf-a812-4c8c1be1f712"
                    }
                }
            ]
        }
    }
}
```

status-code: `400`

An invalid email or other parameter was used.

```
{
    "status": "error",
    "message": "[field with validation error] - [error message] "
}

```

status-code: `401`

An invalid password.

```
{
    "status": "error",
    "message": "Invalid password"
}

```

status-code: `409`
