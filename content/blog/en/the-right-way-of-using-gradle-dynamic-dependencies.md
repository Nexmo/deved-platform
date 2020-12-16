---
title: The Right Way of Using Gradle Dynamic Dependencies
description: Gradle is a flexible build system that helps with dependency
  management. In this tutorial, we explore the best ways of using Gradle dynamic
  dependencies.
thumbnail: /content/blog/the-right-way-of-using-gradle-dynamic-dependencies/blog_gradle-dynamic-dependencies_1200x600.png
author: igor-wojda
published: true
published_at: 2020-11-04T15:53:38.567Z
updated_at: 2020-11-04T15:53:38.583Z
category: tutorial
tags:
  - Gradle
  - Android
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
[Gradle](https://gradle.org/) is quite a popular and flexible build system. Among other things, it allows us to deal with dependency management. We can define all dependencies (external frameworks and libraries) that our application will use, e.g.

```groovy
dependencies {
    implementation 'com.nexmo.android:client-sdk:2.7.0'
}
```

The above code will download a fixed 2.7.0 version of Nexmo ClientSDK. Before moving to dynamic dependencies, let's take a quick look at semantic versioning.

## Semantic Versioning

Most libraries nowadays follow [Semantic versioning specification](https://semver.org/), also known as semver. It promotes major.minor.patch (2.7.0) format for dependency versioning. Each number is incremented when particular criteria are met:

* `major` part is incremented when backward-incompatible API changes are made. Pulling a new version will most likely break your build, e.g. method signature change or method removal.
* `minor` part is incremented when functionality is added in a backward-compatible manner or improvements are introduced within the private code, e.g. new method is added to the API.
* `patch` part is incremented when backward-compatible bug fixes are made. This is the most common type of release, and usually, we want to have the newest path version due to various bug fixes.

## Dynamic Dependencies

Gradle also allows you to define a dynamic version of the dependency (library) using the `+` character in the dependency definition.

```groovy
dependencies {
    implementation 'com.nexmo.android:client-sdk:2.7.+'
}
```

In the above example, Gradle will download client-sdk with the newest `path` version, eg. 2.7.1, 2.7.2, 2.7.3, and so on. Gradle allows us to define dynamic versions retrieval in multiple ways. Let's look at a few examples:
implementation 'com.nexmo.android:client-sdk:2.7.+' - download new library version when `path` version has changed
implementation 'com.nexmo.android:client-sdk:2.+' - download new library version when `minor` or `path` versions has changed
implementation 'com.nexmo.android:client-sdk:+' - always download newest version of the library

This mechanism is a good way to ensure that we are using a library version with most up to date with all the performance improvements, patches, and bug fixes. However, in practice, the usage of dynamic dependencies may lead to multiple problems. Let's consider a few real-life scenarios where the uses of dynamic dependencies have serious downsides.

## Problematic Scenario 1

Let's start with the simplest scenario. Our application is using dynamic dependency for a 3rd party library. We discovered a bug in our application, and we know that it was working fine 1 month ago. We want to use one or more builds from the past to determine when bugs were introduced in our code base. We checked out code from the repository from one month ago, the moment in time when the application was working fine, and then we built the app, but the application still does not work as expected - the problem is still there. What happened? It turns out that the bug was in the external library. Our src code was from 30 days ago, but the Gradle dynamic dependency mechanism downloaded the newest version of dependency (with the bug) that was not present 1 month ago when the initial build was created (the one without a bug). 

Lesson 1: It is hard to make the same build of the application when dynamic dependencies are used because the build depends on external library versions that most likely change over time.

## Problematic Scenario 2

We are the creators of the library. We asked our users of our library explicitly to use this dynamic dependency:

```groovy
dependencies {
    implementation 'com.nexmo.android:client-sdk:2.7.+’
}
```

They have added this dependency to their project by merely copying the above code. At some point in time, we released a new version of the library that introduces a bug. Now users are reporting that "a few days ago, their application stopped working as expected." Developers used a dynamic dependency version, unaware that the library's new version causes the bug. Instead of quickly fixing the problem by reverting the library version, they send bug reports and wait for the fix.

Lesson 2: Do not advise your library users to use dynamic dependency versions because when you break the library, they will most likely not know the exact cause of the problem.

## Solutions

Modern IDEs like IntelliJ IDEA will warn us about dynamic dependency usage by usage:

![Avoid using plus character](/content/blog/the-right-way-of-using-gradle-dynamic-dependencies/avoid-using-plus-character.png "Avoid using plus character")

To avoid unpredictability, we can specify dependency versions explicitly and update them manually when a need occurs. This will allow you to have full control over version updates and take a closer look at the dependency changelog and review the changes. IDE will also display a warning about outdated dependency and provides intention to change the version it:

![Change dependency version](/content/blog/the-right-way-of-using-gradle-dynamic-dependencies/change-dependency-version.png "Change dependency version")

This strategy works fine for small projects, but manual updates can be time-consuming when your project contains a large number of dependencies. We can use [gradle-versions-plugin](https://github.com/ben-manes/gradle-versions-plugin) to determine how many dependencies need to be updated:

```sh
./gradlew dependencyUpdates
```

The above command will produce a report listing all the outdated dependencies. 

We can also take it one step further to balance deterministic builds and dynamic dependency versioning. [Gradle Dependency Lock Plugin](https://github.com/nebula-plugins/gradle-dependency-lock-plugin) and [Gradle locking feature](https://docs.gradle.org/current/userguide/dependency_locking.html) allows us to use dynamic dependency syntax in the Gradle build config and at the same time lock these dependencies to specific versions (overrides Gradle dynamic dependency behavior). This gives us full control of when dependencies should be updated. 

To update dependencies with `Gradle Dependency Lock Plugin`, we have to run a single command:

```sh
./gradlew --refresh-dependencies generateLock saveLock
```

The above command will generate a `dependencies.lock` file containing versions of dependencies.  

[Gradle locking feature](https://docs.gradle.org/current/userguide/dependency_locking.html) works in a similar way. First, we have to enable locking on configurations:

```groovy
dependencyLocking {
    lockAllConfigurations()
}
```

Then we can generate a dependency locks file:

```sh
./gradlew dependencies --write-locks
```

Lock state will be preserved in a file located in the folder `gradle/dependency-locks` inside the project or subproject directory.

We should include all dependency versions files (`dependencies.lock` and `gradle/dependency-locks`) in version control to ensure every developer in the team uses the same versions of dependencies. As a team, you can decide when to update dependencies, e.g. beginning of every development cycle.

## Summary

Using Gradle dynamic dependencies may lead to new bugs in the application. If you are lucky, these bugs may be caught by tests, but this is not guaranteed. On top of that, the cause of the bug is often not obvious, leading to even more confusion. When building our application, we should decrease the number of moving parts. Ideally, builds should be deterministic and building the same source code should produce exactly the same application. If you plan to use the dynamic dependencies version, you should also use the [Gradle locking feature](https://docs.gradle.org/current/userguide/dependency_locking.html) or the [Gradle Dependency Lock Plugin](https://github.com/nebula-plugins/gradle-dependency-lock-plugin); otherwise, you should specify your dependency versions explicitly.