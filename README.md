# fb-api-clone

## Overview

Web-based Technology mini project.
HUST, SoICT, semester 20201

## Tech Stack

- Node.js
- PostgreSQL

## API Wiki

- API Lists
- [Response Codes](./docs/response-codes.md)

## DB Scrips

- Create a new migration: 
  ```sh
  npx sequelize migration:generate --name <migration_name>
  ```
- Run pending migrations
  ```sh
  npx sequelize db:migrate
  ```
- Revert a migration
  ```sh
  npx sequelize db:migrate:undo
  ```
- Revert all migrations ran
  ```sh
  npx sequelize db:migrate:undo:all
  ```

&copy; 2020 **SE Go Pro Team**
> [Phùng Việt Duy](https://github.com/duypv98)
> [Đào Duy Nam (Eric)](https://github.com/namdaoduy)
> [Truong Anh Quốc](https://github.com/SpQuyt)
> [Khikuroba](https://github.com/Khikuroba)
