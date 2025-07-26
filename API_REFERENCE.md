# API Reference

This document provides a reference for the API endpoints available in the Taskflow application. All endpoints are located under the `/api` path.

## Authentication

Authentication is managed by NextAuth.js. The main endpoint is used for handling login, logout, and session management.

-   **`/api/auth/...`**
    -   **Description:** Handles various authentication actions like sign-in, sign-out, and session retrieval.
    -   **Methods:** `GET`, `POST`
    -   **Details:** These routes are automatically managed by NextAuth.js. Refer to the [NextAuth.js documentation](https://next-auth.js.org/getting-started/rest-api) for more details.

## Users

-   **`/api/users`**
    -   **Description:** Used for searching users to add to a project.
    -   **Method:** `GET`
    -   **Query Parameters:**
        -   `email`: The email address to search for.
    -   **Response:** An array of user objects matching the search query.

## Projects

-   **`/api/projects`**
    -   **Description:** Create a new project or get a list of projects for the authenticated user.
    -   **Method:** `POST` (Create a new project), `GET` (List user's projects)
    -   **`POST` Body:** `{ "name": string, "description": string }`

-   **`/api/projects/{projectId}`**
    -   **Description:** Get, update, or delete a specific project.
    -   **Methods:** `GET`, `PUT`, `DELETE`
    -   **`PUT` Body:** `{ "name": string, "description": string }`

-   **`/api/projects/{projectId}/members`**
    -   **Description:** Add a member to a project or get a list of project members.
    -   **Method:** `POST` (Add a member), `GET` (List members)
    -   **`POST` Body:** `{ "userId": string }`

## Issues (Tasks)

-   **`/api/issues`**
    -   **Description:** Create a new issue (task) for a project.
    -   **Method:** `POST`
    -   **`POST` Body:** `{ "title": string, "description": string, "projectId": string, "assigneeId": string, "type": "TASK" | "BUG" | "STORY", "priority": "LOW" | "MEDIUM" | "HIGH" }`

-   **`/api/issues/{issueId}`**
    -   **Description:** Get, update, or delete a specific issue.
    -   **Methods:** `GET`, `PUT`, `DELETE`
    -   **`PUT` Body:** Can include fields like `title`, `description`, `assigneeId`, `status`, etc.

## Error Handling

-   **401 Unauthorized:** The user is not authenticated.
-   **403 Forbidden:** The user is not authorized to perform the action.
-   **404 Not Found:** The requested resource could not be found.
-   **500 Internal Server Error:** An unexpected error occurred on the server.
