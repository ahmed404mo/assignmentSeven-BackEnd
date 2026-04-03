# 🚀 Route - Assignment 9 Solution (MongoDB & Mongoose)

Welcome to the solution repository for **Assignment 9**. This project implements a fully functional RESTful API using Express.js and Mongoose, designed to manage Users and Sticky Notes with complete authentication and authorization flows.

## 📁 Project Features

### 🛠️ Mongoose Models & Validation
- **Users Collection:** Strict schema validation ensuring unique emails and ages bounded between 18 and 60.
- **Notes Collection:** Linked to Users via `userId` reference. Includes a custom mongoose validator to ensure the `title` field is never entirely uppercase.

### 🔐 Authentication & Security
- Passwords are securely hashed using `bcrypt`.
- Phone numbers are encrypted/decrypted using `crypto-js`.
- JWT-based authentication ensuring routes are protected. Tokens expire in 1 hour.

### 🌐 Endpoints Implemented
#### 🧑‍💻 Users APIs (`/users`)
- `POST /signup`: Registers a new user.
- `POST /login`: Authenticates the user and generates a JWT.
- `PATCH /`: Updates logged-in user profile safely.
- `DELETE /`: Removes the logged-in user's account.
- `GET /`: Retrieves the logged-in user's profile securely via Token.

#### 📝 Notes APIs (`/notes`)
- `POST /`: Creates a note for the authenticated user.
- `PATCH /all`: Bulk updates the titles of all notes owned by the user.
- `GET /paginate-sort`: Retrieves a paginated list of notes, ordered descending by creation date.
- `GET /note-by-content`: Searches user notes by matching content.
- `GET /note-with-user`: Retrieves notes utilizing Mongoose `.populate()` to join user email.
- `GET /aggregate`: Uses the MongoDB Aggregation Pipeline (`$lookup`, `$match`, `$project`) to retrieve and search notes joined with specific user fields (name, email).
- `DELETE /`: Flushes all notes owned by the logged-in user.
- `PATCH /:noteId`, `PUT /replace/:noteId`, `DELETE /:noteId`, `GET /:id`: Core operations restricted securely by ownership validation.

---

## ⚙️ How to Run
1. Configure your Database URI and Secret Keys (`your_jwt_secret`, `secret_key`) inside your config file or `.env`.
2. Install dependencies:
   ```bash
   npm install
Run the application:

Bash
npm start
🧪 Postman Collection
Please refer to the attached Postman Collection link in the submission email to test the APIs seamlessly. All endpoints are saved with meaningful names as per assignment instructions.