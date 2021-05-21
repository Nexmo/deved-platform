---
title: Fancify Your Festive Messages with this Python and SMS Script
description: Make your SMS messages stand out with this custom looking font
  using some Unicode magic, Python, and the Nexmo SMS API
author: aaron
published: true
published_at: 2021-05-21T06:50:53.076Z
updated_at: 2021-05-21T06:50:53.091Z
category: tutorial
tags:
  - python
  - sms-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
???? ???? ??????? ??? ?????-??? ???? ???? ???? ? ?????? ??? ?? ??????? ????????!

---

Telecoms providers see some of the highest volume of SMS on Christmas Day and New Year's Eve. So it's likely your friends, and family members are going to be receiving many messages, not just yours. However, with a little Python, the Nexmo SMS API, and some Unicode trickery we can make your message stand out from the crowd.

## ??????? ???????

You can [view the entire script as a gist](https://gist.github.com/aaronbassett/1cdee3106f09f65d4f4d821d64d37d94). To run locally, you'll need  Python 3 and the [Nexmo Python client](https://github.com/Nexmo/nexmo-python/) as well as [Click](https://click.palletsprojects.com/en/7.x/).

```
pip install nexmo click
```

Don't forget to set environmental variables for `NEXMO_KEY` and `NEXMO_SECRET`, these values can be [found on the Nexmo dashboard](https://dashboard.nexmo.com/getting-started-guide). Once you have the dependencies installed and the API values set you can run the script with the command:

```
python fancy_sms.py <font name> <number to> <sender> <message>
```

## ????????? ?????

I've added [6 different fonts](https://gist.github.com/aaronbassett/1cdee3106f09f65d4f4d821d64d37d94#file-fancy_sms-py-L19-L26) to the script as examples, but a search for "Unicode fancy text" turns up [plenty of others](https://lingojam.com/FancyTextGenerator) you can add.

<img src="https://www.nexmo.com/wp-content/uploads/2018/12/IMG_E4245AD49ADF-1.jpeg" alt="Screeenshot of SMS messages with custom fonts" width="1242" height="1786" class="alignnone size-full wp-image-26344" />

## ???????? ??????? ??? ℂ???

```python
@click.command()
@click.argument(
    "font",
    type=click.Choice(
        ["gothic", "typewriter", "double_struck", "script", "circled", "squared"]
    ),
)
@click.argument("number_to")
@click.argument("sender")
@click.argument("message")
def send_fancy_sms(font, number_to, sender, message):
```

The stack of decorators is how we define our Click command. We're using a type of `click.Choice` for the `font` to limit the values to the keys of our font dictionaries that we'll look at next.

```python
fonts_lowercase = {
    "gothic": "??????????????????????????",
    "typewriter": "??????????????????????????",
    "double_struck": "??????????????????????????",
    "script": "????ℯ?ℊ???????ℴ???????????",
    "circled": "??????????????????????????",
    "squared": "??????????????????????????",
}

fonts_uppercase = {
    "gothic": "??????????????????????????",
    "typewriter": "??????????????????????????",
    "double_struck": "??ℂ????ℍ?????ℕ?ℙℚℝ???????ℤ",
    "script": "?ℬ??ℰℱ?ℋℐ??ℒℳ????ℛ????????",
    "circled": "??????????????????????????",
    "squared": "??????????????????????????",
}
```

Here we define our fonts in both lower and uppercase. We're going to reference them later using `fonts_lowercase[font]` so the key must match exactly the string passed into the command.

```python
for letter in string.ascii_lowercase:
    message = message.replace(
        letter, fonts_lowercase[font][string.ascii_lowercase.index(letter)]
    )

for letter in string.ascii_uppercase:
    message = message.replace(
        letter, fonts_uppercase[font][string.ascii_uppercase.index(letter)]
    )
```

We iterate over each letter from A-Z and do a `string.replace` on the message using the index of the letter ("a" equals 0, "b" equals 1, and so on) to find the correct letter in our `fonts_lowercase[font]` string. We make this loop twice, once for lowercase letters and once for uppercase.

```python
client = nexmo.Client(
    key=os.environ["NEXMO_KEY"], secret=os.environ["NEXMO_SECRET"]
)
client.send_message(
    {"from": sender, "to": number_to, "type": "unicode", "text": message}
)
```


Finally, we send our SMS. You can supply [any alphanumeric string for the `sender`](https://developer.nexmo.com/messaging/sms/guides/custom-sender-id), but if you would like the message to appear as though you've sent it from your phone, and to ensure that the recipient can reply, you should set the sender to be your mobile number in the [E.164 international format](https://help.nexmo.com/hc/en-us/articles/204015593).

## ℱ???????ℊ ??

This Unicode text also [works on Facebook and WhatsApp using our Messages API](https://developer.nexmo.com/messages/overview), so you could make your Facebook Messenger bot seem a bit more ƈʏɮɛʀքʊռӄ, or add a ????? ?? ????? to your WhatsApp messages. 