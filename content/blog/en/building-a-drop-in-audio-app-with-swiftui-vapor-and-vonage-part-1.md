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
## Introduction

Drop-in audio apps are becoming very popular recently with the likes of Clubhouse, Soapbox, and Twitter spaces taking gaining a lot of traction. This tutorial you will use the [Conversation API](https://developer.nexmo.com/conversation/overview) with the [Client SDK](https://developer.nexmo.com/client-sdk/overview) to build your very own drop-in audio app. The tutorial is split into two parts, the first part will cover the backend server and the [second part](LINKHERE) will cover the iOS application. 

## Prerequisites

+ A Vonage API account. If you don't have one already, you can [sign up today](https://dashboard.nexmo.com/sign-up)

+ Xcode 12 and Swift 5 or greater.

+ [Vapor 4.0](https://vapor.codes) installed on your machine.

+ [Docker for mac](https://docs.docker.com/docker-for-mac/install/) for a local database.

+ [ngrok](https://ngrok.com) for exposing your local machine to the internet.

## Create a Vapor Project

You can create a Vapor project using the new project command `vapor new VaporConvAPI` in your terminal. The terminal will prompt a few times, first asking if you asking whether you would like use Fluent say yes to this and choose Postgres as the database. Next you will be asked if you would like to use Leaf, say no to this. Fluent is an Object–relational mapping framework that you will be using to store User information in the database. Once the command has finished change directory into the folder, it created for you using `cd VaporConvAPI`. 

Next, you can set up the database with Docker by running the following command:

```sh
docker run --name postgres \
  -e POSTGRES_DB=vapor_database \
  -e POSTGRES_USER=vapor_username \
  -e POSTGRES_PASSWORD=vapor_password \
  -p 5432:5432 -d postgres”
```

This command creates a new Docker container called `postgres` using the Docker postgres image, which will be downloaded if you do not already have it, with some default credentials as environment variables. The container in the background as a daemon, you can check if the database is running by running `docker ps`. Once done you can open the project in Xcode using `vapor xcode`.
