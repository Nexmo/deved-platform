# Contributing Guidelines

:+1::tada: We :heart: contributions from everyone! :tada::+1:

It is a good idea to [talk to us][slack] first if you plan to add any new functionality. Otherwise, [bug reports][issues], [bug fixes][pulls] and feedback on the library is always appreciated. Check out the [Contributing Guidelines][contributing] for more information and please follow the [GitHub Flow][githubflow].

[![contributions welcome][contribadge]][issues]

The following is a set of guidelines for contributing to this project, which are hosted on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

Please take the time to review the [Code of Conduct][coc], which all contributors are subject to on this project.

[I don't want to read this whole thing, I just have a question!!!](#i-dont-want-to-read-this-whole-thing-i-just-have-a-question)

**Table of Contents**

- [Writing a Post](#writing-a-post)
  - [Example Blog Post](#example-blog-post)
- [Reporting Bugs](#reporting-bugs)
  - [Before Submitting A Bug Report](#before-submitting-a-bug-report)
  - [How Do I Submit A (Good) Bug Report?](#how-do-i-submit-a-good-bug-report)
- [Suggesting Enhancements](#suggesting-enhancements)
  - [Before Submitting An Enhancement Suggestion](#before-submitting-an-enhancement-suggestion)
  - [How Do I Submit A (Good) Enhancement Suggestion?](#how-do-i-submit-a-good-enhancement-suggestion)
- [Your First Code Contribution](#your-first-code-contribution)
- [Pull Requests](#pull-requests)

## Writing a Post

If you've been given a login, you can access the CMS and write your content there.

Otherwise, you can create the markdown file and send it as a pull request manually.

### Example Blog Post

For author and categories values, see [content/authors.json](../content/authors.json) and [content/categories.json](../content/categories.json).

```markdown
---
title: Your title
description: A description
thumbnail: https://url.to.post.image.jpg
author: lukeoliff
published: true
published_at: 2020-06-25T10:30:00.000Z
comments: true
category: tutorial
tags:
  - tags
  - list
---

tldr or intro
 
## title

some text

## conclusion

some text
```

## Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template][bugreport], the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

### Before Submitting A Bug Report

* **Perform a cursory search** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues][githubissues]. Create an issue and provide the following information by filling in [the template][bugreport].

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you started. When listing steps, **don't just say what you did, but explain how you did it**.
* **Provide specific examples to demonstrate the steps**. Include links to files or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks][githubcodeblocks].
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** where possible. Show how you follow the described steps and clearly demonstrate the problem. You can use [this tool][licecap] to record GIFs on macOS and Windows, and [this tool][silentcast] on Linux.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.
Include details about your configuration and environment:

## Suggesting Enhancements

This section guides you through submitting a suggestion, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill out [the required template][featurerequest], the information it asks for helps us resolve issues faster.

### Before Submitting An Enhancement Suggestion

* **Perform a cursory search** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues][githubissues]. Create an issue and provide the following information by filling in [the template][featurerequest].

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks][githubcodeblocks].
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most users.

## Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

## Pull Requests

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template][pullrequest]
2. Adhear the [Code of Conduct][coc]
3. After you submit your pull request, verify that all [status checks][githubstatuschecks] are passing.

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

# I don't want to read this whole thing I just have a question!!!

You can join the Vonage Community Slack for any questions you might have:

* [Contact our Developer Relations Team][community]
* [Reach out on Twitter][twitter]
    * This Twitter is monitored by our Developer Relations team, but not 24/7 &mdash; please be patient!
* [Join the Vonage Community Slack][slack]
    * Even though Slack is a chat service, sometimes it takes several hours for community members to respond &mdash; please be patient!
    * Use the `#general` channel for general questions or discussion
    * Use the `#status` channel for receiving updates on our service status
    * There are many other channels available, check the channel list for channels for a specific library

Alternatively, you can raise an issue on the project.

[beginner]:https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3Abeginner+label%3Ahelp-wanted+user%3Anexmo-community+sort%3Acomments-desc
[help-wanted]:https://github.com/search?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted+user%3Anexmo-community+sort%3Acomments-desc+-label%3Abeginner

[contribadge]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat "Contributions Welcome"

[coc]: CODE_OF_CONDUCT.md "Code of Conduct"
[contributing]: CONTRIBUTING.md "Contributing"
[license]: LICENSE "MIT License"
[pullrequest]: PULL_REQUEST_TEMPLATE/PULL_REQUEST_TEMPLATE.md "Pull Request template"

[community]: https://developer.nexmo.com/community "Vonage Community"
[signup]: https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=lukeocodes
[slack]: https://developer.nexmo.com/community/slack "Vonage Community Slack"
[twitter]: https://twitter.com/VonageDev "VonageDev on Twitter"

[bugreport]: ./../../issues/new?assignees=&labels=&template=bug_report.md&title= "Bug Report Template"
[featurerequest]: ./../../issues/new?assignees=&labels=&template=feature_request.md&title= "Enhancement Suggestion Template"
[issues]: ./../../issues "Issues"
[pulls]: ./../../pulls "Pull requests"

[githubcodeblocks]: https://help.github.com/articles/markdown-basics/#multiple-lines "GitHub Markdown Code Blocks"
[githubflow]: https://guides.github.com/introduction/flow/index.html "GitHub Flow"
[githubstatuschecks]: https://help.github.com/articles/about-status-checks/ "GitHub Status Checks"
[licecap]: https://www.cockos.com/licecap/ "LICEcap: animated screen captures"
[silentcast]: https://github.com/colinkeenan/silentcast "Silentcast: silent mkv screencasts and animated gifs"
