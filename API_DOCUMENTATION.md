# Event Management System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## User APIs
Base path: `/user`

### Register User
- **URL**: `/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "string"
  }
  ```

### Login User
- **URL**: `/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "string"
  }
  ```

## Admin APIs
Base path: `/admin`

### Register Admin
- **URL**: `/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "confirmPassword": "string",
    "organizationName": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "string",
    "admin": {
      "id": "string",
      "name": "string",
      "email": "string",
      "organizationName": "string"
    }
  }
  ```

### Login Admin
- **URL**: `/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "string",
    "admin": {
      "id": "string",
      "name": "string",
      "email": "string",
      "organizationName": "string"
    }
  }
  ```

## Event APIs
Base path: `/event`

### Create Event
- **URL**: `/add`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "date": "string",
    "venue": "string",
    "capacity": "number",
    "regularPrice": "number",
    "vipPrice": "number",
    "earlyBirdPrice": "number",
    "images": ["string"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "event": {
      "id": "string",
      "name": "string",
      "description": "string",
      "date": "string",
      "venue": "string",
      "capacity": "number",
      "regularPrice": "number",
      "vipPrice": "number",
      "earlyBirdPrice": "number",
      "images": ["string"]
    }
  }
  ```

### List Events
- **URL**: `/list`
- **Method**: `GET`
- **Auth Required**: No
- **Response**:
  ```json
  {
    "success": true,
    "events": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "date": "string",
        "venue": "string",
        "capacity": "number",
        "regularPrice": "number",
        "vipPrice": "number",
        "earlyBirdPrice": "number",
        "images": ["string"]
      }
    ]
  }
  ```

### Get Single Event
- **URL**: `/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Response**:
  ```json
  {
    "success": true,
    "event": {
      "id": "string",
      "name": "string",
      "description": "string",
      "date": "string",
      "venue": "string",
      "capacity": "number",
      "regularPrice": "number",
      "vipPrice": "number",
      "earlyBirdPrice": "number",
      "images": ["string"]
    }
  }
  ```

### Delete Event
- **URL**: `/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Event deleted successfully"
  }
  ```

## Ticket APIs
Base path: `/ticket`

### Purchase Tickets
- **URL**: `/purchase`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "eventId": "string",
    "quantity": "number",
    "ticketType": "string" // "regular", "vip", or "early-bird"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "ticket": {
      "id": "string",
      "ticketNumber": "string",
      "event": {
        "name": "string",
        "date": "string",
        "venue": "string"
      },
      "quantity": "number",
      "totalAmount": "number",
      "ticketType": "string",
      "purchaseDate": "string"
    }
  }
  ```

### Get User's Tickets
- **URL**: `/my-tickets`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "success": true,
    "tickets": [
      {
        "id": "string",
        "ticketNumber": "string",
        "event": {
          "name": "string",
          "date": "string",
          "venue": "string",
          "image": "string"
        },
        "quantity": "number",
        "totalAmount": "number",
        "ticketType": "string",
        "status": "string",
        "purchaseDate": "string"
      }
    ]
  }
  ```

### Get Ticket Details
- **URL**: `/:ticketId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "success": true,
    "ticket": {
      "id": "string",
      "ticketNumber": "string",
      "event": {
        "name": "string",
        "date": "string",
        "venue": "string",
        "description": "string",
        "image": "string"
      },
      "quantity": "number",
      "totalAmount": "number",
      "ticketType": "string",
      "status": "string",
      "purchaseDate": "string"
    }
  }
  ```

### Cancel Ticket
- **URL**: `/:ticketId/cancel`
- **Method**: `POST`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "success": true,
    "message": "Ticket cancelled successfully"
  }
  ```

## Error Responses
All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Notes
1. All timestamps are in ISO 8601 format
2. All monetary values are in the smallest currency unit (e.g., cents)
3. Image URLs are returned as strings
4. Authentication tokens expire after 24 hours
5. File uploads are handled through Cloudinary 