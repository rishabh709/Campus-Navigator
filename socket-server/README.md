Socket.IO live-location share server (prototype)

Quick start

1. Copy the env example and set a secure secret:

   cp .env.example .env
   # edit .env and set JWT_SECRET to a long random value

2. Install dependencies and run:

   npm install
   npm run start

Endpoints

POST /create-share
  - Creates a new room and returns JSON: { room, senderToken, viewerToken }
  - Tokens are JWTs signed with your JWT_SECRET (default expiry 1h).

Socket.IO

Clients connect to the socket server and provide the token in `auth` when connecting:

const socket = io('https://your-server', { auth: { token: '<JWT>' } });

- Sender (role=sender) should `emit('position', { lon, lat })` regularly.
- Viewer (role=viewer) will receive `position` events from the sender.

Notes

- This is a simple prototype. For production, add:
  - HTTPS/TLS termination
  - persistent storage for last-known positions if needed
  - token revocation / short token issuance flow
  - rate-limiting and abuse protection
  - scaling via Socket.IO Redis adapter if running multiple instances
