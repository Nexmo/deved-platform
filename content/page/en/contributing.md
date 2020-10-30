---
title: Contributing Guide
---

## Tag Creation Tool

<tag-maker></tag-maker>

## Capitalize My Title

uppercase words
not-these though: “a,” “an,” “and,” “at,” “but,” “by,” “for,” “in,” “nor,” “of,” “on,” “or,” "out," “so,” “the,” “to,” “up,” and “yet.”
unless "not-these" are first or last

https://codereview.stackexchange.com/questions/217006/a-function-which-translates-a-sentence-to-title-case

<title-maker></title-maker>

## Code Block Preview

<code-maker></code-maker>

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
