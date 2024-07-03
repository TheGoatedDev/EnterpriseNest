# Enterprise-Nest

[![codecov](https://codecov.io/github/TheGoatedDev/EnterpriseNest/graph/badge.svg?token=584NODGC4R)](https://codecov.io/github/TheGoatedDev/EnterpriseNest)

**This Project is a work in progress, and is not ready for production use. Please use at your own risk.**

Enterprise-Nest is an enterprise-level API framework built on top of [NestJS](https://nestjs.com/). It is designed with scalability, best practices, and robustness in mind. The architecture of the framework is based on Domain-Driven Design (DDD), Onion Architecture, Clean Architecture, and Hexagonal Architecture.

This was made due to the increasing need for a more robust and scalable API framework that can handle large-scale applications with ease. The framework is highly modular and extensible, allowing you to add or remove modules as needed.

I am also lazy and don't want to bootstrap together a project everytime I want to start a new project, so I made this to save myself time. And I thought it would be a good idea to share it with the community, and save you time.

## Features

- **Scalability**: Built to handle large-scale applications with ease. (Includes CQRS, Event Sourcing, etc.)
- **Best Practices**: Follows industry-standard best practices for API development. (Includes Common Sense™️)
- **Robustness**: Designed to be resilient and reliable. (Includes error handling, logging, etc.)
- **Architecture**: Utilizes DDD, Onion, Clean, and Hexagonal architectures for maintainability and decoupling.
- **Modularity**: Highly modular and extensible. (You can add or remove modules as needed)
- **Security**: Built-in security features to protect your application. (Helmet, CORS, etc.)
- **Agnostic**: Works with any database, ORM, or library. (Currently a small lock-in with Redis for now, until I can make generalised adapter libraries for the other modules)

## Layers

- **Application Layer**: Contains the application services and controllers.
- **Domain Layer**: Contains the domain entities, value objects, and domain services.
- **Infrastructure Layer**: Contains the infrastructure services, repositories, and data access.
- **Shared Kernel**: Contains shared utilities, constants, and types.

## Modules

- **Auth Module**: Provides authentication and authorization services.
  - **Local Strategy**: Provides local authentication strategy. This is for email and password authentication.
  - **Access Token Strategy**: Provides JWT authentication strategy. This is for access token authentication.
  - **Refresh Token Strategy**: Provides JWT authentication strategy. This is for refresh token authentication.
- **User Module**: Provides user management services.
- **Session Module**: Provides session management services.
- **Verification Module**: Provides email and phone verification services. (Currently only email verification is implemented)
- **Ping Module**: Provides a simple ping service for health checks.
- **Health Module**: Provides a health check service for monitoring. 
- **Config Module**: Provides configuration services. (Only has the config for the base template, you can add your own config)
- **Logger Module**: Provides logging services.
- **Cache Module**: Provides caching services. (Currently only Redis and In-Memory is implemented)
- **CQRS Module**: Provides CQRS services. (Current no external Event Bus is implemented, is planned)
- **JWT Module**: Provides JWT services.
- **Mailer Module**: Provides email services. (Currently only Mock is implemented, you can implement your own)
- **Repository Module**: Provides repository services. (Currently only Mock is implemented, you can implement your own)
- **SMS Module**: Provides SMS services. (Currently only Mock is implemented, you can implement your own)
- **Throttler Module**: Provides rate limiting services, this is used to prevent abuse. (Currently only In-Memory and Redis is implemented
- **Token Module**: Provides token services, this is used to generate and tokens.

## Getting Started

To get started with EnterpriseNest, you need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

1. Clone the repository:
```bash
git clone https://github.com/TheGoatedDev/EnterpriseNest.git
```
2. Navigate into the project directory:
```bash
cd EnterpriseNest
```
3. Install the dependencies:
```bash
pnpm install
```
4. Start the server:
```bash
pnpm dev
```
The server will start running at `http://localhost:3000`.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Author

This project was created by [TheGoatedDev](https://github.com/TheGoatedDev).