---
title: Using JWT for Authentication in a Golang Application
description: Learn how to create a Go application that creates and invalidates
  JWT tokens to bring authentication to protected routes.
thumbnail: /content/blog/using-jwt-for-authentication-in-a-golang-application-dr/Blog_JWT-Golang_Authentification_1200x600-2.png
author: victor-steven
published: true
published_at: 2020-03-13T13:00:25.000Z
spotlight: true
comments: true
updated_at: 2020-10-23T13:29:55.447Z
category: tutorial
tags:
  - go
  - jwt
  - messages-api
---

A JSON Web Token (JWT) is a compact and self-contained way for securely transmitting information between parties as a JSON object, and they are commonly used by developers in their APIs.

JWTs are popular because:

1. A JWT is stateless. That is, it does not need to be stored in a database (persistence layer), unlike opaque tokens.
2. The signature of a JWT is never decoded once formed, thereby ensuring that the token is safe and secure.
3. A JWT can be set to be invalid after a certain period of time. This helps minimize or totally eliminate any damage that can be done by a hacker, in the event that the token is hijacked.

In this tutorial, I will demonstrate the creation, use, and invalidation of a JWT with a simple RESTful API using Golang and the Vonage Messages API.

<sign-up number></sign-up>

### What Makes Up a JWT

A JWT is comprised of three parts:

* Header: the type of token and the signing algorithm used.
  The type of token can be “JWT” while the Signing Algorithm can either be HMAC or SHA256.
* Payload: the second part of the token which contains the claims. These claims include application specific data(e.g, user id, username), token expiration time(exp), issuer(iss), subject(sub), and so on.
* Signature: the encoded header, encoded payload, and a secret you provide are used to create the signature.

Let’s use a simple token to understand the above concepts.

```golang
Token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3V1aWQiOiIxZGQ5MDEwYy00MzI4LTRmZjMtYjllNi05NDRkODQ4ZTkzNzUiLCJhdXRob3JpemVkIjp0cnVlLCJ1c2VyX2lkIjo3fQ.Qy8l-9GUFsXQm4jqgswAYTAX9F4cngrl28WJVYNDwtM
```

Don’t worry, the token is invalid, so it won’t work on any production application.

You can navigate to [jwt.to](https://jwt.io) and test the token signature if it is verified or not. Use “HS512” as the algorithm. You will get the message “Signature Verified”:

![A JSON Web Token broken down using JWT.io](/content/blog/using-jwt-for-authentication-in-a-golang-application/image9.png "A JSON Web Token broken down using JWT.io")

To make the signature, your application will need to provide a **key**. This key enables the signature to remain secure—even when the JWT is decoded the signature remains encrypted. It is highly recommended to always use a secret when creating a JWT.

### Token Types

Since a JWT can be set to expire (be invalidated) after a particular period of time, two tokens will be considered in this application:

* Access Token: An access token is used for requests that require authentication. It is normally added in the header of the request. It is recommended that an access token has a short lifespan, say 15 minutes. Giving an access token a short time span can prevent any serious damage if a user’s token is tampered with, in the event that the token is hijacked. The hacker only has 15 minutes or less to carry out his operations before the token is invalidated.
* Refresh Token: A refresh token has a longer lifespan, usually 7 days. This token is used to generate new access and refresh tokens. In the event that the access token expires, new sets of access and refresh tokens are created when the refresh token route is hit (from our application).

### Where to Store a JWT

For a production grade application, it is highly recommended to store JWTs in an `HttpOnly` cookie. To achieve this, while sending the cookie generated from the backend to the frontend (client), a `HttpOnly` flag is sent along with the cookie, instructing the browser not to display the cookie through the client-side scripts. Doing this can prevent XSS (Cross Site Scripting) attacks.
JWT can also be stored in browser local storage or session storage. Storing a JWT this way can expose it to several attacks such as XSS mentioned above, so it is generally less secure when compared to using `HttpOnly cookie technique.

## The Application

We will consider a simple **todo** restful API.

Create a directory called `jwt-todo`, then initialize `go.mod` for dependency management. `go.mod` is initialized using:

```
go mod init jwt-todo
```

Now, create a `main.go` file inside the root directory(`/jwt-todo`), and add this to it:

```
package main

func main() {}
```

We will use [gin](https://github.com/gin-gonic) for routing and handling HTTP requests. The Gin Framework helps to reduce boilerplate code and is very efficient in building scalable APIs.

You can install gin, if you have not already, using:

```
go get github.com/gin-gonic
```

Then update the `main.go` file:

```
package main

Import (
 "github.com/gin-gonic/gin"
)

var (
  router = gin.Default()
)

func main() {
  router.POST("/login", Login)
  log.Fatal(router.Run(":8080"))
}
```

In an ideal situation, the `/login` route takes a user’s credentials, checks them against some database, and logs them in if the credentials are valid. But in this API, we will just use a sample user we will define in memory. Create a sample user in a struct. Add this to the `main.go` file:

```
type User struct {
ID uint64            `json:"id"`
 Username string `json:"username"`
 Password string `json:"password"`
}
//A sample use
var user = User{
 ID:          1,
 Username: "username",
 Password: "password",
}
```

### Login Request

When a user's details have been verified, they are logged in and a JWT is generated on their behalf. We will achieve this in the `Login()` function defined below:

```
func Login(c *gin.Context) {
  var u User
  if err := c.ShouldBindJSON(&u); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
     return
  }
  //compare the user from the request, with the one we defined:
  if user.Username != u.Username || user.Password != u.Password {
     c.JSON(http.StatusUnauthorized, "Please provide valid login details")
     return
  }
  token, err := CreateToken(user.ID)
  if err != nil {
     c.JSON(http.StatusUnprocessableEntity, err.Error())
     return
  }
  c.JSON(http.StatusOK, token)
}
```

We received the user’s request, then unmarshalled it into the `User` struct. We then compared the input user with the one we defined we defined in memory. If we were using a database, we would have compared it with a record in the database.

So as not to make the `Login` function bloated, the logic to generate a JWT is handled by `CreateToken`. Observe that the user id is passed to this function. It is used as a **claim** when generating the JWT.

The `CreateToken` function makes use of the  `dgrijalva/jwt-go` package, we can install this using:

```
go get github.com/dgrijalva/jwt-go
```

Let’s define the `CreateToken` function:

```
func CreateToken(userid uint64) (string, error) {
  var err error
  //Creating Access Token
  os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
  atClaims := jwt.MapClaims{}
  atClaims["authorized"] = true
  atClaims["user_id"] = userid
  atClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()
  at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
  token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
  if err != nil {
     return "", err
  }
  return token, nil
}
```

We set the token to be valid only for 15 minutes, after which, it is invalid and cannot be used for any authenticated request. Also, observe that we signed the JWT using  a **secret**(`ACCESS_SECRET`) obtained from our environmental variable. It is highly recommended that this secret is not exposed in your codebase, but rather called from the environment just like we did above. You can save it in a `.env`, `.yml` or whatever works for you.

Thus far, our `main.go` file looks like this:

```
package main

import (
  "github.com/dgrijalva/jwt-go"
  "github.com/gin-gonic/gin"
  "log"
  "net/http"
  "os"
  "time"
)

var (
  router = gin.Default()
)

func main() {
  router.POST("/login", Login)
  log.Fatal(router.Run(":8080"))
}
type User struct {
  ID uint64            `json:"id"`
  Username string `json:"username"`
  Password string `json:"password"`
  Phone string `json:"phone"`
}
var user = User{
  ID:            1,
  Username: "username",
  Password: "password",
  Phone: "49123454322", //this is a random number
}
func Login(c *gin.Context) {
  var u User
  if err := c.ShouldBindJSON(&u); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
     return
  }
  //compare the user from the request, with the one we defined:
  if user.Username != u.Username || user.Password != u.Password {
     c.JSON(http.StatusUnauthorized, "Please provide valid login details")
     return
  }
  token, err := CreateToken(user.ID)
  if err != nil {
     c.JSON(http.StatusUnprocessableEntity, err.Error())
     return
  }
  c.JSON(http.StatusOK, token)
}
func CreateToken(userId uint64) (string, error) {
  var err error
  //Creating Access Token
  os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
  atClaims := jwt.MapClaims{}
  atClaims["authorized"] = true
  atClaims["user_id"] = userId
  atClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()
  at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
  token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
  if err != nil {
     return "", err
  }
  return token, nil
}
```

We can now run the application:

```
go run main.go
```

Now we can try it out and see what we get! Fire up your favorite API tool and hit the `login`endpoint:

![Making a request using Postman](/content/blog/using-jwt-for-authentication-in-a-golang-application/image8.png "Making a request using Postman")

As seen above, we have generated a JWT that will last for 15 minutes.

### Implementation Loopholes

Yes we can login a user a generate a JWT, but there is a lot wrong with the above implementation:

1. The JWT can only be invalidated when it expires. A major limitation to this is: a user can login, then decide to logout immediately, but the user’s JWT remains valid until the expiration time is reached.
2. The JWT might be hijacked and used by a hacker without the user doing anything about it until the token expires.
3. The user will need to re-login after the token expires, thereby leading to a poor user experience.

We can address the problems stated above in two ways:

1. Using a persistence storage layer to store JWT metadata. This will enable us to invalidate a JWT the very second a the user logs out, thereby improving security.
2. Using the concept of a **refresh token** to generate a new **access token**, in the event that the **access token** expired, thereby improving the user experience.

### Using Redis to Store JWT Metadata

One of the solutions we proffered above is saving a JWT metadata in a persistence layer. This can be done in any persistence layer of choice, but Redis is highly recommended. Since the JWTs we generate have expiry time, Redis has a feature that automatically deletes data whose expiration time has reached. Redis can also handle a lot of writes and can scale horizontally.

Since Redis is a key-value storage, its keys need to be unique, to achieve this, we will use `uuid` as the key and use the user id as the value.

So let's install two packages to use:

```
go get github.com/go-redis/redis/v7
go get github.com/twinj/uuid
```

We will also import those in the `main.go` file like so:

```
import (
  …
  "github.com/go-redis/redis/v7"
  "github.com/twinj/uuid"
…
)
```

> Note: It is expected that you have redis installed in your local machine. If not, you can pause and do that, before continuing.

Let’s now initialize Redis:

```
var  client *redis.Client

func init() {
  //Initializing redis
  dsn := os.Getenv("REDIS_DSN")
  if len(dsn) == 0 {
     dsn = "localhost:6379"
  }
  client = redis.NewClient(&redis.Options{
     Addr: dsn, //redis port
  })
  _, err := client.Ping().Result()
  if err != nil {
     panic(err)
  }
}
```

The Redis client is initialized in the `init()` function. This ensures that each time we run the `main.go` file,  Redis is automatically connected.

When we create a token from this point forward, we will generate a `uuid` that will be used as one of the token claims, just as we used the user id as a claim in the previous implementation.

### Define the Metadata=

In our proposed solution, instead of just creating one token, we will need to create two JWTs:

1. The Access Token
2. The Refresh Token

To achieve this, we will need to define a struct that house these tokens definitions, their expiration periods and uuids:

```
type TokenDetails struct {
  AccessToken  string
  RefreshToken string
  AccessUuid   string
  RefreshUuid  string
  AtExpires    int64
  RtExpires    int64
}
```

The expiration period and the uuids are very handy because they will be used when saving token metadata in redis.

Now, let’s update the `CreateToken` function to look like this:

```
func CreateToken(userid uint64) (*TokenDetails, error) {
  td := &TokenDetails{}
  td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
  td.AccessUuid = uuid.NewV4().String()

  td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
  td.RefreshUuid = uuid.NewV4().String()

  var err error
  //Creating Access Token
  os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
  atClaims := jwt.MapClaims{}
  atClaims["authorized"] = true
  atClaims["access_uuid"] = td.AccessUuid
  atClaims["user_id"] = userid
  atClaims["exp"] = td.AtExpires
  at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
  td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
  if err != nil {
     return nil, err
  }
  //Creating Refresh Token
  os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
  rtClaims := jwt.MapClaims{}
  rtClaims["refresh_uuid"] = td.RefreshUuid
  rtClaims["user_id"] = userid
  rtClaims["exp"] = td.RtExpires
  rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
  td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
  if err != nil {
     return nil, err
  }
  return td, nil
}
```

In the above function, the **Access Token** expires after 15 minutes and the **Refresh Token** expires after 7 days. You can also observe we added a uuid as a claim to each token.

Since the uuid is unique each time it is created, a user can create more than one token. This happens when a user is logged in on different devices. The user can also logout from any of the devices without them being logged out from all devices. How cool!

### Saving JWTs metadata

Let’s now wire up the function that will be used to save the JWTs metadata:

```
func CreateAuth(userid uint64, td *TokenDetails) error {
 at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
 rt := time.Unix(td.RtExpires, 0)
 now := time.Now()

 errAccess := client.Set(td.AccessUuid, strconv.Itoa(int(userid)), at.Sub(now)).Err()
 if errAccess != nil {
  return errAccess
 }
 errRefresh := client.Set(td.RefreshUuid, strconv.Itoa(int(userid)), rt.Sub(now)).Err()
 if errRefresh != nil {
  return errRefresh
 }
 return nil
}
```

We passed in the `TokenDetails` which have information about the expiration time of the JWTs and the uuids used when creating the JWTs. If the expiration time is reached for either the **refresh token** or the **access token**, the JWT is automatically deleted from Redis.

I personally use [Redily](https://www.redily.app), a Redis GUI. Is a nice tool. You can take a look below to see how JWT metadata is stored in key-value pair.

![Using Readily to see the stored metadata in Redis](/content/blog/using-jwt-for-authentication-in-a-golang-application/image2.png "Using Readily to see the stored metadata in Redis")

Before we test login again, we will need to call the `CreateAuth()` function in the `Login()` function. Update the Login function:

```
func Login(c *gin.Context) {
  var u User
  if err := c.ShouldBindJSON(&u); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
     return
  }
  //compare the user from the request, with the one we defined:
  if user.Username != u.Username || user.Password != u.Password {
     c.JSON(http.StatusUnauthorized, "Please provide valid login details")
     return
  }
  ts, err := CreateToken(user.ID)
 if err != nil {
 c.JSON(http.StatusUnprocessableEntity, err.Error())
   return
}
 saveErr := CreateAuth(user.ID, ts)
  if saveErr != nil {
     c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
  }
  tokens := map[string]string{
     "access_token":  ts.AccessToken,
     "refresh_token": ts.RefreshToken,
  }
  c.JSON(http.StatusOK, tokens)
}
```

We can try logging in again. Save the `main.g`o file and run it. When the login is hit from Postman, we should have:

![Checking the access and refresh token reponse in Postman](/content/blog/using-jwt-for-authentication-in-a-golang-application/image3.png "Checking the access and refresh token reponse in Postman")

Excellent! We have both the **access_token** and the **refresh_token**, and also have token metadata persisted in redis.

### Creating a Todo

We can now proceed to make requests that require authentication using JWT.

One of the unauthenticated requests in this API is the creation of **todo** request.

First, let’s define a `Todo` struct:

```
type Todo struct {
  UserID uint64 `json:"user_id"`
  Title string `json:"title"`
}
```

When performing any authenticated request, we need to validate the token passed in the authentication header to see if it is valid. We need to define some helper functions that help with these.

First we will need to extract the token from the request header using the `ExtractToken` function:

```
func ExtractToken(r *http.Request) string {
  bearToken := r.Header.Get("Authorization")
  //normally Authorization the_token_xxx
  strArr := strings.Split(bearToken, " ")
  if len(strArr) == 2 {
     return strArr[1]
  }
  return ""
}
```

Then we will verify the token:

```
func VerifyToken(r *http.Request) (*jwt.Token, error) {
  tokenString := ExtractToken(r)
  token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
     //Make sure that the token method conform to "SigningMethodHMAC"
     if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
     }
     return []byte(os.Getenv("ACCESS_SECRET")), nil
  })
  if err != nil {
     return nil, err
  }
  return token, nil
}
```

We called `ExtractToken` inside the `VerifyToken` function to get the token string, then proceeded to check the signing method.

Then, we will check the validity of this token, whether it is still useful or it has expired, using the `TokenValid` function:

```
func TokenValid(r *http.Request) error {
  token, err := VerifyToken(r)
  if err != nil {
     return err
  }
  if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
     return err
  }
  return nil
}
```

We will also extract the token **metadata** that will lookup in our Redis store we set up earlier. To extract the token, we define the `ExtractTokenMetadata` function:

```
func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
  token, err := VerifyToken(r)
  if err != nil {
     return nil, err
  }
  claims, ok := token.Claims.(jwt.MapClaims)
  if ok && token.Valid {
     accessUuid, ok := claims["access_uuid"].(string)
     if !ok {
        return nil, err
     }
     userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
     if err != nil {
        return nil, err
     }
     return &AccessDetails{
        AccessUuid: accessUuid,
        UserId:   userId,
     }, nil
  }
  return nil, err
}
```

The `ExtractTokenMetadata`  function returns an `AccessDetails` (which is a struct). This struct contains the metadata (`access_uuid` and `user_id`)  that we will need to make a lookup in Redis. If there is any reason we could not get the metadata from this token, the request is halted with an error message.

The `AccessDetails` struct mentioned above looks like this:

```
type AccessDetails struct {
    AccessUuid string
    UserId   uint64
}
```

We also mentioned looking up the token metadata in Redis. Let’s define a function that will enable us to do that:

```
func FetchAuth(authD *AccessDetails) (uint64, error) {
  userid, err := client.Get(authD.AccessUuid).Result()
  if err != nil {
     return 0, err
  }
  userID, _ := strconv.ParseUint(userid, 10, 64)
  return userID, nil
}
```

`FetchAuth()` accepts the `AccessDetails` from the `ExtractTokenMetadata` function, then looks it up in redis. If the record is not found, it may mean the token has expired, hence an error is thrown.

Let’s finally wire up the `CreateTodo` function to better understand the implementation of the above functions:

```
func CreateTodo(c *gin.Context) {
  var td *Todo
  if err := c.ShouldBindJSON(&td); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "invalid json")
     return
  }
  tokenAuth, err := ExtractTokenMetadata(c.Request)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
 userId, err = FetchAuth(tokenAuth)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
td.UserID = userId

//you can proceed to save the Todo to a database
//but we will just return it to the caller here:
  c.JSON(http.StatusCreated, td)
}
```

As seen, we called the `ExtractTokenMetadata` to extract the JWT **metadata** which is used in `FetchAuth` to check if the metadata still exists in our Redis store. If everything is good, the Todo can then be saved to the database, but we chose to return it to the caller.

Let’s update `main()` to include the `CreateTodo` function:

```
func main() {
  router.POST("/login", Login)
  router.POST("/todo", CreateTodo)

  log.Fatal(router.Run(":8080"))
}
```

To test `CreateTodo`, login and copy the `access_token` and add it to the **Authorization Bearer Token** field like this:

![Testing the tokens using Postman](/content/blog/using-jwt-for-authentication-in-a-golang-application/image6.png "Testing the tokens using Postman")

Then add a title to the request body to create a todo and make a POST request to the `/todo` endpoint, as shown below:

![Checking the response using Postman](/content/blog/using-jwt-for-authentication-in-a-golang-application/image4.png "Checking the response using Postman")

Attempting to create a todo without an `access_token` will be unauthorized:

![Checking an unauthorised request in Postman](/content/blog/using-jwt-for-authentication-in-a-golang-application/image5.png "Checking an unauthorised request in Postman")

### Logout Request

Thus far, we have seen how a JWT is used to make an authenticated request. When a user logs out, we will instantly revoke/invalidate their JWT. This is achieved by deleting the JWT metadata from our redis store.

We will now define a function that enables us delete a JWT metadata from redis:

```
func DeleteAuth(givenUuid string) (int64,error) {
  deleted, err := client.Del(givenUuid).Result()
  if err != nil {
     return 0, err
  }
  return deleted, nil
}
```

The function above will delete the record in redis that corresponds with the `uuid` passed as a parameter.

The `Logout` function looks like this:

```
func Logout(c *gin.Context) {
  au, err := ExtractTokenMetadata(c.Request)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
  deleted, delErr := DeleteAuth(au.AccessUuid)
  if delErr != nil || deleted == 0 { //if any goes wrong
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
  c.JSON(http.StatusOK, "Successfully logged out")
}
```

In the `Logout` function, we first extracted the JWT metadata. If successful, we then proceed with deleting that metadata, thereby rendering the JWT invalid immediately.

Before testing, update the `main.go` file to include the `logout` endpoint like this:

```
func main() {
  router.POST("/login", Login)
  router.POST("/todo", CreateTodo)
  router.POST("/logout", Logout)

  log.Fatal(router.Run(":8080"))
}
```

Provide a valid `access_token` associated with a user, then logout the user. Remember to add the `access_token` to the `Authorization Bearer Token`, then hit the logout endpoint:

![Log out request using Postman](/content/blog/using-jwt-for-authentication-in-a-golang-application/image1.png "Log out request using Postman")

Now the user is logged out, and no further request can be performed with that JWT again as it is immediately invalidated. This implementation is more secure than waiting for a JWT to expire after a user logs out.

### Securing Authenticated Routes

We have two routes that require authentication: `/login` and `/logout`.  Right now, with or without authentication, anybody can access these routes. Let’s change that.

We will need to define the `TokenAuthMiddleware()` function to secure these routes:

```
func TokenAuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
     err := TokenValid(c.Request)
     if err != nil {
        c.JSON(http.StatusUnauthorized, err.Error())
        c.Abort()
        return
     }
     c.Next()
  }
}
```

As seen above, we called the `TokenValid()` function (defined earlier) to check if the token is still valid or has expired. The function will be used in the authenticated routes to secure them.
Let’s now update `main.go` to include this middleware:

```
func main() {
  router.POST("/login", Login)
  router.POST("/todo", TokenAuthMiddleware(), CreateTodo)
  router.POST("/logout", TokenAuthMiddleware(), Logout)

  log.Fatal(router.Run(":8080"))
}
```

### Refreshing Tokens

Thus far, we can create, use and revoke JWTs. In an application that will involve a user interface, what happens if the **access token** expires and the user needs to make an authenticated request? Will the user be unauthorized, and be made to login again? Unfortunately, that will be the case. But this can be averted using the concept of a **refresh token**.  The user does not need to relogin.
The **refresh token** created alongside the **access token** will be used to create new pairs of **access and refresh tokens**.

Using JavaScript to consume our API endpoints, we can refresh the JWTs like a breeze using [axios interceptors](https://github.com/axios/axios). In our API, we will need to send a POST request with a `refresh_token` as the body to the `/token/refresh` endpoint.

Let’s first create the `Refresh()` function:

```
func Refresh(c *gin.Context) {
  mapToken := map[string]string{}
  if err := c.ShouldBindJSON(&mapToken); err != nil {
     c.JSON(http.StatusUnprocessableEntity, err.Error())
     return
  }
  refreshToken := mapToken["refresh_token"]

  //verify the token
  os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
  token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
     //Make sure that the token method conform to "SigningMethodHMAC"
     if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
     }
     return []byte(os.Getenv("REFRESH_SECRET")), nil
  })
  //if there is an error, the token must have expired
  if err != nil {
     c.JSON(http.StatusUnauthorized, "Refresh token expired")
     return
  }
  //is token valid?
  if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
     c.JSON(http.StatusUnauthorized, err)
     return
  }
  //Since token is valid, get the uuid:
  claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
  if ok && token.Valid {
     refreshUuid, ok := claims["refresh_uuid"].(string) //convert the interface to string
     if !ok {
        c.JSON(http.StatusUnprocessableEntity, err)
        return
     }
     userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
     if err != nil {
        c.JSON(http.StatusUnprocessableEntity, "Error occurred")
        return
     }
     //Delete the previous Refresh Token
     deleted, delErr := DeleteAuth(refreshUuid)
     if delErr != nil || deleted == 0 { //if any goes wrong
        c.JSON(http.StatusUnauthorized, "unauthorized")
        return
     }
 //Create new pairs of refresh and access tokens
     ts, createErr := CreateToken(userId)
     if  createErr != nil {
        c.JSON(http.StatusForbidden, createErr.Error())
        return
     }
 //save the tokens metadata to redis
saveErr := CreateAuth(userId, ts)
 if saveErr != nil {
        c.JSON(http.StatusForbidden, saveErr.Error())
    return
}
 tokens := map[string]string{
       "access_token":  ts.AccessToken,
  "refresh_token": ts.RefreshToken,
}
     c.JSON(http.StatusCreated, tokens)
  } else {
     c.JSON(http.StatusUnauthorized, "refresh expired")
  }
}
```

While a lot is going on in that function, let’s try and understand the flow.

* We first took the `refresh_token` from the request body.
* We then verified the signing method of the token.
* Next, check if the token is still valid.
* The `refresh_uuid` and the `user_id` are then extracted, which are metadata used as claims when creating the refresh token.
* We then search for the metadata in redis store and delete it using the `refresh_uuid` as key.
* We then create a new pair of access and refresh tokens that will now be used for future requests.
* The metadata of the access and refresh tokens are saved in redis.
* The created tokens are returned to the caller.
* In the else statement, if the **refresh token** is not valid, the user will not be allowed to create a new pair of tokens. We will need to relogin to get new tokens.

Next, add the refresh token route in the `main()` function:

```
  router.POST("/token/refresh", Refresh)
```

Testing the endpoint with a valid `refresh_token`:

![Testing the endpoint with a valid refresh token in Postman](/content/blog/using-jwt-for-authentication-in-a-golang-application/image7.png "Testing the endpoint with a valid refresh token in Postman")

And we have successfully created new token pairs. Great😎.

### Send Messages Using the Vonage Messages API

Let's notify users each time they create a Todo using the Vonage Messages API.

You can define your API key and Secret in an environmental variable then use them in this file like this:

```
var (
  NEXMO_API_KEY   = os.Getenv( "your_api_key")
  NEXMO_API_SECRET  = os.Getenv("your_secret")
)
```

Then, we will define some structs that have information about the sender, the receiver, and the message content:

```
type Payload struct {
  From    From    `json:"from"`
  To      To      `json:"to"`
  Message Message `json:"message"`
}
type From struct {
  Type   string `json:"type"`
  Number string `json:"number"`
}
type To struct {
  Type   string `json:"type"`
  Number string `json:"number"`
}
type Content struct {
  Type string `json:"type"`
  Text string `json:"text"`
}
type Message struct {
  Content Content `json:"content"`
}
```

Then we define the function to send a message to a user below:

```
func SendMessage(username, phone string) (*http.Response, error) {
  data := Payload{
     From: From{
        Type:   "sms",
        Number: "Nexmo",
     },
     To: To{
        Type:   "sms",
        Number: phone,
     },
     Message: Message{
        Content: Content{
           Type: "text",
           Text: "Dear " + username + ", a todo was created from your account just now.",
        },
     },
  }
  payloadBytes, err := json.Marshal(data)
  if err != nil {
     return nil, err
  }
  body := bytes.NewReader(payloadBytes)

  req, err := http.NewRequest("POST", "https://api.nexmo.com/v0.1/messages", body)
  if err != nil {
     return nil, err
  }
  //Ensure headers
  req.SetBasicAuth(NEXMO_API_KEY, NEXMO_API_SECRET)
  req.Header.Set("Content-Type", "application/json")
  req.Header.Set("Accept", "application/json")

  resp, err := http.DefaultClient.Do(req)
  if err != nil {
     return nil, err
  }
  defer resp.Body.Close()

  return resp, nil
}
```

In the above function, the `To` number is the number of the user, while the `From` number must be purchased via your [Vonage API Dashboard](https://dashboard.nexmo.com).

Ensure that you have your `NEXMO_API_KEY` and `NEXMO_API_SECRET` defined in your environment variable file.

We then update the `CreateTodo` function to include the `SendMessage` function just defined, passing in the required parameters:

```
func CreateTodo(c *gin.Context) {
  var td *Todo
  if err := c.ShouldBindJSON(&td); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "invalid json")
     return
  }
  tokenAuth, err := ExtractTokenMetadata(c.Request)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
 userId, err = FetchAuth(tokenAuth)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
td.UserID = userId
//you can proceed to save the Todo to a database
//but we will just return it to the caller here:

//Send the user a notification
  msgResp, err := SendMessage(user.Username, user.Phone)
  if err != nil {
     c.JSON(http.StatusForbidden, "error occurred sending message to user")
     return
  }
  if msgResp.StatusCode > 299 {
     c.JSON(http.StatusForbidden, "cannot send message to user")
     return
  }

  c.JSON(http.StatusCreated, td)
}
```

Ensure that a valid phone number is provided so that you can get the message when you attempt to create a todo.

## Conclusion

You have seen how you can create and invalidate a JWT. You also saw how you can integrate the Vonage Messages API in your Golang application to send notifications. For more information on best practices and using a JWT, be sure to check out this <a href="https://github.com/victorsteven/jwt-best-practices">GitHub repo</a>.

You can extend this application and use a real database to persist users and todos, and you can also use a React or VueJS to build a frontend. That is where you will really appreciate the Refresh Token feature with the help of Axios Interceptors.
