# rentit

Rentit is a car rental API written in NodeJS with NestJS.


## Tech Stack

  * NodeJS
  * Typescript
  * NestJS
  * Jest
  * Prisma
  * PostgreSQL


## Run Locally

Clone the project

```bash
git clone https://github.com/PatrickMazzuco/rentit.git
```

Go to the project directory

```bash
cd rentit
```

Create the .env file.

```bash
cp .env.example .env.development.local
```

Run the development database with docker

```bash
docker-compose up -d
```

Install the dependencies

```bash
pnpm install
```

Run migrations

```bash
pnpm migration:run:dev
```

Run the project with
```bash
pnpm start:dev
```

## Run tests

Run the test database with docker

Create the test .env file, change the database name to **rentit_tests** and the database port to **54320**.

```bash
cp .env.example .env.test.local
```

Run the test database with docker
```bash
docker-compose up -d -f docker-compose.test.yml
```

Install the dependencies

```bash
pnpm install
```

Run migrations

```bash
pnpm migration:run:dev
```

Run the tests with
```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:int

# All tests
pnpm test
```
