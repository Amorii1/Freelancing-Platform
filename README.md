# Freelancing Platform API

This is a personal project of a freelancing platform built with TypeORM, Node.js, and TypeScript. It provides a platform for freelancers and clients to connect and collaborate on various projects.

## Features

- User registration and authentication
- Services module
- Project creation and management
- Proposal submission and acceptance
- Messaging system for communication
- Rating and feedback system
- Search and filtering functionality

## Technologies Used

- Node.js
- Express.js
- TypeScript
- TypeORM
- PostgreSQL (or any other supported database)
- JWT (JSON Web Tokens) for authentication
- Socket.io

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js
- PostgreSQL

## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/Amorii1/Maslahtech.git
   


2. Install dependencies:

  ```bash
  cd Maslahtech
  npm install
  


3. Set up the database:

Create a PostgreSQL database with the name freelancing_platform.
Update the database connection configuration in src/config/database.ts to match your database settings.

4. Run database migrations:

   ```bash
   npm run migration:run
   


5. Start the server:

```bash 
npm run start


The server will start running on http://localhost:3000.


##Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.


##License
This project is licensed under the MIT License.

##Acknowledgements

- [TypeORM Documentation](https://typeorm.io/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT Documentation](https://jwt.io/introduction)
- Special thanks to the [Open Source community](https://github.com) for their invaluable contributions.
