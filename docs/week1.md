# Week 1 APIs

## Sign-up

- Endpoint: `POST /signup`
- Authorization: No
- Request query object schema:
  
  ```jsonc
  {
    "phonenumber": "", // <string>, required. Vietnamese phone number, begin with 0, accept fixed-line numbers.
    "password": "", // <string>, required. Length: 6 - 10, alphanumeric characters. Cannot be the same with `phonenumber`
  }
  ```

- Responses
  - Success
  
  ```http
  HTTP/1.1 200 OK
  ...

  {
    "code": ""1000"",
    "message": "OK",
    "data": {
      "verify_code": "<6 alphanumeric characters, OTP (?)>"
    }
  }
  ```

  - Error: User existed

  ```http
  HTTP/1.1 409 Conflict
  ...

  {
    "code": "9996",
    "message": "User existed",
  }
  ```

  - Error: Invalid phone number (Optional: Client-side validation)

  ```http
  HTTP/1.1 400 Bad Request
  ...

  {
    "code": "1004",
    "message": "Invalid phone number",
  }
  ```

  - Error: Invalid password (Optional: Client-side validation)

  ```http
  HTTP/1.1 400 Bad Request
  ...

  {
    "code": "1004",
    "message": "Invalid password",
  }
  ```

## Login

- Endpoint: `POST /login`
- Requirement: Each login session is just for only 1 platform (device). E.g. if the user logged in on device A and then logged in on device B, we will erase the token on device A
- Authorization: No
- Request query object schema:
  
  ```jsonc
  {
    "phonenumber": "", // <string>, required. Vietnamese phone number, begin with 0, accept fixed-line numbers.
    "password": "", // <string>, required. Length: 6 - 10, alphanumeric characters. Cannot be the same with `phonenumber`,
    "uuid": "", // <Discussing>
  }
  ```

- Responses
  - Success
  
  ```http
  HTTP/1.1 200 OK
  ...

  {
    "code": "1000",
    "message": "OK",
    "data": {
      "id": "<user's ID>",
      "username": "Username",
      "token": "JWT Token",
      "avatar": "Avatar URL, can be null"
    }
  }
  ```

  - Error: User is not validated

  ```http
  HTTP/1.1 404 Not Found
  ...

  {
    "code": "9995",
    "message": "User is not validated",
  }
  ```

  - Error: Invalid phone number (Optional: Client-side validation)

  ```http
  HTTP/1.1 400 Bad Request
  ...

  {
    "code": "1004",
    "message": "Invalid phone number",
  }
  ```

  - Error: Invalid password (Optional: Client-side validation)

  ```http
  HTTP/1.1 400 Bad Request
  ...

  {
    "code": "1004",
    "message": "Invalid password",
  }
  ```

  - Error: Wrong password

  ```http
  HTTP/1.1 400 Bad Request
  ...

  {
    "code": "40001",
    "message": "Wrong password",
  }
  ```

## Logout

- Endpoint: `POST /logout`
- Authorization: Bearer Authentication (May be optional, because of passing token in query params)
- Query object schema:

  ```jsonc
    {
      "token": "string"
    }
  ```

- Responses:
  - Success
  
  ```http
  HTTP/1.1 200 OK
  ...

  {
    "code": "1000",
    "message": "OK",
  }
  ```

  - Error: Invalid token

  ```http
  HTTP/1.1 401 Unauthorized
  ...

  {
    "code": "40101",
    "message": "Invalid token",
  }
  ```

## Get verify code

- Endpoint: `POST /get_verify_code`
- Authoriztion: No
- Description: Call this API to get the verify code in case the user forgot or can not receive the verify code (in sign up phase)
- Query object schema:
  
  ```jsonc
  {
    "phonenumber": "" // <string>
  }
  ```

- Responses:
  - Success
  
  ```http
  HTTP/1.1 200 OK
  ...

  {
    "code": "1000",
    "message": "OK",
  }
  ```

  - Error: Action has been done previously by this user (verified or replay attack (< 120s))

  ```http
  HTTP/1.1 409 Conflict
  ...

  {
    "code": "1010",
    "message": "Action has been done previously by this user",
  }
  ```

  - Error: User is not validated (Phone number is not registered)

  ```http
  HTTP/1.1 404 Not Found
  ...

  {
    "code": "9995",
    "message": "User is not validated",
  }
  ```

  - Error: Invalid phone number (Optional: Client-side validation)

  ```http
  HTTP/1.1 400 Bad Request
  ...

  {
    "code": "1004",
    "message": "Invalid phonenumber",
  }
  ```
