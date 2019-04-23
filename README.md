This is a small API that implements user authentication with the help of...

- Express: handles routes and requests
- Mongoose: handles all things mongodb
- Bcrypt: used to hash the passwords before being saved into the database
- Express-session: used to keep a session for each user that successfully logs in
- Uniqid: generates unique ids for the sessions
- Helmet: provides some nice protection for the API

**Notes** 
- I am using the `import .. from ...` syntax instead of the `require(...)` because I added `esm` to the dependencies and the scripts in the `package.json` file have been set to require this module when executing the script.
- I also don't require `dotenv/config` explicitly since I am already requiring in the `start` and `dev` scripts inside the `package.json` file.