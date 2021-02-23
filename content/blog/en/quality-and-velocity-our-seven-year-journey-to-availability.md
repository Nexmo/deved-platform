---
title: "Quality and Velocity: Our Seven Year Journey to 99.999% Availability"
description: How can your teams take a stronger approach to software testing without compromising on speed and product growth? The growing software developer in test team defined a solution.
thumbnail: /content/blog/quality-and-velocity-our-seven-year-journey-to-availability/Blog_1200x600-1.png
author: yuvalgolan
published: true
published_at: 2021-02-17T13:34:35.000Z
updated_at: 2021-02-17T13:34:35.000Z
category: engineering
tags:
  - high-availability
comments: true
redirect: ""
canonical: ""
---

In the face of a highly dynamic software ecosystem, the world of software testing has remained stagnant. As products grow in complexity, development teams are left facing a dilemma: the demand for rapid delivery is at war with the need to ensure quality products.

How can your teams take a stronger approach to software testing without compromising on speed and product growth? 

The growing SDET team (software developer in test) within Vonage R&D defined a solution. We call it **Qualocity**: the layered testing approach that addresses both quality and velocity.

## So where did it start? 

Most companies focus testing efforts on two main areas: functional tests, which emulate the basic use of an application, and non-functional system load. Testing groups would commonly measure product quality by requirement coverage, and by the number of bugs found, escaped, reopened - essentially glorifying the bugs instead of preventing them in the first place.

But the world has changed. We face an increase of fragmentation in aspects like operating systems, devices, and network latency. We are far into the era of the apps, an era that is dynamic and highly competitive. We’re seeing APIs and common libraries that are now enabling faster development, as well as various cloud services that provide the developer with an environment that doesn’t rely on operating systems, security, redundancy, or even scaling. 
All this to say, companies with month-long waterfall release cycles can no longer compete with the demand for features and innovation.  
Companies that can’t deliver fast will be late to market. 

## The Layers 

And yet, despite the need for speed, there lies a risk in rushing to production with only a few methods of outdated quality tests under our belt. Because if we keep doing things the way we have been for years, we’ll end up chasing our tails in a circle of quality issues and escalations in production, which isn’t fun for anyone.  Leaving us with these two critical factors: Quality must improve, but we need the ability to consistently and consciously commit changes to production. 

Seven years ago, we began to research additional methods to add to the two original layers, functional and load testing. During that time, we have steadily built up the quality and velocity approach that led us to 99.999% system availability, known colloquially as the “five nines.” 

Through research and experimentation, we created the process presented here, which is made up of three multi dimensional layers: 

![quality layers](/content/blog/quality-and-velocity-our-seven-year-journey-to-availability/quality.png)

## Coding discipline

It might seem obvious that proper code discipline is at the core of software quality. Testing begins here, in consistently following standards and procedures. 

- **Code reviews** should be conducted by peers, every time, and automated code should be treated in the same way. 

- **Unit tests** with wide coverage allow us to easily test with confidence we haven't broken the codebase. 

- **Static analysis tools** discover static bugs and security vulnerabilities. There are plenty of these on the market that offer different specifications for different needs.

- **Functional tests** should focus on mocking. Test at the API level and surround your automation with mocks that test exactly what you asked for. Avoid end-to-end automated tests because you are testing your code and not the end-to-end product. As a result, coverage will increase, and tests become more stable.

Ensure that functional tests run _everywhere_, not only in development and QA environments,  but in production as well. If built correctly, they will stand as a great monitoring tool and they won’t fail often. We all know how frustrating it is to be alerted at 2am for a false alarm. 


![functional tests](/content/blog/quality-and-velocity-our-seven-year-journey-to-availability/test-here.png)

## Non-Functional tests

For these, you’ll need to take a ride outside your comfort zone and think bigger. You’ll need to know the average use of your product and take it to its edge. 

Consider an API that you know receives 1000 calls per second on average, with a peak of 1200 at 10am and 3pm, and a low of 800 at 10pm. 

- For **Load Testing** you’ll want to make 1000 calls every second for a few hours.  
- In **Stress Tests** you’ll keep adding calls until you hit a failure. That’s your stress point. Decide what to do about it and try again. 
- **Stability Tests** account for average usage over time. For an extended period of time, make 1200 calls per second at peak hours, 800 at low hours, and 1000 the rest of the time. This will ensure that you can stay stable under your average load. 

If your software includes capabilities for **auto scaling**, ensure testing on additional instances once the limit is reached. 
Test **redundancy** for regions and zones because remember, your cloud services _will_ fail from time to time.
**Security** in this context refers to application penetration testing, OSS testing (external libraries and APIs), and static analysis tools. 
Code reviews are crucial at this stage, and should be part of the software development life cycle. 

## DevOps Discipline 

Let it _soak_. Don’t fool yourself into believing that you’ve protected yourself from all edge cases once everything mentioned above works well. You just can’t. You’ve got more devices, more account features, and more configurations to consider. Take the time to ensure that tests are actually accurate. 

### Remember to be gradual with releases

- Encourage **bug squashing** by the development team before going to staging   

- Then try it on the **alpha** (internal) users before sharing with the **beta** (external) users. These selected beta groups should represent the majority of your production base, in regards to instances and devices. 

- Once the version is widely available, enable a **blue-green** deployment system, which alternates production and staging servers, and allows you to quickly fall back to a previous version if necessary. 

- Monitor scrupulously; watch your system health, set up alerting and analyze the test data

- Talk with your customer success teams and explore other sources of feedback, like on app stores, social media and community platforms. 


If you’ve followed all these steps, we can pretty much guarantee that you’re now ready for GA.

## In Conclusion 

What we presented above is an approach for a quality strategy that we feel is close to perfect, yet still attainable. While we haven’t implemented it fully for all of our services, specifically legacy code and inherited software, we can say with confidence that each layer has proven to make a significant difference. The team of SDETs and DevOps engineers at Vonage will vouch for that. It is a huge undertaking, but we encourage you to gradually add one layer at a time, until you reach the coverage that is right for you. 

We hope this helped, and we hope this research brings you even closer to your desired availability. 



 