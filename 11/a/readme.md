# Google OAuth Integration Example

This project demonstrates how to integrate Google OAuth authentication into a Node.js/Express backend and connect it to a React frontend.

---

## Features

- Google OAuth login using Passport.js
- Secure credential management with `.env`
- Simple React frontend for login
- CORS support for local development

---

## Prerequisites

- Node.js and npm installed
- Google Cloud account

---

## 1. Register Your App with Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Choose **Web application**.
6. Set **Authorized redirect URIs** to:
   ```
   http://localhost:4000/auth/google/callback
   ```
7. Copy the **Client ID** and **Client Secret**.

---

## 2. Configure Environment Variables

Create a `.env` file in your backend project root:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Note:**  
Do **not** include comments or extra lines in your `.env` file.

---

## 3. Install Dependencies

In your backend folder, run:

```bash
npm install express express-session passport passport-google-oauth20 cors dotenv
```

---

## 4. Backend Setup

The backend (`server.js`) is already configured to:

- Load environment variables from `.env`
- Use Passport with Google OAuth
- Handle `/auth/google`, `/auth/google/callback`, and `/logout` routes
- Use CORS for the frontend

---

## 5. Frontend Setup

Your React frontend should have a login button that redirects to the backend:

```javascript
function App() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

---

## 6. Running the Application

1. **Start the backend:**
   ```bash
   node server.js
   ```
   You should see:  
   `Server started on http://localhost:4000`

2. **Start the frontend:**
   ```bash
   cd auth-frontend
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Test the flow:**
   - Click "Login with Google"
   - Authenticate with Google
   - You will be redirected back to the frontend with user info in the URL

---

## 7. Troubleshooting

- If you get `OAuth2Strategy requires a clientID option`, check your `.env` file and restart the backend.
- Make sure `.env` is in the same directory as `server.js`.
- Use `console.log(process.env.GOOGLE_CLIENT_ID)` to debug.

---

## 8. Pros & Cons of Google OAuth

**Pros:**
- Easy to set up
- Users trust Google
- Secure and maintained by Google

**Cons:**
- Requires users to have a Google account
- Limited customization of the login UI

---

## 9. Alternatives

- [Auth0](https://auth0.com/)
- [Microsoft Azure AD](https://azure.microsoft.com/en-us/products/active-directory/)
- [Okta](https://developer.okta.com/)
- [Firebase Authentication](https://firebase.google.com/products/auth)

---

## References

- [Google OAuth 2.0 docs](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google OAuth](http://www.passportjs.org/packages/passport-google-oauth20/)

---