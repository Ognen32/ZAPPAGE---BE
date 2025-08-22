import app from './app.js';

// Starting and listening to the server on the port listen
// from config.env using dotenv environment variables

// npx sequelize-cli init - Creates migrations and seeders folders and an index.js it might delete your model. Also creates a config.json file in which you have to fill in your server details.
// npx sequelize-cli db:create - Used for creating DB's
// npx sequelize-cli migration:generate --name create_users_table - Generates a migration table that has to be .cjs since we're using ES modules
// npx sequelize-cli db:migrate - Migrates the generated table to the DB
// npx sequelize-cli db:migrate:undo - Undoes the creation of the table
// nodemon server.js - The command for starting the server

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});