---
title: Contributing Guide
show_toc: true
---

## Making a Contribution

We love contributions from everyone! 🎉

It is a good idea to [talk to us][slack] first if you plan to add any new functionality. Otherwise, [bug reports][issues], [bug fixes][pulls] and feedback on the library is always appreciated. Check out the [Contributing Guidelines][contributing] for more information and please follow the [GitHub Flow][githubflow].

[![contributions welcome][contribadge]][issues]

The following is a set of guidelines for contributing to this project, which are hosted on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

Please take the time to review the [Code of Conduct][coc], which all contributors are subject to on this project.

[I don't want to read this whole thing, I just have a question!!!](#i-dont-want-to-read-this-whole-thing-i-just-have-a-question)

### Writing a Post

If you've been given a login, you can access the CMS and write your content there.

Otherwise, we have a [blog post CLI](#using-the-blog-post-cli) to start you off with an empty markdown file, or you can create the markdown file and send it as a pull request manually.

#### Example Blog Post

For author and categories values, see [content/authors.json](https://github.com/Nexmo/deved-platform/tree/develop/content/authors.json) and [content/categories.json](https://github.com/Nexmo/deved-platform/tree/develop/content/categories.json).

```md
---
title: An awesome title for your post.
description: An awesome description for your post.
thumbnail: /thumbnail-url/goes-here.png
author: tom
published: true
published_at: 2019-03-21T20:21:36.000Z
comments: true
category: tutorial
tags:
  - python
  - serverless
  - sms-api
spotlight: false
---
<!-- # english posts live in /content/blog/en -->

tldr or intro
 
## section title

some text

## conclusion

some text
```

#### Using the Blog Post CLI

Once you've cloned [the repository](repo) and gone through the [local setup guide](localsetup), you can run the CLI using this command.

```shell
npm run blog

# > vonage-dev-blog@0.0.0 blog /Users/luke/Projects/nexmo/dev-education-poc
# > node bin/blog
# 
# ℹ Vonage DevEd Post CLI
# ℹ by @lukeocodes
# 
# ? Would you like to create or translate a blog post? Create
# ? What's the title for this post? <max 70 chars> An awesome ...
# ? What's the description? <max 240 chars> An awesome description ...
# ? What language would you like to create a post in? English
# ? Who's the author? Luke Oliff
# ? What's the category? Tutorial
# ? Enable comments? Yes
# ? By spotlight author? No
# ✔ Saved demo file to content/blog/en/an-awesome-title-for-your-post.md ...
```

You can then open up the file you've just created in `content/blog/` and edit away.

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template][bugreport], the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* **Perform a cursory search** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

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

### Suggesting Enhancements

This section guides you through submitting a suggestion, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion and find related suggestions.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill out [the required template][featurerequest], the information it asks for helps us resolve issues faster.

#### Before Submitting An Enhancement Suggestion

* **Perform a cursory search** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues][githubissues]. Create an issue and provide the following information by filling in [the template][featurerequest].

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks][githubcodeblocks].
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most users.

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `beginner` and `help wanted` issues:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

### Pull Requests

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template][pullrequest]
2. Adhear the [Code of Conduct][coc]
3. After you submit your pull request, verify that all [status checks][githubstatuschecks] are passing.

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

### I don't want to read this whole thing I just have a question!!!

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

[beginner]: https://github.com/search?q=repo%3ANexmo%2Fdeved-platform+label%3Abeginner&type=Issues&ref=advsearch&l=&l=
[help-wanted]: https://github.com/search?q=repo%3ANexmo%2Fdeved-platform+label%3A%22help+wanted%22&type=Issues&ref=advsearch&l=&l=

[contribadge]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat "Contributions Welcome"

[repo]: https://github.com/Nexmo/deved-platform
[localsetup]: https://github.com/Nexmo/deved-platform/blob/develop/.github/LOCAL_SETUP.md "Local Setup Guide"
[coc]: https://github.com/Nexmo/deved-platform/blob/develop/.github/CODE_OF_CONDUCT.md "Code of Conduct"
[contributing]: https://github.com/Nexmo/deved-platform/blob/develop/.github/CONTRIBUTING.md "Contributing"
[license]: https://github.com/Nexmo/deved-platform/blob/develop/LICENSE "MIT License"
[pullrequest]: https://github.com/Nexmo/deved-platform/blob/develop/.github/PULL_REQUEST_TEMPLATE/PULL_REQUEST_TEMPLATE.md "Pull Request template"

[community]: https://developer.nexmo.com/community "Vonage Community"
[signup]: https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=lukeocodes
[slack]: https://developer.nexmo.com/community/slack "Vonage Community Slack"
[twitter]: https://twitter.com/VonageDev "VonageDev on Twitter"

[bugreport]: https://github.com/Nexmo/deved-platform/issues/new?assignees=&labels=&template=bug_report.md&title= "Bug Report Template"
[featurerequest]: https://github.com/Nexmo/deved-platform/issues/new?assignees=&labels=&template=feature_request.md&title= "Enhancement Suggestion Template"
[issues]: https://github.com/Nexmo/deved-platform/issues "Issues"
[pulls]: https://github.com/Nexmo/deved-platform/pulls "Pull requests"

[githubcodeblocks]: https://help.github.com/articles/markdown-basics/#multiple-lines "GitHub Markdown Code Blocks"
[githubissues]: https://docs.github.com/en/free-pro-team@latest/rest/reference/issues "GitHub Issues"
[githubflow]: https://guides.github.com/introduction/flow/index.html "GitHub Flow"
[githubstatuschecks]: https://help.github.com/articles/about-status-checks/ "GitHub Status Checks"
[licecap]: https://www.cockos.com/licecap/ "LICEcap: animated screen captures"
[silentcast]: https://github.com/colinkeenan/silentcast "Silentcast: silent mkv screencasts and animated gifs"

## Tools

### Capitalize My Title

<title-maker></title-maker>

---

### Tag Tester

<tag-tester></tag-tester>

---

### Code Block Examples

Examples of different language code blocks. A full list can be found on the [Prism](https://prismjs.com/#supported-languages) website.

#### No Type

```
It barely gets formatted at all.
```

#### JavaScript

` ```js` code goes here ` ``` `

```js
const hello = (val) => {
  return `Hello, ${val}`
}

hello('World')
```

#### HTML

` ```html` code goes here ` ``` `

Outputs:

```html
<!doctype html>
<html>
  <body>
    <h1>Hello, World</h1>
  </body>
</html>
```

#### Ruby

` ```ruby` code goes here ` ``` `

Outputs:

```ruby
def sum_eq_n?(arr, n)
  return true if arr.empty? && n == 0

  arr.product(arr).reject { |a,b| a == b }.any? { |a,b| a + b == n }
end
```

#### CSS

` ```css` code goes here ` ``` `

Outputs:

```css
.container {
  margin: auto;
  max-width: 1200px;
  width: 100%;
}
```

#### Kotlin

` ```kotlin` code goes here ` ``` `

Outputs:

```kotlin
fun main(args: Array<String>) {
    println("Hello World!")
}
```

---

## Writing Style Guide

### Language

- Strive for a conversational tone, as if you were teaching a workshop. It’s ok to use “we” or “you” or both, but try to apply consistently. Watch out for awkward usage that comes from trying to stick too forcefully to one rule.
  - Yes: Today we’re going to learn about Flask. Open up your terminal to begin.
  - No: Let’s save our credentials in your root directory.

- Keep your language direct, efficient, and active, especially on longer tutorials (don’t want excess text when trying to read dozens of steps). Be cautious with humor, as it doesn’t always translate across languages/cultures and can make people feel excluded.
  - Yes: On a new line, enter your application key.
  - No: Be sure your application key has been entered following your previous line, if you know what’s good for you!

- Avoid generalizations—“We all know”, “It’s commonly accepted”—unless they are relevant and you can back them up.

- Try to avoid -ing words in headings and titles. For example, Set Up Your Server rather than Setting Up Your Server.

### Punctuation

- Oxford comma—should always be used with lists of three or more! 
  - Yes: This practice keeps your application secure, resilient, and easy to deploy.
  - No: Next let’s sign up, download the file and install.

- A period should be followed by a single space.

- Hyphens are used between words when the phrase is acting as an adjective.
  - Yes: Time to brush off your front-end skills.
  - No: Let’s switch to the application’s front-end.

- The em dash (—) can be used as an alternative to a comma, semicolon, colon, or parenthesis, but don’t get carried away! It can easily lead to run-on and confusing sentences. If you are using it, be sure to use a proper em dash (longer than a hyphen, look up how to do it for your operating system) and don’t leave space between the dash and the surrounding words.
  - Yes: This application—once finished—will allow users to log in seamlessly.
  - No: Follow along with this tutorial -- it will give you all the information you need.

- To make an acronym plural, just add s (DON’T use an apostrophe) It is APIs not API's, SDKs not SDK's, and JWTs not JWT's.

### Formatting

- `Inline code` (single backticks) is used for typed input, such as a value entered into a field or at a terminal line, as well as names of variables, libraries, functions/methods/classes, and files.

- Code blocks (triple backticks) can also be used to show text-based output. 

```txt
They are used for portions of code or
configuration files as well as terminal
commands.
```

Anything inside a code block will not be formatted, so they are good for showing text with characters that might have a specific meaning to the markdown renderer.

- _Italics_ (use underscores) are for pointing out text-based elements of the UI (i.e. “Click on File > Open” or “Click the Save button”).

- **Bold** (use double **) is used for emphasis and as appropriate for names of concepts/products when first introduced. Shouldn’t be over used.

- Headings should use ## for sections and ### for subsections. 

- Capitalize the first letter of each word in your headings, apart from articles (the, a, an), prepositions (in, at, by, on, for) and conjunctions (and, or, nor, yet, for so, but). If you are not sure, you can use one of these tools that capitalize the title correctly for you: [TitleCase](http://www.titlecase.com/) or [Capitalize My Title (use the AP Style)](https://capitalizemytitle.com/). 

- For links, try to have the link naturally included in an appropriate phrase. Rather than using “You can find more information here” or “Click here to read more”, use something like “The SMS API allows you to quickly send messages.”

- Add a UTM link: https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=github-repo whenever directing the reader to sign up for a Nexmo account. (replace github-repo with your own repo link). 

- Keep a white space line between paragraphs.

### SEO

- Titles should be under 71 and include keywords related to technologies and languages used in the post.

- Include a description, under 160 characters, that will show up for your post in search results.

- Posts should include at least 4 mentions of your SEO key phrase.

- Majority of image alt descriptions should include your SEO key phrase.
  - Ok alt: Screenshot of chat
  - Bad alt: Screenshot
  - Really bad alt:
  - Amazing alt: Screenshot of Client SDK conversation between two users

- Include links to related articles inside the blog content.

- Concluding section should include links to further reading as well as the Vonage Developer Twitter and Community Slack.
