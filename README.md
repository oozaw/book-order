# Book Order Backend

## Getting Started

Follow these steps to set up and run the project locally.

### Installation

Install the required dependencies using npm:

```bash
npm install
```

### Setup Database

Ensure you have your database set up and configured correctly. Refer to your database setup documentation or use the
provided configuration file.

#### Running Migrations and Seeders

To run migrations and seeders, use the following command:

```bash
npx prisma migrate reset
```

If the seeders haven't run automatically, use this command:

```bash
npx prisma db seed
```

### Starting the Local Server
To start the local server in development mode, use:

```bash
npm run start-dev
```

### Viewing API Documentation
Visit the /api-docs endpoint to view the API documentation.

http://localhost:3000/api-docs