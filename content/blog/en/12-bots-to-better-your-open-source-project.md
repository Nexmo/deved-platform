---
title: 12 Bots To Better Your Open Source Project
description: 12 ways to improve your open source project with Probot and GitHub
  Actions—enabling you to extend your workflow and customize the way GitHub
  functions.
thumbnail: /content/blog/12-bots-to-better-your-open-source-project/Blog_Bots-Better-Opensource_1200x600.png
author: nahrinjalal
published: true
published_at: 2020-10-28T14:35:06.000Z
updated_at: ""
category: tutorial
tags:
  - open-source
  - hacktoberfest
  - bots
comments: true
redirect: ""
canonical: ""
old_categories:
  - developer
  - developers
---
The longer an open source project exists and grows, the more issues and unmerged pull requests it will accumulate. Keeping up with new contributions, especially if there are still unresolved problems from the past, is no easy task.

Enter, bots! Automating and outsourcing labour to bots eases maintainers' burden, freeing up time for more impactful tasks.

This post will cover 12 ways to improve your open source project with [Probot](https://probot.github.io/) (GitHub Apps) and [GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions)—two separate projects with a shared goal of **enabling and empowering developers to extend their workflows** and **customizing the way GitHub functions**.

If you'd like to know more about how the projects differ, Jason Etcovitch's excellent [blog post](https://jasonet.co/posts/probot-app-or-github-action-v2/#so-what-should-you-use) on the topic could help. Here's his comparison of the two:

![github apps vs actions](/content/blog/12-bots-to-better-your-open-source-project/apps-vs-actions.png "github apps vs actions")

Now, let's begin highlighting automation tools that will ease your life as a project maintainer. Without further ado, here are bots to better your open source project!

## Probot (GitHub Apps)

### [Request Info](https://probot.github.io/apps/request-info/)

*Requests more information on issues and pull requests with the default title or an empty body.*

Request-Info requests more information from newly opened Pull Requests and Issues that contain either default titles or whose description is left blank. It does so by taking data from a .github/config.yml.

![Request-Info bot](/content/blog/12-bots-to-better-your-open-source-project/req-info.png "Request-Info bot")

### [No Response](https://probot.github.io/apps/no-response/)

*Closes Issues where the author hasn't responded to a request for more information.*

Very often, issues get filed without enough information to be adequately investigated. When this happens, maintainers can label an issue as requiring more information from the original author. If the author doesn't provide the necessary information within a timely manner, the issue is automatically closed by the bot. If the original author comes back and gives more information, the No Response bot removes the label, and the issue gets automatically reopened if necessary.

![No response bot](/content/blog/12-bots-to-better-your-open-source-project/no-response-test.png "No response bot")

### [Mergeable](https://probot.github.io/apps/mergeable/)

*Prevent merging of Pull Requests based on configurations.*

Make your Pull Requests "mergeable" only when specific terms are not in the title or label, the milestone on the pull request matches with what is configured, and there is at least n number of approved reviews, where n is configurable.

### [Auto Assign](https://probot.github.io/apps/auto-assign/)

*Add reviewers/assignees to pull requests when pull requests are opened.*

When the pull request is opened, this bot will automatically add reviewers/assignees to the pull request. If the number of reviewers/assignees is specified, it will randomly add reviewers/assignees to the pull request. If the pull request title contains a specific keyword, the bot does not add reviewers/assignees to the pull request.

### [Stale](https://probot.github.io/apps/stale/)

*Automatically close stale Issues and Pull Requests that tend to accumulate during a project.*

After a period of inactivity, a label will be applied to mark an issue as stale, and optionally a comment will be posted to notify contributors that the Issue or Pull Request will be closed. If the Issue or Pull Request is updated, or anyone comments, then the stale label is removed, and nothing further is done until it becomes stale again. If no more activity occurs, the Issue or Pull Request will be automatically closed with an optional comment.

![Stale bot](/content/blog/12-bots-to-better-your-open-source-project/stale.png "Stale bot")

### [First Timers](https://probot.github.io/apps/first-timers/)

*Creates starter issues to help onboard new open source contributors.*

The process of creating a pull request is the most significant barrier for new contributors. First Timers streamlines the process to create straightforward contributor-friendly issues to help onboard more people to become Open Source contributors for the first time.

## GitHub Actions

### [Lint](https://github.com/wearerequired/lint-action)

*Show and auto-fix linting errors for many programming languages.*

Lint shows linting errors on GitHub commits and PRs, allows auto-fixing issues, and supports many linters and formatters.

![Lint Action](/content/blog/12-bots-to-better-your-open-source-project/lint-action.png "Lint Action")

### [Size Limit](https://github.com/andresz1/size-limit-action)

*Compares the real cost to run your JS application or library to keep good performance in every pull request.*

This action uses Size Limit (performance budget tool for JavaScript) to calculate your JavaScript's real cost for end-users. This action's main features are to comment on pull requests with the comparison of Size Limit output and reject a pull request if the cost exceeds the limit.

![Size limit action](/content/blog/12-bots-to-better-your-open-source-project/size-limit.png "Size limit action")

### [LibreSelery](https://github.com/protontypes/libreselery)

*Continuous distribution of funding to your project contributors and dependencies.*

LibreSelery is a tool to distribute funding in free and open source projects. With a new funding model, it offers transparent, automated and adaptable compensation of contributors. The aim is to replace the middleman in donation distribution as far as possible with a free and transparent algorithm. Unlike most other donation systems, LibreSelery only offers a decentralized tool and not a platform.

### [Lock Threads](https://github.com/dessant/lock-threads)

*Locks closed issues and pull requests after a period of inactivity.*

The action uses GitHub's updated search qualifier to determine inactivity. Any change to an issue or pull request is considered an update, including comments, changing labels, applying or removing milestones, or pushing commits. Lock Threads is a GitHub Action that locks closed issues and pull requests after a period of inactivity.

![Lock Threads Action](/content/blog/12-bots-to-better-your-open-source-project/lock-threads.png "Lock Threads Action")

### [Pull Request Labeler](https://github.com/Decathlon/pull-request-labeler-action)

*Automatically labels a pull request based on committed files.*

When pushing, the action will be triggered and will look for committed files over the branch. It applies configured labels whenever it finds a file whose name matches the associated regular expression.

![PR Labeler Action](/content/blog/12-bots-to-better-your-open-source-project/labeler.png "PR Labeler Action")

### [alex](https://github.com/theashraf/alex-action)

*Catches insensitive, inconsiderate writing.*

Alex helps you find gender favouring, polarizing, race-related, religion inconsiderate, or any other unequal phrasing in text.

## Next Steps

There are *many* more automation tools out there that may improve your workflow as a maintainer. I encourage you to explore more options or try your hand at building your own!

Probot apps can be [written, deployed, and shared](https://docs.github.com/en/free-pro-team@latest/developers/apps). Many of the most popular Probot apps are hosted, so there's nothing for you to deploy and manage. You can also create your actions or customize actions shared by the GitHub community with the help of [tutorials](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions).

What are your favourite open source automation tools? Have you built one yourself? Let us know in the comments section below, on [Twitter](https://twitter.com/VonageDev), or the [Vonage Developer Community Slack](https://developer.nexmo.com/community/slack)!

### Additional Resources

Vonage is thrilled to be a Hacktoberfest 2020 partner. We're [no strangers to open source](https://youtu.be/zYJpYMCy6PA), with our libraries, code snippets, and demos all on GitHub. To fully immerse yourself in the festivities, be sure to check out our [Hacktoberfest page](https://nexmo.dev/2GZcyHc) for details on all that we have planned.

You may also find more of our open source related blog posts below:

* [Vonage Joins Hacktoberfest 2020](https://www.nexmo.com/blog/2020/09/28/vonage-joins-hacktoberfest-2020)
* [An Introduction To Git](https://www.nexmo.com/blog/2020/09/29/an-introduction-to-git-dr)
* [How To Create a Pull Request With GitHub Desktop](https://www.nexmo.com/blog/2020/10/01/how-to-create-a-pull-request-with-github-desktop)
* [Version Control GUIs](https://www.nexmo.com/blog/2020/10/02/version-control-guis)
* [Opening Multiple Pull Requests](https://www.nexmo.com/blog/2020/10/06/opening-multiple-pull-requests-dr)
* [Hacktoberfest: Using GitHub Desktop](https://www.nexmo.com/blog/2020/10/08/hacktoberfest-using-github-desktop)
* [Other Ways to Contribute to Open Source This Hacktoberfest](https://www.nexmo.com/blog/2020/10/09/other-ways-to-contribute-to-opensource-this-hacktoberfest)
* [Surviving Hacktoberfest: A Guide for Maintainers](https://www.nexmo.com/blog/2020/10/13/surviving-hacktoberfest-a-guide-for-maintainers)
* [33 High Impact Open Source Projects Seeking Contributors](https://www.nexmo.com/blog/2020/10/16/33-high-impact-open-source-projects-seeking-contributors)