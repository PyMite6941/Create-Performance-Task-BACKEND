# Frontend Connection Guide

This guide outlines how a frontend application can connect to the backend server, including both HTTP REST endpoints and WebSocket functionalities.

## 1. HTTP Endpoints

Currently, there is one HTTP GET endpoint available:

### Get Lobby Details

- **URL:** `/lobbies/:id`
- **Method:** `GET`
- **Description:** Retrieves details for a specific lobby.
- **Parameters:**
    - `id`: The ID of the lobby to retrieve.
- **Example (using JavaScript `fetch`):**

  ```javascript
  async function getLobbyDetails(lobbyId) {
    try {
      const response = await fetch(`http://localhost:3000/lobbies/${lobbyId}`); // Assuming backend runs on port 3000
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const lobbyData = await response.json();
      console.log('Lobby Details:', lobbyData);
      return lobbyData;
    } catch (error) {
      console.error('Error fetching lobby details:', error);
    }
  }

  // Example usage:
  // getLobbyDetails('someLobbyId');
  ```

## 2. WebSocket Endpoints

The backend uses Socket.IO for real-time communication.

### Connection

To connect to the WebSocket server, you'll need the Socket.IO client library.

- **Server URL:** `http://localhost:3000` (or wherever your backend is hosted)
- **Example (using Socket.IO client):**

  ```javascript
  import { io } from "socket.io-client";

  const socket = io("http://localhost:3000"); // Assuming backend runs on port 3000

  socket.on("connect", () => {
    console.log("Connected to WebSocket server with ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
  ```

### Available WebSocket Events

Here are the events you can emit to the server and events you might receive:

#### Emit Events (Client to Server)

-   **`createLobby`**
    -   **Description:** Requests the creation of a new game lobby.
    -   **Payload:** None
    -   **Example:**
        ```javascript
        socket.emit('createLobby');
        ```

-   **`joinLobby`**
    -   **Description:** Requests to join an existing lobby.
    -   **Payload:** `(string) lobbyId` - The ID of the lobby to join.
    -   **Example:**
        ```javascript
        socket.emit('joinLobby', 'someLobbyId');
        ```

-   **`makeMove`**
    -   **Description:** Sends a game move within a lobby.
    -   **Payload:** `(object) data` - An object containing move details. The structure of `data` will depend on the game logic (e.g., `{ lobbyId: string, move: any }`). Refer to `src/types/moveTypes.ts` for potential move structure.
    -   **Example:**
        ```javascript
        socket.emit('makeMove', { lobbyId: 'someLobbyId', move: { /* move details */ } });
        ```

-   **`leaveLobby`**
    -   **Description:** Requests to leave a specific lobby.
    -   **Payload:** `(string) lobbyId` - The ID of the lobby to leave.
    -   **Example:**
        ```javascript
        socket.emit('leaveLobby', 'someLobbyId');
        ```

#### Listen Events (Server to Client)

The server will likely emit events to update clients on lobby state changes, game progress, or other real-time information. Common events might include:

-   **`lobbyUpdate`**: (Payload: lobby details) - Sent when a lobby's state changes (e.g., player joins/leaves, game starts).
-   **`gameUpdate`**: (Payload: game state) - Sent when the game state updates after a move.
-   **`error`**: (Payload: error message) - Sent when an error occurs on the server.

You should implement listeners for these events based on the actual backend implementation.

**Example of listening for server events:**

```javascript
socket.on('lobbyUpdate', (lobbyData) => {
  console.log('Lobby Updated:', lobbyData);
  // Update your UI based on new lobby data
});

socket.on('gameUpdate', (gameState) => {
  console.log('Game State Updated:', gameState);
  // Update your game board/UI
});

socket.on('error', (errorMessage) => {
  console.error('Server Error:', errorMessage);
  // Display error to the user
});
```

Remember to replace `http://localhost:3000` with the actual URL of your backend server when deploying.
