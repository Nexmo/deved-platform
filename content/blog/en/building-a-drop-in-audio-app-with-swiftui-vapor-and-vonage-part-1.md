---
title: Building a Drop-in Audio App With SwiftUI, Vapor and Vonage - Part 1
description: This two part tutorial will use the Conversation API with the
  Client SDK to build your very own drop-in audio app.
author: abdul-ajetunmobi
published: true
published_at: 2021-02-09T18:03:22.132Z
updated_at: 2021-02-09T18:03:22.172Z
category: tutorial
tags:
  - swift
  - conversation-api
  - vapor
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
# Building a Drop-in Audio App With SwiftUI, Vapor and Vonage - Part 1

## Introduction

Drop-in audio apps are becoming very popular recently with Clubhouse, Soapbox, Twitter Spaces and others gaining a lot of traction. This tutorial you will use the [Conversation API](https://developer.nexmo.com/conversation/overview) with the [Client SDK](https://developer.nexmo.com/client-sdk/overview) to build your very own drop-in audio app. The tutorial is in two parts, the first part will cover the backend server and the [second part](LINKHERE) will cover the iOS application. 

## Prerequisites

+ A Vonage API account. If you don't have one already, you can [sign up today](https://dashboard.nexmo.com/sign-up)
+ Xcode 12 and Swift 5 or greater.
+ [Vapor 4.0](https://vapor.codes) installed on your machine.
+ [ngrok](https://ngrok.com) for exposing your local machine to the internet.
+ Our Command Line Interface. Which can be installed with `npm install nexmo-cli@beta -g`.


## Creating a Vonage Application

To create the application, you will be using the Vonage command line interface. If you have not set up the CLI yet, do so by running the command `nexmo setup API_KEY API_SECRET` in your terminal, where the API Key and Secret are the API Key and Secret found on your [account's settings page](https://dashboard.nexmo.com/settings).

Create your a directory using `mkdir vonageapi`, then change into the directory with `cd vonageapi`. Then create the Vonage application with `nexmo app:create "VaporConvAPI" --capabilities=rtc --keyfile=private.key  --rtc-event-url=https://example.com/`. The command will save your application's private key to the `private.key` file and output your application's ID. You will need them for future steps. 

## Create a Vapor Project

You can create a Vapor project using the new project command `vapor new VaporConvAPI` in your terminal. The terminal will prompt a few times, first asking whether you would like to use Fluent say yes to this and choose Postgres as the database. Next, you will be asked if you would like to use Leaf, say no to this. [Fluent](https://docs.vapor.codes/4.0/fluent/overview) is an Object-relational mapping framework that will be used to store user information in the database. Once the command has finished change directory into the project folder using `cd VaporConvAPI`. 


![Vapor project setup](vapor.png)

You can set up the database either with Postgres:

```sh
createuser -d vapor_username; createdb -h localhost -p 5432 -U vapor_username vapor_database
```
This command creates a new user, then creates a new database. Make sure to start the Postgres service, if you installed Postgres with brew you can start it with `brew services start postgresql`.

Or Docker:

```sh
# Excerpt From: Server-Side Swift with Vapor, Tim Condon
docker run --name postgres \
  -e POSTGRES_DB=vapor_database \
  -e POSTGRES_USER=vapor_username \
  -e POSTGRES_PASSWORD=vapor_password \
  -p 5432:5432 -d postgres”
```
This command creates a new Docker container using the Docker Postgres image, which will be downloaded if you do not already have it, with some environment variables as the database's credentials. You can check if the database is running by running `docker ps`.

Next, copy your `private.key` file from your projects root directory to the Vapor project's `Sources/App/` folder. Once done, you can open the project in Xcode using `vapor xcode`.  When Xcode opens, it will start downloading the dependencies that Vapor relies on using Swift Package Manager (SPM). To view the dependencies, you can open the `Package.swift` file. By default, Xcode runs your application from a randomized local directory. Since you will be loading the `private.key` file, you need to set a custom working directory. Go to _Product > Scheme > Edit Scheme..._ and set the working directory to your project's root folder.

![Setting custom working directory](workingdir.png)

## User Authentication

When using your application, you will need to authenticate users to use the Client SDK in the iOS application. The Conversation API has a concept of [Users](https://developer.nexmo.com/conversation/concepts/user), an object that identifies a unique Vonage user in the context of your Vonage application. Your backend server will also keep track of users which will map one-to-one with the Vonage user, to differentiate between the two, the users on your backend server will be referred to as a database user going forward. Once you have a registered and saved user, the server will use this to generate a JSON Web Tokens (JWTs) for the Client SDK to log in.

### Create the Database User Model

In the `Models` folder, delete the `Todo.swift` file and create a new file named `User.swift` by going to _File > New > File_ (CMD + N). Then create a new class called `User` which will be the Fluent Model for the database users:

```swift
import Fluent

final class User: Model {
    
    static let schema = "users"
    
    @ID(custom: "id", generatedBy: .user) var id: String?
    @Field(key: "name") var name: String
    
    init() {}
    
    init(id: String?, name: String) {
        self.id = id
        self.name = name
    }
}
```
The `schema` property will be the table's name in the database; the `id` and `name` properties will be the table's fields. The `id` property is optional and generated by the user because the Vonage user ID will be used here but is not available yet.

### Create the Database User Migration

To create the table in the database, you will need a [migration](https://docs.vapor.codes/4.0/fluent/migration/). Migrations define changes to the database, in this case creating the User table. In the `Migrations` folder, delete the `CreateTodo.swift` file and create a new file named `CreateUser.swift`. Then create a new struct called `CreateUser`:

```swift
import Fluent

struct CreateUser: Migration {
    
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema(User.schema)
            .field("id", .string, .identifier(auto: false))
            .field("name", .string, .required)
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema(User.schema).delete()
    }
}
```
Both functions, `prepare` and `revert`, are required by the `Mirgration` protocol. `prepare` is called when the migration is run, note how the schema and fields match the `User` class you just created. The `id` property is set as an identifier which does not auto-increment as the Vonage user ID will be used as mentioned earlier.

Now you can add the migrations to your project, open the `configure.swift` file and delete the `app.migrations.add(CreateTodo())` line and add:

```swift
app.migrations.add(CreateUser())
try app.autoMigrate().wait()
```
This will run the `CreateUser` migration automatically for you when your server starts and only when needed. As you can see in the `configure.swift` file, the server is using a database with the credentials that were specified when creating the Docker Postgres container.

### Generate the JWT

Both the Conversation API and the Vonage Client SDKs use JWTs for authentication. JWTs are a method for representing claims securely between two parties. You can read more about JWTs on [JWT.io](https://jwt.io) or the claims that the Conversation API supports on the [Conversation API documentation](https://developer.nexmo.com/conversation/guides/jwt-acl). Open the `Package.swift` file and add a dependency for `Swift-JWT` in the top-level `dependencies` array as well as the the `dependencies` array for the target:

```swift 
...
dependencies: [
    // 💧 A server-side Swift web framework.
    .package(url: "https://github.com/vapor/vapor.git", from: "4.0.0"),
    .package(url: "https://github.com/vapor/fluent.git", from: "4.0.0"),
    .package(url: "https://github.com/vapor/fluent-postgres-driver.git", from: "2.0.0"),
    .package(name: "SwiftJWT", url: "https://github.com/Kitura/Swift-JWT.git", from: "3.0.0")
],
targets: [
    .target(
        name: "App",
        dependencies: [
            .product(name: "Fluent", package: "fluent"),
            .product(name: "FluentPostgresDriver", package: "fluent-postgres-driver"),
            .product(name: "Vapor", package: "vapor"),
            .product(name: "SwiftJWT", package: "SwiftJWT")
        ],
        swiftSettings: [
            // Enable better optimizations when building in Release configuration. Despite the use of
            // the `.unsafeFlags` construct required by SwiftPM, this flag is recommended for Release
            // builds. See <https://github.com/swift-server/guides#building-for-production> for details.
            .unsafeFlags(["-cross-module-optimization"], .when(configuration: .release))
        ]
    ),
...
```
When you save the file, SPM will download `SwiftJWT`. To use it, create a new file in the `Models` folder called `Auth.swift`:

```swift
import Vapor
import SwiftJWT

struct Auth {
    private let applicationId: String
    
    lazy var adminJWT: String = {
        return makeJwt()
    }()
    
    private let jwtSigner: JWTSigner = {
        let privateKeyPath = URL(fileURLWithPath: "Sources/App/private.key")
        let privateKey: Data = try! Data(contentsOf: privateKeyPath, options: .alwaysMapped)
        return JWTSigner.rs256(privateKey: privateKey)
    }()
    
    init(applicationId: String) {
        self.applicationId = applicationId
    }
    
    func makeJwt(sub: String? = nil, acl: JwtClaim.Paths? = nil) -> String {
        let iat = Date().timeIntervalSince1970.rounded()
        let exp = iat.advanced(by: 21600.0)
        let claims = JwtClaim(applicationId: applicationId, iat: iat, jti: UUID(), exp: exp, sub: sub, acl: acl)
        var jwt = JWT(claims: claims)
        return try! jwt.sign(using: jwtSigner)
    }
}
```
The `jwtSigner` property uses your Vonage application's private key to sign your JWT. It is used in the `makeJwt` function, which takes an optional subject (sub) and Access-control list (ACL). Admin JWTs are created but not providing a sub, which in the case of the Conversation API, a sub claim would be a Vonage user's username. To encode the claims correctly `SwiftJWT` provides a `Claim` protocol, create a new struct which conforms to the `Claim` protocol in the same file:

```swift
struct JwtClaim: Claims {
    typealias Paths = [String: [String: [String: String]]]
    
    let applicationId: String
    let iat: TimeInterval
    let jti: UUID
    let exp: TimeInterval
    let sub: String?
    let acl: Paths?
    
    enum CodingKeys: String, CodingKey {
        case iat, jti, exp, sub, acl
        case applicationId = "application_id"
    }
    
    static let defaultPaths: Paths = ["paths":
                                        [
                                            #"/*/users/**"#: [:],
                                            #"/*/conversations/**"#: [:],
                                            #"/*/sessions/**"#: [:],
                                            #"/*/devices/**"#: [:],
                                            #"/*/image/**"#: [:],
                                            #"/*/media/**"#: [:],
                                            #"/*/applications/**"#: [:],
                                            #"/*/push/**"#: [:],
                                            #"/*/knocking/**"#: [:],
                                            #"/*/legs/**"#: [:]
                                        ]
                                     ]
}
```
The properties in the `JwtClaim` struct match the claims expected by the [Conversation API](https://developer.nexmo.com/conversation/guides/jwt-acl#claims). In a production environment, you should have a short expiration time for the JWT and only supply the ACL paths which are needed.

Now create an instance of the `Auth` struct in the `routes.swift` file using your Vonage application ID:

```swift
import Fluent
import Vapor

func routes(_ app: Application) throws {
    var auth = Auth(applicationId: "APP_ID")
}
```

## Creating a Vonage User

Next, you can start creating the endpoints for the iOS application. The first endpoint will be for authentication. When the authentication it will first check if a database user matching the incoming username exists, if it does, the server will return a JWT. If the database user does not exist, the server will make a call to the Conversation API to create a Vonage user, save the details to the database and then return a JWT.

![Diagram of the authentication flow](authflow.png)

First, create a new file called `APIModels.swift` in the `Models` directory. This file will be where you create all the structs needed for the endpoints. The first struct you need to create is the `AuthBody` struct:

```swift
import Vapor

struct AuthBody: Content {
    let name: String
}
```
This is what the iOS client will send to the server. The struct conforms to the [`Content`](https://docs.vapor.codes/4.0/content) protocol from Vapor. A significant benefit of using Vapor is that you can lean on the Swift language's type-safety. You can model inputs and outputs to your server using structs that conform to the `Codable` protocol; `Content` that conforms to `Codable`.

The following structs model the expected input of the Conversation API, the response from the Conversation API and the response that the server will send to the iOS application:

```swift
struct IDResponse: Content {
    let id: String
}

struct UserAuth: Content {
    struct Body: Content {
        let name: String
        let displayName: String
        let imageURL: String
        
        init(name: String) {
            self.name = name
            self.displayName = name
            self.imageURL = "https://example.com/image.png"
        }
        
        enum CodingKeys: String, CodingKey {
            case name
            case displayName = "display_name"
            case imageURL = "image_url"
        }
    }
    
    struct Response: Content {
        let name: String
        let jwt: String
    }
}
```
Default values have been supplied for `imageURL` and `displayName` for the purpose of this tutorial. The Vonage APIs expect fields in snake case, so the structs have the `CodingKeys` enum to map their property names to their snake case equivalent. 

Now that the models are in place you can add the new route to the `routes` function in the `routes.swift` file:

```swift
func routes(_ app: Application) throws {
    var auth = Auth(applicationId: "APP_ID")

    app.post("auth") { req -> EventLoopFuture<UserAuth.Response> in
        let authBody = try req.content.decode(AuthBody.self)
        
        return User.query(on: req.db)
            .filter(\.$name == authBody.name)
            .first()
            .flatMap { user -> EventLoopFuture<UserAuth.Response> in
                if let user = user {
                    let userAuthResponse = UserAuth.Response(
                        name: user.name,
                        jwt: auth.makeJwt(sub: user.name, acl: JwtClaim.defaultPaths))
                    return req.eventLoop.makeSucceededFuture(userAuthResponse)
                } else {
                    
                }
            }
    }
}
```
This function defines a new route at the `/auth` path of the server, which returns a [future](https://docs.vapor.codes/4.0/async/) with a `UserAuth.Response` type. The type the iOS application is expecting. The body of the request sent to the server is decoded into the `authBody` variable. The body is used to filter the database users. Since you are looking for one user and usernames are unique, `.first()` is used on the response of the database query which returns the type `EventLoopFuture<User?>`. That then gets transformed to the expected type of `EventLoopFuture<UserAuth.Response>` with the `flatMap` closure.

![Diagram of the authentication flow, first part circled](authflow-1.png)

For the second part of flow continues in the `flatMap` closure. If the database use optional is nil, then make a call to `/v0.1/users` of the Conversation API to create a user:


```swift
...
app.post("auth") { req -> EventLoopFuture<UserAuth.Response> in
        ...
        .flatMap { user -> EventLoopFuture<UserAuth.Response> in
            if let user = user {
                ...
            } else {
                return req.client.post(URI(scheme: "https", host: "api.nexmo.com", path: "v0.1/users")) { req in
                    req.headers.add(name: .authorization, value: "Bearer \(auth.adminJWT)")
                    try req.content.encode(UserAuth.Body(name: authBody.name), as: .json)
                }.flatMap { response -> EventLoopFuture<UserAuth.Response> in
                    let responseBody = try! response.content.decode(IDResponse.self)
                    let user = User(id: responseBody.id, name: authBody.name)
                    let userAuthResponse = UserAuth.Response(
                        name: user.name,
                        jwt: auth.makeJwt(sub: user.name, acl: JwtClaim.defaultPaths))
                return user.save(on: req.db).map { userAuthResponse }
            }
        }
}
...
```
To make a request to the Conversation API, an `authorization` header is added to the request along with a `UserAuth.Body` struct encoded as the request's body. The response of this call, the Vonage user ID of the created user, is again transformed in a `flatMap` closure to the expected type of `EventLoopFuture<UserAuth.Response>`. This time there is an added step of creating a database user and saving it. In a production environment, you should use a password to secure user's access to your system, and you could go a step further and return an auth token for future requests to your server. 

![Diagram of the authentication flow, second part circled](authflow-2.png)

With the whole route complete, you can now see the flow of data from the input to the server, and through a series of chained transforms, you get the desired output.

## Listing Conversations

Once the iOS application has been authenticated, it will display a list of audio rooms that the user can join. Audio rooms will be the equivalent of a [conversation](https://developer.nexmo.com/conversation/concepts/conversation) concept of the Conversation API. To get a list of available conversations for your Vonage application, you can call `/v0.2/conversations`. Add the needed models to the `APIModels` file:

```swift
...
struct Conversation: Content {
    struct Response: Content {
        let embedded: Embedded
        
        enum CodingKeys: String, CodingKey {
            case embedded = "_embedded"
        }
        
        struct Embedded: Content {
            let data: Conversation.Response.Data
        }
        
        struct Data: Content {
            let conversations: [Conv]
        }
        
        struct Conv: Content {
            let id: String
            let displayName: String
            
            enum CodingKeys: String, CodingKey {
                case id
                case displayName = "display_name"
            }
        }
    }
}
...
```
Then create a new route in the `routes` function:

```swift
...
app.get("rooms") { req -> EventLoopFuture<[Conversation.Response.Conv]> in
    return req.client.get(URI(scheme: "https", host: "api.nexmo.com", path: "v0.2/conversations")) { req in
        req.headers.add(name: .authorization, value: "Bearer \(auth.adminJWT)")
    }.map { response -> [Conversation.Response.Conv] in
        let responseBody = try! response.content.decode(Conversation.Response.self)
        return responseBody.embedded.data.conversations
    }
}
...
```
Much like the previous call made to the Conversation API, an `authorization` header is added to the request. The response is then transformed into the expected return type for the application. 

## Creating a Conversation

The iOS application needs to create new conversations/rooms. To create a new conversation for your Vonage application, you can call `/v0.2/conversations`. Add a `Body` struct to the `Conversation` struct in the `APIModels` file:

```swift
struct Conversation: Content {
    ...
    struct Body: Content {
        let name: String = UUID().uuidString
        let displayName: String
        let imageURL: String = "https://example.com/image.png"
        let properties: [String: Int] = ["ttl": 300]
        
        enum CodingKeys: String, CodingKey {
            case name, properties
            case displayName = "display_name"
            case imageURL = "image_url"
        }
    }
}
```
Default values have been supplied again for the purpose of the tutorial. Names of conversations in the Conversation API have to be unique, so a random UUID is used. Then create a new route in the `routes` function:

```swift
...
app.post("rooms") { req -> EventLoopFuture<IDResponse> in
    let conversationBody = try req.content.decode(Conversation.Body.self)
    return req.client.post(URI(scheme: "https", host: "api.nexmo.com", path: "v0.1/conversations")) { req in
        req.headers.add(name: .authorization, value: "Bearer \(auth.adminJWT)")
        try req.content.encode(conversationBody, as: .json)
    }.map { response -> IDResponse in
        let responseBody = try! response.content.decode(IDResponse.self)
        return responseBody
    }
}
...
```

## Test the Server

Now that your routes are defined, you can build and run (CMD + R). Once complete, your server will be running locally on port 8080. To expose this to the internet, you can use ngrok. In your terminal run `ngrok http 8080`. Ngrok will generate a public URL which forwards calls to your local machine.

![ngrok running on port 8080](ngrok.png)

The ngrok URL is what the iOS application will use to communicate with the server. You can test the endpoints you created using an API tool such as Postman, Rested or [Hoppscotch](https://hoppscotch.io):

+ POST `/auth`:

![Hoppscotch output of a call to /auth](auth.png)

+ POST `/rooms`:

![Hoppscotch output of a post call to /rooms](rooms-1.png)

+ GET `/rooms`:

![Hoppscotch output of a get call to /rooms](rooms-2.png)

## What Next?

The [second part](LINKHERE) of the tutorial will build a drop-in audio iOS application, with SwiftUI and the Client SDK, which uses the server you have just created.

![Image of the completed iOS application](LINKHERE)

You can find the completed project on [GitHub](https://github.com/nexmo-community/swift-vapor-drop-in-audio). Learn more about the Conversation API on [developer.nexmo.com](https://developer.nexmo.com/conversation/overview), and Vapor on [vapor.codes](https://vapor.codes). Additional Vapor materials can be found on [raywenderlich.com](https://www.raywenderlich.com/server-side-swift)