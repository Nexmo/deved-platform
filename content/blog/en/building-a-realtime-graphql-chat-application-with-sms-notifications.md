---
title: Building a Realtime GraphQL Chat Application With SMS Notifications
description: Learn how to develop a chat application powered by Next.js and
  Apollo on the frontend, and Prisma 2, Graphql-yoga, and Vonage's SMS API on
  the backend.
thumbnail: /content/blog/building-a-realtime-graphql-chat-application-with-sms-notifications/nextjs_prisma-2_graphql_sms-1200x600.png
author: temiloluwa-ojo
published: true
published_at: 2021-02-25T14:46:31.233Z
updated_at: 2021-02-25T14:46:31.266Z
category: tutorial
tags:
  - sms-api
comments: true
spotlight: true
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
With the emergence of [GraphQL](https://graphql.org/) came a new way for developers to develop client/server applications. The benefits of developing GraphQL applications are numerous, from explicitly requesting what you need from the server to real-time event-driven communication through subscription. This article highlights code-first GraphQL and its superpowers. The article will also outline how to develop a chat application powered by [Next.js](https://nextjs.org/) and [Apollo](https://www.apollographql.com/) on the frontend, and [Prisma 2](https://www.prisma.io/blog/prisma-2-beta-b7bcl0gd8d8e), [Graphql-yoga](https://github.com/prisma-labs/graphql-yoga/blob/master/README.md) and SMS notification using the excellent [Vonage SMS API](https://www.vonage.com/communications-apis/sms/) on the backend.

## Code-First GraphQL

Code-first GraphQL is an approach to developing GraphQL servers by writing your resolvers and outsourcing the schema definition to be generated programmatically. It’s often referred to as the resolver first approach. The generation of the schema is handled by a tool that traverses your resolvers and generates the schema. Schema first is the opposite of code-first-approach, and it involves defining the types, response etc., of your server. 

## Backend Development

We’ll be building a real-time chat application with SMS notifications.

To start, clone this [repository](https://github.com/themmyloluwaa/nextjs-graphql-prisma-starter). It contains the basic setup you need to follow along with this article. 

#### Prerequisites

* Node.js >=10.0.0
* Previous understanding of Prisma
* Understanding of GraphQL
* A database, e.g. MySQL
* Prisma CLI
* A Vonage Account

<sign-up></sign-up>

Now, let’s understand the project directory.

There are two folders contained in the root directory. The backend directory contains A Prisma folder that holds the Prisma configuration. There's a schema.prisma file in the Prisma folder that includes the database setup configuration and an SQLite db called dev.db. Navigate to the backend directory and run **`npm install`** to install all the necessary dependencies. 

Also, create a .env file in the backend directory; this would contain the necessary environmental variables like database URL and variables and all that. For the database URL, paste this in the env file: 

```javascript
DATABASE_URL="file:./dev.db"
```

The pages directory in the frontend folder is where Next.js will serve the pages of the application. The pages directory contains an _app.js that’s been set up to work with Bootstrap. Navigate to the frontend directory and run `npm install`. This folder also includes an src directory with assets, components and utils subdirectories. 

Next, navigate to the prisma/schema.prisma file. We need two models, one for User and one for Chat. Below is the generator client configuration: 

```javascript
model  User {

id Int  @id  @default(autoincrement())
name String
email String?  @unique
password String
phone String  @unique
isAdmin Boolean  @default(false)
messages Chat[]
createdAt DateTime  @default(now())
updatedAt DateTime  @default(now())
Chat Chat[]  @relation("RecieverOfChat")
}

model  Chat {
id Int  @id  @default(autoincrement())
receiverId Int
receiver User  @relation("RecieverOfChat", fields: [receiverId], references: [id])
sender User  @relation(fields: [senderId], references: [id])
senderId Int
message String
createdAt DateTime  @default(now())
updatedAt DateTime  @default(now())
}
```

The model represents the table name that will be created in the database, while the fields represent column names and the data types that will be stored there. In addition to the data types available in Prisma, a model can also be a data type. This is what defines the relationship between two or more models or a self-relationship for a model. We annotate each model with Prisma keywords. If you don't understand the keywords used, please consult the Prisma [documentation](https://www.prisma.io/docs/concepts).

Run `prisma migrate save --experimental`. Name your migration and run `prisma migrate up --experimental`. The command will create the tables based on the model definitions in the schema. Lastly, run `prisma generate` to expose the database schema mapped to Prisma methods and features that enable CRUD functionalities.

Navigate to the **src/types** directory and create a User and Chat file. Four files already exist, Mutation.js, Query.js, Subscription.js and an index.js file that combines all the resolvers as one. 

In the User.js file, add:

```javascript
const { objectType } = require("@nexus/schema");

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.phone();
    t.model.isAdmin();
    t.model.messages();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

module.exports = {
  User,
};
```

In the Chat.js file, add:

```javascript
const { objectType } = require("@nexus/schema");

const Chat = objectType({
  name: "Chat",
  definition(t) {
    t.model.id();
    t.model.receiver();
    t.model.sender();
    t.model.message();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

module.exports = {
  Chat,
};
```

We import an ***objectType*** from nexus because the User and Chat model are of type object. We access the fields we defined in our schema using the model method and the name of the field. This is made possible through the ***nexus-plugin-prisma*** we installed. This helps us cut through the need to start defining each field one by one and configuring it. The code below is an example of doing the configuration manually:

```javascript
t.id("id", { description: "The ID (Primary Key) of the table or model" });
   t.string("name");
   t.boolean("isAdmin");
   // ... the rest
```

In the mutation file, let’s handle the login and signup. Create a new file in the src/types directory called **AuthPayload.js**. This is an object type that represents what authentication payload type would return to the client.

In AuthPayload.js, add:

```javascript
const { objectType } = require("@nexus/schema'");
 
const AuthPayload = objectType({
 name: "AuthPayload",
 definition(t) {
   t.string("token");
   t.field("user", { type: "User" });
 },
});
 
module.exports = { AuthPayload };
```

In the src/utils directory, create a helper.js file and make these methods. 

```javascript
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getUserId = async (ctx) => {
  let Authorization = ctx.request
    ? ctx.request.get("Authorization")
    : ctx.connection.context.Authorization;

  if (Authorization === undefined && ctx.connection) {
    Authorization = ctx.connection.context.headers.Authorization;
  } else if (Authorization === undefined && ctx.request.cookies) {
    Authorization = ctx.request.cookies.token;
  } else {
    // it means no authorization header was sent
  }

  if (Authorization) {
    const token = Authorization.replace("Bearer", "");
    return token.length === 0
      ? null
      : jwt.verify(token.trim(), process.env.JWT_SECRET).userId;
  }
  return null;
};

const genToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "364 days",
  });
};

const hashPassword = password => {
  if (password.length < 6) {
    throw new Error("Password must be 8 characters or longer");
  }

  return bcrypt.hash(password, Number(process.env.SALTROUND));
};

module.exports = {
  getUserId,
  genToken,
  hashPassword,
};
```

**NOTE**: By now you should have environmental variables set in your .env file for these methods. 

Now, we have a way to get the user’s ID using a getUser method. Let’s modify the script.js file. Import the getUser method from src/utils/helpers and uncomment this part of the context method on the server configuration file.

```javascript
 // const userId = getUserId(sConfig);
    // const user = await prisma.user.findOne({ where: { id: Number(userId) } });
    // if (user) {
    //   data.user = user;
    // }
```

In mutation.js file, add the code for signing up:

```javascript
const { idArg, mutationType, stringArg, booleanArg } = require("@nexus/schema");
const { compare } = require("bcryptjs");
const { genToken, hashPassword } = require("../utils/helpers");
 
 
const Mutation = mutationType({
 definition(t) {
   t.field("signup", {
     type: "AuthPayload",
     args: {
       name: stringArg({nullable:false}),
       email: stringArg({ nullable: true }),
       password: stringArg({nullable:false}),
       phone: stringArg({nullable:false}),
       isAdmin: booleanArg({ nullable: true, default: false }),
     },
     resolve: async (parent, args, ctx) => {
       const emailAddress = args.email ? args.email.toLowerCase() :""
 
       const existingUser = await ctx.prisma.user.findFirst({
         where: {
           OR: [
             {
               email: emailAddress,
             },
             {
               phone: args.phone,
             },
           ],
         },
       });
 
       if (existingUser) {
         if (existingUser.email.toLowerCase() === emailAddress) {
           throw new Error("A user with this email address currently exist");
         } else {
           throw new Error("A user with this phone number currently exist");
         }
       }
 
       const hashedPassword = await hashPassword(args.password);
       let token;
 
       let user = await ctx.prisma.user.create({
         data: {
           ...args,
           password: hashedPassword,
           email: emailAddress,
         },
       });
 
       token = genToken(user.id);
	 ctx.sConfig.response.cookie("token", token, {
         maxAge: 1000 * 60 * 60 * 24 * 365,
         path: "/",
         sameSite: "none",
         secure: true,
       });
 
       return {
         token,
         user,
       };
     },
   });  
},
});
```

We first check if the database contains a user with the email or phone, we throw an error if the user exists, else we create the user, generate a token using the user’s id and set the token as a cookie. We also return the signup payload.

Add the following to login.js, just below the signup resolver:

```javascript
t.field("login", {
   type: "AuthPayload",
      args: {
        username: stringArg({ nullable: false }),
        password: stringArg(),
      },
      resolve: async (parent, { username, password }, ctx) => {
        
        const user = await ctx.prisma.user.findFirst({
          where: {
            OR: [
              {
                email: username,
              },
              {
                phone: username,
              },
            ],
          },
        });
 
     if (!user) {
       throw new Error("Invalid login credentials provided");
     }
     const passwordValid = await compare(password, user.password);
     if (!passwordValid) {
       throw new Error("Invalid password");
     }
     let token;
 
     token = genToken(user.id);
 
	 ctx.sConfig.response.cookie("token", token, {
         maxAge: 1000 * 60 * 60 * 24 * 365,
         path: "/",
         sameSite: "none",
         secure: true,
       });
	
		const textMessage = `Hi ${user.name}. Just confirming that this is you. If it's not, please reset your password immediately. `;

        await ctx.vonage.message.sendSms(
          process.env.ADMIN_PHONE,
          user.phone,
          textMessage,
          {
            type: "unicode",
          },
          (err, response) => {
            if (err) {
              console.log(err);
            } else {
              console.log(response, "eerr");
              if (response.messages[0]["status"] === "0") {
                console.log("Message sent successfully.");
              } else {
                console.log(
                  `Message failed with error: ${response.messages[0]["error-text"]}`
                );
              }
            }
          }
        );
 
     return {
       token,
       user,
     };
   },
 });
```

We verify that the user exists, validate their login credentials, set the token as a cookie, and return the auth payload mutation type. We also send them an SMS notification through the Vonage SMS API instance we created in the server configuration. 

To handle SMS notifications to users on the application, I bought a virtual number from Vonage. You should follow this [article](https://learn.vonage.com/blog/2019/09/16/how-to-send-and-receive-sms-messages-with-node-js-and-express-dr) to get started on creating a Vonage SMS application. Once you've created an application, a private key file would be auto-downloaded to your computer. Move this file to the backend directory. You should also have an ADMIN_PHONE environmental variable set in your .env file, the virtual number I bought from the Vonage account. 

Proceed to **types/index.js file** and comment out the Query and Subscription imports as we don't have anything there. For now, import your User.js and Chat.js file.

Let's add a Query resolver to allow a user to query for their account details. In Query.js, add:

```javascript
const  Query  =  queryType({
definition(t) {
    t.field("myAccount", {
      type: "User",
      resolve: async (parent, args, ctx) => {
        const myAccount = ctx.user;

        if (!myAccount) {
          throw new Error(
            "You are not logged in. Please login to view your account information"
          );
        }

        return myAccount;
      },
    });
   }
})
```

Because we’ve handled querying for the user on every request we receive in the context field of the server configuration, we can access the user if they exist on the ctx object. If the user does not exist on the ctx object, it means the user needs to log in. In the types/index.js file, uncomment the imported Query.js file.

Let’s create two more query resolvers; One to query one user and one to query multiple users. We’d be using nexus-plugin-prisma crud functionalities; this is an experimental feature, so we need to turn it on. In the **script.js** file, in the plugins field, add `{experimentalCRUD: true}` to the nexusPrisma function if it's not added.

In Query.js, add:

```javascript
   t.crud.user();
   t.crud.users({
     ordering: true,
     filtering: true,
     pagination: true,
   });
```

To use this functionality, ensure you named your schema models in singular like **User** and not **Users**. Let’s also use this feature to handle the update one user and delete one user resolvers in the mutation file. 

```javascript
   t.crud.updateOneUser({
     alias:"updateUser"
   })
 
   t.crud.deleteOneUser({
     alias:"deleteUser"
   })
```

Let's handle the Chat resolvers now. Let’s also add two more files, one called Subscription.js and the other SubscriptionPayload. Add both files to your list of types (resolvers) in the index.js file.

**`SubscriptionPayload.js`**

```javascript
const { objectType } = require("@nexus/schema");
 
const SubscriptionPayload = objectType({
 name: "SubscriptionPayload",
 definition(t) {
   t.field("message", { type: "Chat" });
   t.field("mutation", { type: "String" });
 }
});
 
module.exports = { SubscriptionPayload };
```

To handle subscriptions, we'd be making use of the **PubSub** method that comes with the Graphql-yoga package.

First, let's create CRUD functionalities for a chat to which the subscription resolver would listen for these CRUD events. Let's also make a sendNewMessageNotification function to handle sending notifications to chat recipients anytime the previous conversations between them are less than an hour ago. 

In helper.js file, add:

```javascript
const sendNewMessageNotification = async (lastMessage, vonage) => {
  const oneHour = 60 * 60 * 1000;
  const messageTime = new Date(lastMessage.createdAt);

  const anHourAgo = Date.now() - oneHour;

  if (messageTime.getTime() < anHourAgo) {
    const textMessage = `Hi ${lastMessage.receiver.name}. You have a new message from ${lastMessage.sender.name}. Login to your account to continue chatting with them.`;
    
    await vonage.message.sendSms(
      "AWESOME CHAT APP",
      lastMessage.receiver.phone,
      textMessage,
      {
        type: "unicode",
      },
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response, "eerr");
          if (response.messages[0]["status"] === "0") {
            console.log("Message sent successfully.");
          } else {
            console.log(
              `Message failed with error: ${response.messages[0]["error-text"]}`
            );
          }
        }
      }
    );
  }
};
```

This method checks that the last message sent is less than 1 hour. If it is, we send the recipient of the message an SMS notification, and if not, we do nothing. 
Export the sendNewMessageNotification method and import it in the Mutation.js file. Let's now handle the createChat resolver.

In Mutation.js, add:

```javascript
 t.field("createChat", {
      type: "Chat",
      args: {
        receiverId: intArg({ nullable: false }),
        message: stringArg({ nullable: false }),
      },
      resolve: async (parent, { receiverId, message }, ctx) => {
        const sender = ctx.user;

        if (!sender) {
          throw new Error(errorMessage);
        }

        if (message.length === 0) {
          throw new Error("Your message must not be empty");
        }

        const lastsentMessage = await ctx.prisma.chat.findFirst({
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          where: {
            OR: [
              {
                OR: [
                  {
                    senderId: sender.id,
                  },
                  {
                    receiverId,
                  },
                ],
              },
              {
                OR: [
                  {
                    senderId: receiverId,
                  },
                  {
                    receiverId: sender.id,
                  },
                ],
              },
            ],
          },
          include: {
            sender: true,
            receiver: true,
          },
        });
	    const newMessage = await ctx.prisma.chat.create({
          data: {
            message,
            receiver: {
              connect: {
                id: receiverId,
              },
            },
            sender: {
              connect: {
                id: sender.id,
              },
            },
          },
        });

        if (lastsentMessage) {
          await sendNewMessageNotification(lastsentMessage, ctx.vonage);
        }
        await ctx.pubSub.publish("CREATED", {
          Chat: {
            message: newMessage,
            mutation: "CREATED",
          },
          senderId: sender.id,
          receiverId,
        });

        return newMessage;
      },
    });
```

We validate that the sender of the message is logged in by checking that the user object exists on the server, then also validate that the message is not empty. We first query for the last message sent or received by the user then create the new message. If the previous message between them is less than an hour ago, the sendNewMessageNotification method is fired. Lastly, let's handle the subscription aspect.

In Subscription.js, add:

```javascript
const { intArg, subscriptionField } = require("@nexus/schema");

const { withFilter } = require("graphql-yoga");

const mutationType = ["CREATED", "UPDATED", "DELETED"];

const Subscription = subscriptionField("Chat", {
  type: "SubscriptionPayload",
  args: {
    receiverId: intArg({
      nullable: false,
    }),
  },
  description: "Subscription For Chats",
  subscribe: withFilter(
    (parent, args, ctx) => {
      const sender = ctx.user;

      if (!sender) {
        throw new Error("You are not logged in. Please login to your account.");
      }

      args.senderId = sender.id;
      return ctx.pubSub.asyncIterator(mutationType);
    },
    (payload, variables) => {
      if (
        (Number(payload.senderId) === Number(variables.senderId) &&
          Number(payload.receiverId) === Number(variables.receiverId)) ||
        (Number(payload.senderId) === Number(variables.receiverId) &&
          Number(payload.receiverId) === Number(variables.senderId))
      ) {
        return true;
      }

      return false;
    }
  ),
  resolve: async (payload) => {
    const { Chat } = await payload;

    return Chat;
  },
});

module.exports = {
  Subscription,
};
```

We import intArg and subScriptionFIeld objects from nexus/schema, and we also import withFIlter method from the graphql-yoga package— which helps us in ensuring only the right users receive payloads or events. The first argument is the subscribe resolver that returns the asyncIterator we want to filter, and it’s passed the events we want to listen for, i.e. *CREATED, UPDATED, DELETED*. The second argument is the condition that must be met for that event to pass through. For our use case, this event should pass through only to the sender and receiver of the message data. Out of curiosity, comment out that field and test it. You should notice sending a message notifies all users in the application listening for the createChat resolver. 

Now, let’s add updateChat and deleteChat mutations— which is slightly different from creating a chat. First, we need to check that the user is authenticated. Secondly, we have to check that the message exists; lastly, we need to check that it’s the sender of the message that can update or delete it. A user who didn’t send the message should not have access to deleting the message. If these conditions pass, we update or delete the chat then notify our subscribers. 

For the updateChat mutation, add:

```javascript
t.field("updateChat", {
     type: "Chat",
     args: {
       messageId: intArg({ nullable: false }),
       message: stringArg({ nullable: false }),
     },
     resolve: async (parent, { messageId, message }, ctx) => {
       const sender = ctx.user;
 
       if (!sender) {
         throw new Error(
           "You are not logged in. Please login to your account."
         );
       }
 
       const sentMessage = await ctx.prisma.chat.findOne({
         where: {
           id: Number(messageId)
         }
       });
       if (!sentMessage) {
         throw new Error("This message does not exist.");
       }
 
       if (Number(sentMessage.senderId) !== Number(sender.id)) {
         throw new Error("You don't have the permission to delete this message. You can only delete messages created by you.")
       }
 
       const updatedMessage = await ctx.prisma.chat.update({
         where: {
           id: sentMessage.id
         },
         data: {
           message
         }
       });
 
       await ctx.pubSub.publish("UPDATED", {
         Chat: {
           message: updatedMessage,
           mutation: "UPDATED",
         },
         senderId: sender.id,
         receiverId: updatedMessage.receiverId,
       });
 
       return updatedMessage;
     },
   });
```

For the deleteChat mutation, add:

```javascript
t.field("deleteChat", {
     type: "Chat",
     args: {
       messageId: intArg({ nullable: false }),
     },
     resolve: async (parent, { messageId }, ctx) => {
       const sender = ctx.user;
 
       if (!sender) {
         throw new Error(
           "You are not logged in. Please login to your account."
         );
       }
 
       const sentMessage = await ctx.prisma.chat.findOne({
         where: {
           id: Number(messageId)
         }
       });
       if (!sentMessage) {
         throw new Error("This message does not exist.");
       }
 
       if (Number(sentMessage.senderId) !== Number(sender.id)) {
         throw new Error("You don't have the permission to delete this message. You can only delete messages created by you.")
       }
 
       const deletedMessage = await ctx.prisma.chat.delete({
         where: {
           id: sentMessage.id
         }
       });
 
       await ctx.pubSub.publish("DELETED", {
         Chat: {
           message: deletedMessage,
           mutation: "DELETED",
         },
         senderId: sender.id,
         receiverId : deletedMessage.receiverId,
       });
 
       return deletedMessage;
     },
   });
```

Now let’s take advantage of the CRUD functionality for the chat and chats query. In the Query.js file, add:

```javascript
	t.crud.chat();
    t.crud.chats({
     ordering: true,
     filtering: true,
     pagination: true,
   });
```

We've been working on the mutation, query, and subscription aspects of the application. We've created low-level permissions and authorisation mechanisms to ensure some features of the application are secure, but now it's time to protect our API.  Let’s work on the permissions. 

Ideally, we don’t want to make all features in the application private or inaccessible to non-authenticated users. We also don’t want to make everything accessible, so how do we solve this?

For now, we’ll make queries for the user list accessible to non-authenticated users while other features would be protected. We’ll also be adding extra permissions for some resolvers to ensure that only admins can perform certain operations like deletion of a user. Let’s get started. We’ll be making use of Graphql-shield. Here’s a good [tutorial](https://medium.com/@maticzav/graphql-shield-9d1e02520e35) that covers the basics of Graphql-shield. 

In permissions/rules.js, add:

```javascript
const { rule } = require("graphql-shield");

const errorMessage = "You are not logged in, please login to your account";
const rules = {
  isAuthenticatedUser: rule({ cache: "contextual" })(
    async (parent, args, ctx) => {
      const loggedInUser = ctx.user;

      if (!loggedInUser) {
        return new Error(errorMessage);
      }
      return true;
    }
  ),
  isAdmin: rule({ cache: "contextual" })(async (parent, args, ctx) => {
    const loggedInUser = ctx.user;

    if (!loggedInUser) {
      return new Error(errorMessage);
    }
    if (!loggedInUser.isAdmin) {
      return new Error(
        "You don't have the right permission to make this request"
      );
    }
    return loggedInUser.isAdmin;
  }),
  isChatOwner: rule({ cache: "strict" })(async (parent, args, ctx) => {
    const loggedInUser = ctx.user;

    if (!loggedInUser) {
      return new Error(errorMessage);
    }

    const chatOwner = await ctx.prisma.chat
      .findOne({
        where: {
          id: Number(args.messageId),
        },
      })
      .sender();

    if (chatOwner.id !== loggedInUser.id) {
      return new Error(
        "You don't have the right permission to make this request. "
      );
    }
    return true;
  }),
};

module.exports = rules;
```

Then in the permissions/index.js file, we apply our rules define to each of our resolvers.

```javascript
const { shield, or } = require("graphql-shield");
const rules = require("./rules");

const permissions = shield(
  {
    Query: {
      myAccount: rules.isAuthenticatedUser,
      user: or(rules.isAuthenticatedUser, rules.isAdmin),
      chat: or(rules.isAuthenticatedUser, rules.isAdmin),
      chats: or(rules.isAuthenticatedUser, rules.isAdmin),
    },
    Mutation: {
      updateUser: or(rules.isAuthenticatedUser, rules.isAdmin),
      deleteUser: rules.isAdmin,
      createChat: rules.isAuthenticatedUser,
      updateChat: or(rules.isAdmin, rules.isChatOwner),
      deleteChat: or(rules.isAdmin, rules.isChatOwner),
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
```

Lastly, in the server configuration file of script.js, uncomment the middleware field to turn on the permissions.

## Frontend Development

The GitHub repository already comes with the needed packages and default setup needed to code along. Run **`npm i`** to install the dependencies required. 

Navigate to the pages folder and create a login, signup.js and index.js file.

Now, let's work on users signing in and signing up. 
Before we proceed, let's create a Layout.js file to wrap our pages with reusable functionalities like site title, favicon etc.

In the components folder, create a Layout.js file.

```javascript
import Head from "next/head";
import { Nav, Navbar } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";

	export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    document.cookie = `user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    Router.replace("/login");
	  };

const Layout = (props) => {
  const {
    title = "Awesome Web App",
    navHidden = false,
    height = "100vh",
  } = props;
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        />
        <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="/assets/img/logo.png"
          type="image/png"
          sizes="16x16"
        />
        <title>{title}</title>
      </Head>

      {!navHidden && (
        <header>
          <Navbar bg="dark" expand="lg" className="mb-40">
            <Navbar.Brand href="#home">
              <Image
                src="/assets/img/logo.png"
                width="100"
                height="100"
                className="d-inline-block align-top"
                alt=""
              />
            </Navbar.Brand>
            <Nav className="mr-auto flex-row">
              <Link href="/">
                <a className="text-white mr-2 nav-link">Home</a>
              </Link>
              <Link href="/profile">
                <a className="text-white mr-2">Profile</a>
              </Link>
              <Nav.Link className="text-white" onClick={(e) => logout()}>
                Logout
              </Nav.Link>
            </Nav>
          </Navbar>
        </header>
      )}
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height,
          position: "relative",
          flex: 1,
        }}
      >
        {props.children}
      </main>
    </>
  );
};
export default Layout;
```

In login.js, add:

```javascript
import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import Mutation from "../src/gql/Mutation";
import { setToken } from "../src/utils/tokenUtils";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { getToken } from "../src/utils/tokenUtils";

const Login = (props) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const redirectTo = router.query?.redirectTo ?? "/";
  const [login, { loading, error }] = useMutation(Mutation.login, {
    variables: {
      password,
      username,
    },
    errorPolicy: "all",
    onCompleted({ login }) {
      if (login) {
        setToken(login);
        setUsername("");
        setPassword("");
        router.push(redirectTo);
      }
    },
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };
  return (
    <Layout navHidden={true}>
      <Row>
        <Col sm="12">
          <Row className="align-items-center m-h-100">
            <Col sm="8" className="mx-auto">
              <div className="pb-2 text-center">
                <h4 className=" d-block">Awesome Chat App</h4>
              </div>
              <h5 className="text-center fw-400 p-b-20">Login</h5>
              <Form method="post" onSubmit={(e) => handleSubmit(e)}>
                <Form.Row>
                  <Form.Group as={Col} md="12" controlId="validationCustom01">
                    <Form.Control
                      required
                      size="lg"
                      type="text"
                      value={username}
                      placeholder="phone or email"
                      required
                      isInvalid={Boolean(error && error.message)}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="12" controlId="validationCustom02">
                    <Form.Control
                      required
                      size="lg"
                      type="password"
                      placeholder="password"
                      value={password}
                      isInvalid={Boolean(error && error.message)}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                      {error && error.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <button
                    type="submit"
                    className="col-md-12 mb-3 btn btn-danger"
                    size="lg"
                  >
                    {loading ? "Logging you in" : "Login"}
                  </button>
                </Form.Row>
              </Form>
              <Row>
                <Col>
                  <Link href="/signup">
                    <a href="#!" className="text-underline">
                      Create Account?
                    </a>
                  </Link>
                </Col>
                <Col>
                  <a href="#!" className=" float-right text-underline">
                    Forgot Password?
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const token = getToken(context);

  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}
export default Login;
```

In the getServerSideProps, we check that the token exists. If the token exists, it means the user hasn't logged in, and we redirect the user to the home page. If the token doesn't exist, we proceed. Required imports like setToken, Mutation and useMutation are imported. We define a basic UI for logging in and providing a username and password field. This username accepts an email or phone number. If we get a successful response from the server, we set the token and navigate the user to the required URL defined in the `redirecTo` variable. Else, if the login credentials are incorrect, we show this message to the user. If you don't understand how the useMutation hook works, please read the Apollo client documentation [here](https://www.apollographql.com/docs/react/data/mutations/). 

In Signup.js, add:

```javascript
import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import Mutation from "../src/gql/Mutation";
import { setToken } from "../src/utils/tokenUtils";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../src/components/Layout";

const SignUp = (props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [signup, { loading, error }] = useMutation(Mutation.signup, {
    variables: {
      email,
      phone,
      password,
      name,
    },
    errorPolicy: "all",
    onCompleted({ signup }) {
      if (signup) {
        setToken(signup);
        setEmail("");
        setName("");
        setPhone("");
        setPassword("");
        router.push(`/`);
      }
    },
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    signup();
  };

  return (
    <Layout navHidden={true}>
      <Row className="align-items-center m-h-100">
        <Col sm="8" className="mx-auto">
          <div className="pb-2 text-center">
            <h4 className=" d-block">Awesome Chat App</h4>
          </div>
          <h5 className="text-center fw-400 p-b-20">Signup</h5>
          <Form method="post" onSubmit={(e) => handleSubmit(e)}>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="validationCustom01">
                <Form.Control
                  required
                  size="lg"
                  type="text"
                  value={name}
                  placeholder="Full Name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  isInvalid={Boolean(error && error.message)}
                />
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="validationCustom02">
                <Form.Control
                  required
                  size="lg"
                  type="text"
                  value={phone}
                  required
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  isInvalid={Boolean(error && error.message)}
                />
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="validationCustom03">
                <Form.Control
                  size="lg"
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  isInvalid={Boolean(error && error.message)}
                />
              </Form.Group>

              <Form.Group as={Col} md="12" controlId="validationCustom04">
                <Form.Control
                  required
                  size="lg"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  isInvalid={Boolean(error && error.message)}
                />

                <Form.Control.Feedback type={"invalid"}>
                  {error && error.message}
                </Form.Control.Feedback>
              </Form.Group>

              <button
                type="submit"
                className="col-md-12 mb-3 btn btn-danger"
                size="lg"
              >
                {loading ? "Signing you up..." : "Signup"}
              </button>
            </Form.Row>
          </Form>
          <Row>
            <Col className=" text-center">
              <Link href="/login">
                <a href="#!" className="text-underline">
                  Have an account? Sign In.
                </a>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};
export default SignUp;
```

Now, navigate to your browser and test logging in and signing up.

Next, create an index.js and chat.js file. In index.js, add:

```javascript
import { useState, useMemo } from "react";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../src/components/Layout";
import Query from "../src/gql/Query";
import { initializeApollo } from "../src/utils/apolloClient";
import Link from "next/link";
import cookies from "next-cookies";
import { getToken } from "../src/utils/tokenUtils";

const UserPage = (props) => {
  const [users] = useState(props.users);
  const [search, setSearch] = useState("");

  const searchableUsers = users.filter((user) => {
    return (
      user?.name?.toLowerCase().includes(search) ||
      user?.email?.toLowerCase().includes(search) ||
      user?.phone?.toLowerCase().includes(search)
    );
  });

  const memoizedUsers = useMemo(() => {
    return searchableUsers.map(
      (user, i) => {
        return (
          <Row className="border-bottom mb-2" key={i}>
            <Col xs="8">
              <p>{user.name}</p>
            </Col>
            <Col xs="4">
              <Link href={`/chat?receiverId=${user.id}`}>
                <a className="btn btn-link">Start chatting</a>
              </Link>
            </Col>
          </Row>
        );
      },
      [searchableUsers]
    );
  });

  // View Layer
  return (
    <Layout title="All Users">
      <Card className="md-width">
        <Card.Header className="bg-danger text-white">All Users </Card.Header>
        <Card.Body>
          <Row className="mb-3 pb-2 border-dark border-bottom">
            <input
              type="text"
              className="form-control w-100"
              placeholder="search for a user by name, phone or email address"
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </Row>
          <div className="overflow-auto">{memoizedUsers}</div>
        </Card.Body>
      </Card>
      <style jsx global>
        {`
          .md-width {
            width: 100%;
            height: 600px;
            margin-top: -60px;
            overflow: auto;
          }
          .overflow-auto {
            overflow: auto;
            height: 90%;
          }

          @media (min-width: 768px) {
            .md-width {
              max-width: 800px !important;
              margin-top: -190px;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const token = getToken(context);

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?redirectTo=/",
      },
    };
  }
  const apolloClient = initializeApollo();

  const { data, error } = await apolloClient.query({
    query: Query.users,
  });
  const user = cookies(context).user;

  const users =
    data?.users?.filter((val) => Number(val.id) !== Number(user?.id)) ?? [];

  if (!error) {
    return {
      props: {
        users,
      },
    };
  }

  return {
    props: {
      users: [],
      error,
    },
  };
}
export default UserPage;
```

In the getServerSideProps, we check for the token cookie. If the token doesn't exist, the user is redirected to the login page. If the token exists, the logged-in user is filtered out before returning the data as props. The array filter method is used to handle client-side searching, and the useMemo React hook to memoize the user data to prevent rerendering unnecessarily.

You can find the GraphQL queries used for these pages in the gql folder of the project directory.

Next, create a ChatBubble component in the component folder. We'll be making use of a day.js package to handle message timestamps. Install the package `npm install dayjs` and create a formatDate file in utils. In formatDate.js, add:

```javascript
import dayjs from "dayjs";
import Calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs().format();
dayjs.extend(Calendar);
dayjs.extend(updateLocale);

dayjs().calendar();

export const formateDate = (date = "") => {
  const sameElse = "D/M/YYYY h:mm A";
  const dateStyle = {
    sameElse,
    lastDay: "[Yesterday] h:mm A",
    sameDay: "[Today] h:mm A",
    nextDay: "[Tomorrow] h:mm A",
    lastWeek: sameElse,
    nextWeek: sameElse,
  };

  //   let defaultDate;
  dayjs.updateLocale('en', {
    calendar: dateStyle
  });

  if (!Boolean(date) || date.length === 0) {
    return dayjs().calendar();
  }
  return dayjs(date).calendar();
};
```

Then, in ChatBubble.js, insert:

```javascript
import React from "react";
import { formateDate } from "../utils/dateFormatter";

const ChatBubble = React.forwardRef((props, ref) => {
  const { chat = {} } = props;
  const isMyMessage = props.receiverId !== chat?.sender?.id;
  return (
    <section>
      <div
        style={{
          display: "flex",
          flexDirection: isMyMessage ? "row-reverse" : "row",
        }}
        ref={ref}
      >
        <div className="bubble bubble-bottom-left">
          {chat?.message}
          <p
            className={`${
              isMyMessage ? "text-muted" : ""
            } text-right mt-4 font-small`}
          >
            {formateDate(chat?.createdAt ?? "")}
          </p>
        </div>
      </div>
      <style jsx>
        {`
          .bubble {
            position: relative;
            font-family: sans-serif;
            font-size: 18px;
            line-height: 24px;
            min-width: 200px;
            max-width: 80%;
            background: ${isMyMessage ? "#000" : "#DC3545"};
            opacity: 0.7;
            color: #fff;
            border-radius: 40px;
            padding: 18px;
            text-align: center;
            margin-bottom: 50px;
            min-height: 20px;
          }

          .bubble-bottom-left:before {
            content: "";
            width: 0px;
            height: 0px;
            position: absolute;
            border-left: 24px solid ${isMyMessage ? "#000" : "#DC3545"};
            border-right: 12px solid transparent;
            border-top: 12px solid ${isMyMessage ? "#000" : "#DC3545"};
            border-bottom: 20px solid transparent;
            ${!isMyMessage ? `left: 32px;` : "right: 32px;"}
            bottom: -24px;
          }

          .font-small {
            font-size: 12px;
          }
        `}
      </style>
    </section>
  );
});
export default ChatBubble;
```

Depending on the chat object received, we apply various styles like the direction of the chat bubble if the sender is the currently logged-in user. 

In chat.js, add:

```javascript
import { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import Layout from "../src/components/Layout";
import Query from "../src/gql/Query";
import Mutation from "../src/gql/Mutation";
import Subscription from "../src/gql/Subscription";
import ChatBubble from "../src/components/ChatBubble";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { getToken } from "../src/utils/tokenUtils";
import cookies from "next-cookies";

const ChatPage = (props) => {
  const router = useRouter();
  const myRef = useRef(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const receiverId = Number(router.query?.receiverId);

  const { subscribeToMore, data, loading } = useQuery(Query.chats, {
    variables: {
      senderId: Number(props?.user?.id),
      receiverId,
    },
  });

  const [createChat] = useMutation(Mutation.createChat);

  // subscription hook
  useEffect(() => {
    subscribeToMore({
      document: Subscription.chats,
      variables: {
        receiverId: Number(router.query?.receiverId),
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newMessage = subscriptionData.data.Chat.message;
        return {
          chats: [...prev.chats, newMessage],
        };
      },
    });
  }, []);

  // scroll to bottom hook
  useEffect(() => {
    if (myRef) {
      myRef?.current?.scrollIntoView();
    }
  }, [data?.chats, myRef]);

  if (loading) {
    return <div>loading</div>;
  } else {
    const searchableChats =
      data?.chats?.filter((chat) => {
        return chat?.message.includes(search);
      }) ?? [];

    //   profile of the receiver
    const receiverProfile = data?.chats.find(
      (chat) => Number(chat.receiver.id) === receiverId
    );

    // View Layer
    return (
      <Layout title={`Chatting with: ${receiverProfile.receiver.name} `}>
        <Card className="md-width border-bottom-0">
          <Card.Header className="py-4 bg-danger text-white">
            Chatting with: {receiverProfile.receiver.name}
          </Card.Header>
          <Card.Body>
            <Row className="mb-3 pb-2 border-dark border-bottom">
              <input
                type="text"
                className="form-control w-100"
                placeholder="search for chat..."
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </Row>
            <Row className="overflow-auto">
              {searchableChats.map((chat, i) => {
                return (
                  <Col xs="12" key={i}>
                    <ChatBubble
                      chat={chat}
                      receiverId={receiverId}
                      ref={myRef}
                    />
                  </Col>
                );
              })}
            </Row>
            <Row className="chat-message clearfix">
              <Col xs="12" md="10">
                <div>
                  <textarea
                    name="message-to-send"
                    value={message}
                    id="message-to-send"
                    placeholder="Type your message"
                    rows="3"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        createChat({
                          variables: {
                            message,
                            receiverId,
                          },
                        });
                        setMessage("");
                      }
                    }}
                  />
                </div>
              </Col>
              <Col md="2" className="align-self-center">
                <Button
                  size="lg"
                  variant="danger"
                  onClick={(e) => {
                    createChat({
                      variables: {
                        message,
                        receiverId,
                      },
                    });
                    setMessage("");
                  }}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <style jsx global>
          {`
            .md-width {
              width: 100%;
              height: 600px;
              margin-top: -60px;
            }
            .overflow-auto {
              overflow: auto;
              height: 90%;
            }

            @media (min-width: 768px) {
              .md-width {
                max-width: 800px !important;
                margin-top: -190px;
              }
            }

            .chat-message textarea {
              width: 100%;
              padding: 10px 20px;
              font: 14px/22px "Lato", Arial, sans-serif;
              margin-bottom: 10px;
              border-radius: 5px;
              resize: none;
              margin-top: 10px;
            }

            .chat-message button:hover {
              color: #75b1e8;
            }
          `}
        </style>
      </Layout>
    );
  }
};

export async function getServerSideProps(context) {
  const token = getToken(context);

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?redirectTo=chat?receiverId=${context.query.receiverId}`,
      },
    };
  }

  const user = cookies(context).user;
  return {
    props: {
      user,
    },
  };
}
export default ChatPage;
```

So let's understand what's going on here. We first check that a token cookie exists. If it doesn't exist, we redirect the user to the login page and pass the chat page as a redirectTo function. If a token exists, the user object payload gets added to the prop, and the chat data is fetched on the client using the useQuery hook. This gives us access to a method called `subscribeToMore` which we call in `useEffect` hook to handle subscribing to more messages to receive the updates instantly. The `subscribeToMore` method accepts the subscription query, the variables needed, and an updateQuery method that tells it how to handle the new message received. For more information on how this works, the [documentation](https://www.apollographql.com/docs/react/data/subscriptions/#usesubscription-api-reference) has a useful guide. The useMutation hook handles creating a new message. 

Now, let's work on a profile page where the user can view and update their profile before we handle deployment to the cloud. 

To start, create profile.js file. Then add the following to it:

```javascript
import { useState } from "react";
import { Card, Form, Toast } from "react-bootstrap";
import Layout, { logout } from "../src/components/Layout";
import Mutation from "../src/gql/Mutation";
import cookies from "next-cookies";
import { getToken } from "../src/utils/tokenUtils";
import { useMutation } from "@apollo/client";

const ToastComponent = (props) => {
  return (
    <Toast
      style={{
        minHeight: "100px",
        minWidth: "300px",
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1,
        marginRight: 40,
      }}
    >
      <Toast.Header>
        <img
          src="/assets/img/logo.png"
          width="60"
          className="rounded mr-2"
          alt=""
        />
        <strong className="mr-auto">{props.type}</strong>
      </Toast.Header>
      <Toast.Body>{props.message}</Toast.Body>
    </Toast>
  );
};

const ProfilePage = (props) => {
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email);
  const [phone] = useState(props.user.phone);
  const [disabled, setDisabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [updateUser, { error }] = useMutation(Mutation.updateUser, {
    variables: {
      name: {
        set: name,
      },
      phone: {
        set: phone,
      },
      email: {
        set: email,
      },
      id: props.user.id,
    },
    errorPolicy: "all",
    onCompleted({ updateUser }) {
      if (updateUser) {
        setShowToast(!showToast);

        setTimeout(() => {
          logout();
        }, 1300);
      }
    },
  });

  // View Layer
  return (
    <div className="position-relative">
      {showToast && (
        <ToastComponent
          type={error ? "Error" : "Success"}
          message={
            error
              ? error.message
              : "Updated Sucessfully, you would be redirected to the login page"
          }
        />
      )}
      <Layout title={`${props.user.name}'s profle`}>
        <Form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
          <Card className="md-width">
            <Card.Header className="bg-danger text-white">
              <p>
                Once you change your details, you would be redirected to the
                login page to login with your new credentials.
              </p>
            </Card.Header>
            <Card.Body>
              <fieldset disabled={disabled}>
                <Form.Row>
                  <Form.Group className="w-100">
                    <Form.Control
                      defaultValue={name}
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group className="w-100">
                    <Form.Control
                      defaultValue={email}
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required={Boolean(email)}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group className="w-100">
                    <Form.Control defaultValue={phone} name="phone" readOnly />
                  </Form.Group>
                </Form.Row>
              </fieldset>
              <Form.Group className="text-center">
                <a
                  className="btn btn-link text-danger px-3 mx-3"
                  onClick={(e) => setDisabled(!disabled)}
                >
                  Edit
                </a>
                <button
                  className="btn btn-success  px-3"
                  type="submit"
                  disabled={disabled}
                  onClick={(e) => setDisabled(false)}
                >
                  Save
                </button>
              </Form.Group>
            </Card.Body>
          </Card>
        </Form>

        <style jsx global>
          {`
            .md-width {
              width: 100%;
              min-height: 300px;
              margin-top: -60px;
              overflow: auto;
            }

            @media (min-width: 768px) {
              .md-width {
                max-width: 400px !important;
                margin-top: -190px;
              }
            }
          `}
        </style>
      </Layout>
    </div>
  );
};

export async function getServerSideProps(context) {
  const token = getToken(context);

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?redirectTo=/profile",
      },
    };
  }

  const user = cookies(context).user;

  return {
    props: {
      user,
    },
  };
}
export default ProfilePage;
```

We make only the name and email fields editable. If the update is successful, we show the user a toast message and redirect the user to the login page after 1.3 seconds to login with the new credentials. 

## Deployment

We've handled creating the GraphQL server, and we've also developed an application built with NextJS to consume these endpoints. The server APIs are protected, and so are the pages. As we've been developing locally, it’s now time to expose the application to the world. We'll be deploying the server on Heroku and the client app on Vercel. I'll be showing you two ways to deploy the application. One using the command line interface and the second using the Vercel dashboard. Create a Vercel account [here](https://vercel.com/). Create a Heroku account [here](https://www.heroku.com/).

Also, install the Vercel CLI with `npm i -g vercel`. Install the Heroku CLI by following the instructions [here](https://devcenter.heroku.com/articles/heroku-cli).

Create two new branches. One called production/server and another called production/client. Let's work on deploying the server first.

Let's delete the files we don't need to be on production. In the Prisma folder, delete the dev.db file and also the migration folder. We'll be making use of a Postgres database instead for production. We can get a free PostgreSQL database from ElephantSql. Create an [account](https://www.elephantsql.com/) and create a new Postgres database. 
Navigate to the backend directory and copy the database URL and replace it in your .env file. In prisma/schema.prisma file, replace the data source db setup with:

```javascript
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
// rest of the code
```

We have a new database, time to run migrations. Run **`npx prisma migrate save --experimental`** and **`npx prisma migrate up --experimental`**. 

In the terminal, run heroku login and input your credentials. Then, run 
`heroku create < name-of-your-app >`. Let's set the environment variables used by the application. To set a config variable, use the `heroku config:set < name >= < value > -a < namme-of-your-app>` e.g for my SALTROUND variable
**`heroku config:set SALTROUND=10 -a vongage-graphql-api`**

Since our root directory contains both the client and the server code, and Heroku doesn't support subdirectory deployment easily, we'll have to deploy using a different buildpack. Do so by following this article [here](https://medium.com/@timanovsky/heroku-buildpack-to-support-deployment-from-subdirectory-e743c2c838dd). After adding your required config variables, 
run:

* **`heroku buildpacks:clear`**
* **`heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack`**
* **`heroku buildpacks:add heroku/nodejs`**
* **`heroku config:set PROJECT_PATH=Backend`**

Then, add this to your scripts in the package.json file:

`"heroku-postbuild": "npm run postinstall"`

The script we just added ensures that after installing the dependencies for the project, Heroku generates the necessary Prisma database instance. 

Confirm that Heroku is part of the remote repository by running `git remote -v`. If you don't see a remote named Heroku, add it by running `heroku git:remote -a <app-name>`.

Lastly, run git `git push heroku master`. This will push your code and build it. If you run into any issues, ensure you've set all the env variables your application uses and that you follow the instructions carefully. Next, run `heroku apps:open /playground`.

### Frontend

Ensure you've pushed all your changes to GitHub in the production/server branch. Create a new branch from there called production/client and replace the respective Graphql endpoints for the queries and mutation to your production URL. For subscriptions, replace the HTTPS protocol with WSS. Push the changes to GitHub and navigate to your Vercel account. 

In your dashboard, 

* Click import project, copy your GitHub repository link and paste
* Chose the frontend directory as the root directory for your project and a name
* It should automatically detect NextJS as the framework of choice. We're not using any env variable so leave that part empty. Then click deploy.
* Once your project has deployed completely, navigate to the settings tab. In git change the deployment branch from main to production/client. 
* Navigate to your code and make a change to your files, commit it, and push to the production/client branch. It will automatically build your project and start it. 
* Once the deployment is complete, navigate to your Heroku dashboard. In your server application, navigate to the settings tab and change the FRONTEND_ORIGIN URL to the production client URL we just deployed on Vercel. Ensure you don't add a trailing slash to the end of the URL. For example, it should be www.example.com, not www.example.com/
* Voila, we're done. 

## Conclusion

A long article, but I am confident it will be worth trying. To summarize, we've covered how to create a GraphQL server that also works with subscriptions using the code-first approach. We dove into the Vonage SMS API and used it to send SMS notifications to users. We used the fantastic Prisma 2 database ORM to handle the db queries. Not to forget, we consumed the endpoints using Apollo and NextJS. Finally, we deployed on Vercel hosting service and Heroku using the CLI and the GUI. I firmly believe I've armed you with all you need to build that next big idea using these tools. My challenge for you is to take this application to the next level by adding more functionalities like password reset, the addition of friends, posts etc. 

Thank you for taking the time to try this tutorial. If you get stuck, don't hesitate to reach me on Twitter at [@codekagei](https://twitter.com/themmyloluwaaa) or drop a comment. Happy hacking!

Reference the code:

* [Frontend](https://vonage-nextjs-client.vercel.app/login?redirectTo=/)
* [Backend](https://vonage-graphql-server.herokuapp.com/playground)
