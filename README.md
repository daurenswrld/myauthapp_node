# MyAuthApp

MyAuthApp is a simple Node.js web application for user registration and login using Express, PostgreSQL, and bcrypt for password hashing.

## Installation

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- PostgreSQL: [Download and Install PostgreSQL](https://www.postgresql.org/download/)

### Clone the Repository

```bash
git clone https://github.com/daurenswrld/myauthapp_node.git
```
### Install Dependencies
- Navigate to the project directory and install the required npm packages.
```
cd myauthapp
npm install
```
### Database Configuration
1. Create a PostgreSQL database for the application.
2. Update the .env file in the project root with your database credentials:
```
DB_USER=your_db_user
DB_HOST=your_db_host
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
```
### Running the Application
```npm start```

#### The application will run on http://localhost:3000.
