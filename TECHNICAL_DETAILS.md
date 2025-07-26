# Technical Details

[Türkçe Versiyon](TECHNICAL_DETAILS.tr.md)

This document provides detailed information about the technical structure, technologies used, and architectural decisions of the Taskflow project.

## 🤖 Technology Stack

-   **Framework:** [Next.js](https://nextjs.org/) (v15) - A modern React framework with server-side rendering (SSR) and static site generation (SSG) capabilities.
-   **Database ORM:** [Prisma](https://www.prisma.io/) - A modern ORM that provides type-safe database access. It supports databases like SQLite, PostgreSQL, and MySQL.
-   **Authentication:** [NextAuth.js](https://next-auth.js.org/) - A flexible and secure authentication solution for Next.js applications.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4) - A utility-first CSS framework for rapidly building modern user interfaces.
-   **Language:** [TypeScript](https://www.typescriptlang.org/) - Adds static types to JavaScript, enabling safer and more scalable code.
-   **Internationalization (i18n):** [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/) - Used to provide multi-language support for the application.
-   **Drag and Drop:** [@dnd-kit](https.dndkit.com/) - A modern, accessible, and performant drag-and-drop library for React.

## 🏗️ Architecture and Project Structure

The project is based on the Next.js App Router architecture. This structure enhances performance by providing a clear separation between Server Components and Client Components.

-   **`src/app`**: This directory contains all the pages and API routes of the application. Each folder corresponds to a URL segment.
    -   `layout.tsx`: Defines the main page layout.
    -   `page.tsx`: Creates the main UI for a route.
    -   `api/`: API routes are defined here. For example, `api/issues` manages task-related operations.

-   **`src/lib`**: Contains the core logic of the application.
    -   `prisma.ts`: Creates a singleton instance of Prisma Client and manages the database connection.
    -   `auth.ts`: Includes the NextAuth configuration and authentication strategies (Credentials Provider).
    -   `i18n.ts`: Holds the configuration for the i18next library.

-   **`prisma/schema.prisma`**: This is where the database models (User, Project, Issue, etc.) are defined. The `npx prisma db push` command reads this schema to create or update the database tables.

-   **`middleware.ts`**: A Next.js middleware file that handles tasks like access control for specific routes (e.g., pages accessible only to logged-in users).

## 🔑 Authentication

Authentication is managed with `NextAuth.js`. The `CredentialsProvider` is used to allow users to log in with an email and password. Passwords are securely stored in the database after being hashed with `bcryptjs`.

Session management is JWT-based and signed with the `NEXTAUTH_SECRET` environment variable.

## 🌐 Multi-language Support (i18n)

The application supports multiple languages using `i18next` and `react-i18next`. Language files are stored in JSON format in the `public/locales/{lang}` directory (e.g., `public/locales/en/common.json`). The `LanguageContext` and `i18n.ts` files contain the logic for language switching and translations.
