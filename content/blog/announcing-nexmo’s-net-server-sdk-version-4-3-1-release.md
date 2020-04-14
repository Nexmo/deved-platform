---
title: Announcing Nexmo’s .NET Server SDK Version 4.3.1 Release
description: Announcing the latest Nexmo .NET server SDK release fixing issues
  with User Agents on certain Operating Systems and enabling infinite looping of
  Talk and Audio Stream
thumbnail: /content/blog/announcing-nexmo’s-net-server-sdk-version-4-3-1-release/e_dotnet-sdk-update_1200x600.png
author: stevelorello
published: true
published_at: 2020-04-14T20:51:52.337Z
tags:
  - dotnet
  - .net
  - sdk
---
Hello again! This week we are releasing a new version of the .NET SDK – 4.3.1. This version contains two bug fixes.

## Truncated ‘loop’ Parameter in Stream and Talk Commands

Version 4.3.1 of the SDK fixes an issue where the ‘loop’ parameter would be truncated if set to 0 in Voice API Stream and Talk requests. Setting the loop parameter to 0 will now result in an infinite loop, as per the [API Spec](https://developer.nexmo.com/api/voice#startStream).

## User Agent Throwing Exceptions for Certain Operating Systems

This version of the SDK also fixes an issue where on certain operating systems—specifically those whose description contains the `(` character (e.g. `Linux4.9.0-7-amd64#1SMPDebian4.9.110-3+deb9u2(2018-08-13)`)—a formatting exception would be thrown. This is because the Core CLR was interpreting the parentheses as comments in the user agent, without a preceding space, creating a formatting error. This was also an issue as the formatting of the User Agent wasn’t compliant with our [User Agent standards](https://github.com/Nexmo/repo-standards/blob/master/set-user-agent.md). From now on, the User Agent the SDK uses will be:

`$"nexmo-dotnet/{libraryVersion} dotnet/{languageVersion}"`

Rather than including the full runtime (OS + .NET framework version), it will now only include the .NET version.

## More to Come

There’s much more to come, but until then feel free to follow the [.NET SDK in GitHub](https://github.com/Nexmo/nexmo-dotnet) for real-time updates. If you have any questions, issues, or concerns, please feel free to raise them there or find me, @Steve Lorello, in our [community slack](https://developer.nexmo.com/community/slack), and I’ll be more than happy to help.