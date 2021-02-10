---
title: Build a Text-to-Speech Application With Hanami
description: This tutorial will show how to make a text-to-speech voice
  application using Hanami, the Vonage Ruby SDK, and the Voice API
thumbnail: /content/blog/build-a-text-to-speech-application-with-hanami/ruby-hanami_voice_1200x627.jpg
author: ben-greenberg
published: true
published_at: 2021-02-02T14:19:50.729Z
updated_at: ""
category: tutorial
tags:
  - ruby
  - hanami
  - voice-api
comments: true
spotlight: false
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
This tutorial will show how to make a text-to-speech voice application using Hanami, the Vonage Ruby SDK, and the Voice API. This tutorial will require creating a Vonage application with voice capabilities.

You can also find the code and the fully working app shown in this tutorial on [GitHub](https://github.com/nexmo-community/hanami_vapi_tts).

## Prerequisites

* Vonage Voice application
* Vonage provisioned phone number
* Ruby and Hanami installed on your machine
* Ngrok

## What Is Hanami?

[Hanami](https://hanamirb.org/) is a fully-featured Ruby web framework. It offers an alternative to Ruby on Rails that is more lightweight and consumes less memory. It is based on the same MVC (models, views, and controllers) methodology as Rails. One of its key design differences is that it breaks functionality down to its smallest possible part. As a result, a Hanami web app might have more files to accomplish the same thing a Rails web app does, but each file is responsible for as little as possible. This makes bug tracking, feature adding, and refactoring more streamlined.

It is not uncommon to find extensive models and controllers in a Ruby on Rails application. Often, a lot of that code is rearchitected to a services area or helper classes. However, in a Hanami application, because of its overall design, it is quite hard to end up filling a single model or a single controller with so much code that it becomes unwieldy. 

<sign-up number></sign-up>

## Create a Vonage Voice Application

To create a web application that utilizes the Vonage Voice API, we will need to create a Vonage Voice Application in the Dashboard. Navigate to *Your Applications* from the menu in the side nav. Generate a new application with any name you choose and then select "Generate public and private key". This will download the `private.key` file to your computer. Once we begin creating our Hanami application, we will move that file to its root folder.

Make sure to turn on the "Voice" capability under *Capabilities* when creating the application. Once you are done, click *Save*. If you forget to click *Save*, then the public and private key information will not persist in the Vonage application, and you will need to generate a new public and private key pair all over again.

> *Voice applications in Vonage require externally accessible webhook addresses to be provided for data from the Vonage Voice API. In this tutorial, we are not going to do anything with this data. Still, it is good practice in production environments when working with webhooks to, at the very least, acknowledge the information being sent from the API. You can use ngrok to make your local development environment externally accessible when creating or working on an application. If you have never used ngrok before, you can follow [this tutorial](https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr) for instructions on how to set it up and use it in your Vonage application.*

After you finish creating the Voice application in the Dashboard, you will have an application ID. This will be important in our app, so make a note of it.

Now that we have a Vonage Voice application and a Vonage virtual number, we are ready to build our app!

## Create a Hanami App

The first step in our new application is to initialize it. From the command line run:

```bash
$ hanami new voice_app --database=postgres
```

This will create a new directory called `voice_app` from where we executed this command with the scaffolding of a web app using PostgreSQL for the database. Go ahead and change into that directory and open it up with your preferred code editor.

We can now start writing the code for our text-to-speech application.

## Install the Vonage Ruby SDK

The first task we want to do is to add the Vonage Ruby SDK as a gem dependency to the `Gemfile`.

Open up the `Gemfile` from the root folder and add `gem 'vonage'` to it. Once you have done so, you can run `bundle install` from the command line. 

To instantiate an authenticated Vonage SDK client capable of making voice calls, we need to provide some Vonage API credentials. The `private.key` file you downloaded from the Vonage Dashboard can now be moved to the root folder of your Hanami app. We also need to provide our Vonage application ID, and we will also use this moment to add our Vonage phone number. If one does not yet exist, create a `.env` file in the root folder, or open up the current one, and add the following:

```ruby
VONAGE_APPLICATION_ID=Your Vonage Application ID Goes Here
VONAGE_PRIVATE_KEY=./private.key
VONAGE_NUMBER=Your Vonage Number Goes Here
```

You need to replace the text after each equal sign with the required value. You can keep the value for the `VONAGE_PRIVATE_KEY` as that is accurately pointing to your private key file.

## Prepare the Database

At this point, we are going to ready our database for the application. We will use the database to persist a list of language options for our text-to-speech application. Users will be able to pick any one of the available languages in the database to create a message to send via a phone call.

We will generate a new model that will hold the information for our languages. Within Hanami, the logic for a database model is stored in an `entity`, and the data is stored in a `repository`. An `entity` is decoupled from the database, whereas the `repository` is the data level itself. 

To generate our language model, we can use the Hanami generator again by running `bundle exec hanami generate model language`.

This will create a new entity in `lib/voice_app/entities` called `language.rb`, a new repository in `lib/voice_app/repositories` called `language_repository.rb` and a new database migration in `db/migrations`. The migration file will start with a timestamp and end with `create_languages.rb`. The generator builds a few spec files for us, too.

We need to open up the migration file and edit it to include columns for the language name and the language [IETF BCP-47](https://tools.ietf.org/html/bcp47) code designation.

The migration file will look like this when you open it up initially:

```ruby
Hanami::Model.migration do
  change do
    create_table :languages do
      primary_key :id

      column :created_at, DateTime, null: false
      column :updated_at, DateTime, null: false
    end
  end
end
```

After the `primary_key :id` line, add the code to create two new columns of data:

```ruby
column :name, String, null: false
column :code, String, null: false
```

You can save the file and then run the following command to create our database with the languages table and its columns we added:

```bash
$ bundle exec hanami db prepare
```

Lastly, let's add some languages to our database. The fastest way for us to do this now is to drop into the Hanami console from the terminal and add a few. You can choose from the list of [available languages](<>) on the Vonage API Developer Portal or use the ones in the sample code below. First, to enter the console, run `bundle exec hanami console` from the command line. Then, to create the data, run the following code, either using the sample languages in the code snippet below or changing them from the ones you chose:

```ruby
>> repository = LanguageRepository.new
>> repository.create(language: 'English', code: 'en-US')
>> repository.create(language: 'Danish', code: 'da-DK')
>> repository.create(language: 'Tamil', code: 'ta-IN')
>> exit
```

We now have a database of languages created in our new application and are ready to proceed to the next step, generating the views.

## Create the Web Actions

For this tutorial, we will build actions structured on the `home` folder that Hanami ships with to keep our code uncomplicated. As such, for our first action, which corresponds to our root `/` path, we will use the Hanami generator from the command line to create an `index` action. This will create a controller for the `index` view and the HTML template for it inside `app/web/templates/home/index.html.erb`.

Additionally, this generator will also automatically add a route for us inside `app/web/config/routes.rb`: `get '/', to: 'home#index'`.

We run the following to create the above: `bundle exec hanami generate action web home#index`.

We're going to use this moment to generate the other actions we need for our application. In short, we require the following:

* `new`: The `POST` action for the form users will submit with their phone call information
* `create`: The action to create a new text-to-speech call with the form data
* `success`: The action that'll display the view after initializing the call

To create these, go ahead and run the following. Each one is split into a separate line for clarity sake:

```bash
$ bundle exec hanami generate action web home#new
$ bundle exec hanami generate action web home#create
$ bundle exec hanami generate action web home#success
```

Each of the above generator actions created its controller and template folder structure, just like the first `index` action.

## Create the Views

We will add HTML for two views for our application. The first view will be the root `index` view, and the second will be the `success` view after the form submission.

Open up the `/apps/web/templates/home/index.html.erb` file and add the following:

```html
<h1>Text-to-Speech Calls on Hanami</h1>

<p>Let's make a phone call!</p>

<form action="/create" method="post">
  <label for="number">Enter a recipient number:</label>
  <input type="text" id="number" name="number">
  <br />
  <label for="language">Choose a language:</label>
  <select id="language" name="language">
    <% languages.each do |voice| %>
      <option value=<%= language.code %>><%= language.name %></option>
    <% end %>
  </select>
  <br />
  <label for="message">Enter a message:</label>
  <textarea id="message" name="message" col="10">
  </textarea>
  <br />
  <input type="submit" value="Submit">
</form>
```

The `index` view contains a small HTML form that holds three inputs and a submit button. The first input is the number the user wants to dial. The second input is the language selection. Lastly, the third input is the message to be delivered in the call.

The language dropdown selection in the second input is generated from the languages in our language repository. However, you will notice that they are accessed via a local variable `voices` in the view. Where did that variable come from? We'll make that variable accessible in our next step of this tutorial.

Now, let's add the `success` view. Open up `/apps/web/templates/home/success.html.erb` and add the following:

```html
<p>Congrats, you sent your message!</p>
<br />
<p>Care to <a href="/">try again?</a>
```

This view contains a congratulations message on completing the call and an invitation to try again.

Let's add the logic to our controllers to make the `voices` local variable work in the view and perform the phone call.

## Define Controller Logic

As we mentioned in the step before this one, we need to provide the variable's context in the `index` view. Otherwise, our application will see it as undefined. We do that by defining an instance variable definition in the `index` controller inside `apps/web/controllers/home/index.rb`. Two steps are required. First, we need to expose the data to the controller. Hanami does not assume every controller needs access to every data store, so it requires you to be intentional about what data a controller can access. Second, we need to instantiate a variable in the `#call` method with the data.

This is what the `index` controller looks like:

```ruby
module Web
  module Controllers
    module Home
      class Index
        include Web::Action

        def call(params)
        end
      end
    end
  end
end
```

After the `include Web::Action` line, add another line with `expose :languages`. This will make the languages database table available to our controller. Then, inside the `#call` action, add the following: `@languages = LanguageRepository.new.all` to pass all the languages inside the repository to the `index` view.

Now, let's go ahead and incorporate the Vonage Ruby SDK into the `create` controller. We will instantiate a credentialed instance of the SDK and use it to generate the phone call with the user's text sent in the call via text-to-speech. You can add the following to your `apps/web/controllers/home/create.rb` file:

```ruby
require 'vonage'

module Web
  module Controllers
    module Home
      class Create
        include Web::Action

        def call(params)
          client = Vonage::Client.new(
            application_id: ENV['VONAGE_APPLICATION_ID'],
            private_key: ENV['VONAGE_PRIVATE_KEY']
          )

          response = client.voice.create(
            to: [{
              type: 'phone',
              number: params[:number]
            }],
            from: {
              type: 'phone',
              number: ENV['VONAGE_NUMBER']
            },
            ncco: [{
              action: 'talk',
              text: params[:message],
              language: params[:language]
            }]
          )

          redirect_to '/success'
        end
      end
    end
  end
end
```

On the first line in the code snippet, we `require` the Vonage Ruby SDK. Then, inside the `#call` method, we create our client and then use the SDK's `voice#create` instance method to send the call. The `voice#create` method follows the [API specification](https://developer.nexmo.com/api/voice) for the Voice API in the required and optional parameters that it accepts. At a minimum, the method requires:

* `to` parameter: An array holding a hash with `type` and `number` keys
* `from` parameter: A hash with two keys of `type` and `number`
* `ncco` parameter: An array with a hash that contains the instructions sent to the Voice API.

The [API specification](https://developer.nexmo.com/api/voice), as well as the [NCCO reference](https://developer.nexmo.com/voice/voice-api/ncco-reference), are good starting points to discover all the possible values that can be utilized when building your voice call.

## Running the Application

You are now ready to run your application! To start your Hanami web app, run the following command from your terminal:

```bash
$ bundle exec hanami server
```

The above command will start a web server on port 2300. You can now use your web browser to navigate to `http://localhost:2300`. You will see the form you created to send text-to-speech over a phone call. Go ahead and fill it out, perhaps using your phone number as the recipient number. Once you press "Submit," you should receive the call with your message, and your browser should be redirected to the `success` view.

Congrats! You built a fully functioning voice application using the text-to-speech feature of the Vonage Voice API with Hanami.

## What's Next?

Now that you have begun to experiment with the possibilities of what you can do with the Vonage Voice API, there is so much more to discover. The following resources can be a good place to continue your journey:

* [Interactive Voice Response](https://developer.nexmo.com/use-cases/interactive-voice-response)
* [Call Bots / Voice Assistants](https://developer.nexmo.com/use-cases/asr-use-case-voice-bot)
* [Using WebSockets](https://developer.nexmo.com/voice/voice-api/tutorials/call-a-websocket/introduction)
* [Speech Recognition](https://learn.vonage.com/blog/2020/11/20/voice-api-speech-recognition-now-in-general-availability/)
* [Build Voicemail with Ruby on Rails](https://learn.vonage.com/blog/2019/06/17/build-a-voicemail-with-ruby-on-rails-dr/)