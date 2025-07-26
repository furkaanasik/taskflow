# Taskflow - Jira Clone

[Türkçe Versiyon](README.tr.md)

Taskflow is a project and task management application inspired by Jira, built with modern web technologies. It allows users to create projects, assign tasks, and manage their status through a drag-and-drop interface.

This project is built on a powerful stack including Next.js, Prisma, NextAuth, and Tailwind CSS.

<br/>

## ✨ Key Features

- **Project and Task Management:** Create projects and manage their associated tasks.
- **Drag-and-Drop Interface:** Easily change the status of tasks (e.g., "To Do", "In Progress", "Done") between boards.
- **User Management:** Secure user registration and login with authentication.
- **Multi-language Support:** Available in English and Turkish.
- **Modern UI:** A sleek and user-friendly design built with Tailwind CSS.

## 🚀 Getting Started

Follow these steps to run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [pnpm](https://pnpm.io/installation) (or npm/yarn)

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd taskflow
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up the database:**
    Push the Prisma schema to your database. This command creates tables based on the models in `prisma/schema.prisma`.
    ```bash
    npx prisma db push
    ```

4.  **Configure environment variables:**
    Copy the `.env.example` file to `.env` and fill in the variables with your own information. The `DATABASE_URL` and `NEXTAUTH_SECRET` fields are critical.
    ```bash
    cp .env.example .env
    ```

5.  **Start the development server:**
    ```bash
    pnpm run dev
    ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🛠️ Technical Details & Stack

For more information about the technical architecture, libraries used, and design decisions, please see the [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) file.

## 📁 Project Structure

The main directories and their descriptions are outlined below:

-   `src/app`: Next.js App Router structure. Contains pages, API routes, and components.
-   `src/components`: Reusable React components used throughout the project.
-   `src/lib`: Core logic, including database connection (`prisma.ts`) and authentication (`auth.ts`).
-   `src/contexts`: React Context APIs (Auth, Language).
-   `prisma`: Database schema (`schema.prisma`) and database files.
-   `public`: Static assets (images, icons, translation files).
