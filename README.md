# User and Book Management System

## Overview

This project is a comprehensive system for managing users and books, built with
TypeScript. It includes functionalities for user authentication (sign-in and
sign-up) using JWT, as well as CRUD operations for books. The project follows a
clean architecture pattern and uses TypeORM for database interactions.

## Clean Architecture

The project is structured following the principles of clean architecture, which
emphasizes separation of concerns and independence of frameworks, UI, and
databases. This architecture allows for easy testing and maintenance.

### Key Principles

- **Independence**: The core business logic is independent of external
  frameworks and libraries.
- **Separation of Concerns**: Different layers handle different
  responsibilities, such as business logic, data access, and presentation.
- **Testability**: The architecture facilitates unit testing by decoupling
  components.

## Project Structure

- **src/core/entities**: Contains the core entities of the system, such as
  `User` and `Book`. These are simple data structures that represent the main
  objects in the business domain.

- **src/core/ports**: Defines interfaces for various system ports like `Logger`,
  `Database`, and `API`. These interfaces act as contracts for the
  infrastructure layer to implement.

- **src/core/use-cases**: Contains the business logic for user and book
  operations. Use cases orchestrate the flow of data between entities and ports.

- **src/infrastructure/adapters**: Contains implementations for database and
  logging adapters. This layer interacts with external systems and frameworks.

- **src/infrastructure/api**: Contains API controllers and services for handling
  HTTP requests. This layer is responsible for communication with the outside
  world.

- \***\*tests\*\***: Contains unit tests for the system, ensuring the
  functionality of entities and use cases.

## Dependency Injection with tsyringe

The project uses `tsyringe` for dependency injection, which allows for easy
management of dependencies and promotes loose coupling between components.

### How tsyringe is Used

- **Container Registration**: Dependencies are registered in a central
  container, typically in the `adapter.di.ts` file. This includes repositories,
  loggers, and other services. For example, the `TypeORMUserRepository` and
  `TypeORMBookRepository` are registered as implementations of the
  `UserRepository` and `BookRepository` interfaces, respectively.

  ```typescript
  import { container } from 'tsyringe';
  import {
    BookRepository,
    UserRepository,
  } from '../../core/ports/database.port';
  import TypeORMUserRepository from './type-orm/user/user.repository';
  import { TypeORMBookRepository } from './type-orm/book/book.repository';

  container.register<UserRepository>('UserRepository', {
    useClass: TypeORMUserRepository,
  });

  container.register<BookRepository>('BookRepository', {
    useClass: TypeORMBookRepository,
  });
  ```

- **Dependency Resolution**: Use cases and other components request dependencies
  from the container, which provides the appropriate instances. This is done
  using `container.resolve`.

  ```typescript
  import { container } from 'tsyringe';
  import { UserRepository } from '../../ports/database.port';

  class SomeUseCase {
    private userRepository: UserRepository;

    constructor() {
      this.userRepository = container.resolve<UserRepository>('UserRepository');
    }
  }
  ```

- **Benefits**: This approach simplifies testing by allowing mock
  implementations to be injected during tests, and it enhances flexibility by
  decoupling components from their concrete implementations.

### Using Multiple Implementations

To use multiple implementations simultaneously, you can register each
implementation with a unique identifier and choose which one to use in your
business logic.

#### Example

1. **Register Multiple Implementations**:

   ```typescript
   import MongooseUserRepository from './mongoose/user/user.repository';

   container.register<UserRepository>('TypeORMUserRepository', {
     useClass: TypeORMUserRepository,
   });

   container.register<UserRepository>('MongooseUserRepository', {
     useClass: MongooseUserRepository,
   });
   ```

2. **Select Implementation in Use Case**:

   ```typescript
   import { container } from 'tsyringe';
   import { UserRepository } from '../../ports/database.port';

   class SomeUseCase {
     private userRepository: UserRepository;

     constructor(useMongoose: boolean) {
       this.userRepository = container.resolve<UserRepository>(
         useMongoose ? 'MongooseUserRepository' : 'TypeORMUserRepository',
       );
     }
   }
   ```

3. **Configuration**: You can decide which implementation to use based on
   configuration, environment variables, or runtime conditions.

This approach allows you to maintain flexibility and choose the appropriate
implementation based on your needs without modifying the core business logic.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables: Create a `.env` file in the root directory and
   add the following:

   ```plaintext
   # common
   NODE_ENV=development
   PORT=8000
   LOG_LEVEL=debug

   # postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_HOST=127.0.0.1
   POSTGRES_PORT=1234
   POSTGRES_DB=boilerplate

   # pgadmin
   PGADMIN_DEFAULT_EMAIL=pgadmin4@pgadmin.org
   PGADMIN_DEFAULT_PASSWORD=admin
   PGADMIN_PORT=5050

   # user
   USER_SALT=mysalt
   JWT_SECRET=myjwtsecret
   ```

## Running the Application

### Using Docker

1. Ensure Docker and Docker Compose are installed on your machine.
2. Start the services using Docker Compose:

   ```bash
   docker-compose -f docker-compose.local.yml up
   ```

3. Access the application at `http://localhost:8000` and pgAdmin at
   `http://localhost:5050`.

## Database migrations

If you have made changes to database entities and need to generate a new
migration, you can do so by issuing the following command:

```bash
pnpm run typeorm migration:generate -d src/infrastructure/adapters/type-orm/data-source.ts src/infrastructure/adapters/type-orm/migrations/migration-name
```

### Running Locally

1. Ensure PostgreSQL is running and accessible with the credentials specified in
   the `.env` file.
2. Start the application:

   ```bash
   npm run dev
   ```

## Running the Tests

To run the tests, use the following command:

```bash
npm test
```

## API Documentation

API documentation is available via Swagger UI at `http://localhost:8000/docs`.

## Usage

### User Operations

- **Sign-In**: Use the `/users/signin` endpoint with login and password to
  obtain a JWT token.
- **Sign-Up**: Use the `/users/signup` endpoint to register a new user.

### Book Operations

- **List Books**: Use the `/books` endpoint to retrieve a list of all books.
- **Get Book by ID**: Use the `/books/{id}` endpoint to retrieve a specific
  book.
- **Create Book**: Use the `/books` endpoint with book details to create a new
  book.
- **Delete Book**: Use the `/books/{id}` endpoint to delete a book.
