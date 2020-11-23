---
title: Smart Marketing with Django, Rasa Nlu, and Vonage
description: How to build a custom automated marketing solution to send messages
  and receive feedback quickly
author: laurenlee
published: false
published_at: 2020-11-23T14:15:54.670Z
updated_at: 2020-11-23T14:15:54.706Z
category: tutorial
tags:
  - django
  - rasa-nlu
  - angular
comments: true
spotlight: true
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
**<span style="text-decoration:underline;">Prerequisites</span>**

For this app we are going to be using the following:

[Django](https://docs.djangoproject.com/en/3.1/) – A web framework for web development

[Rasa NLU ](https://docs.djangoproject.com/en/3.1/)– An open-source Natural Language Processing platform

[Django Rest Framework ](https://www.django-rest-framework.org/)– A Django package used to make APIs

[Angularjs x 1](https://docs.angularjs.org/) – A javascript frontend framework

[Vuejs x 1](https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html) – A javascript frontend framework

[Docker](https://www.docker.com/) – A container image platform

[Heroku](https://www.heroku.com) – A web hosting platform

[Vonage Messages API](https://www.vonage.com/) – An API for sending Voice or Text Messages

Next, we will be looking at how to install each of these packages.

**<span style="text-decoration:underline;">Installation</span>**

First, we will start to install a virtual environment. A virtual environment will be like a storehouse for all our packages. We are using Linux so go to cmd and type virtualenv vonenv

This will create a new virtual environment called vonenv. Activate it by typing source/vonenv/bin/activate

**<span style="text-decoration:underline;">Installing Django</span>**

We will use Django as our app framework. Install Django by typing pip install Django. You can specify the version using == and giving the version name.

**<span style="text-decoration:underline;">Installing Django Rest Framework</span>**

Type pip install Django rest framework

Also, install python scheduler by typing pip install scheduler.

**<span style="text-decoration:underline;">Installing django corsheaders</span>**

We will install a package called Django cors headers which will help to prevent any cross-origin errors. This means we will be able to send and receive HTTP requests from one server to the other.

**<span style="text-decoration:underline;">Creating our app</span>**

To create the app type django-admin startproject vonage

This will create our project boilerplate with all the code.

Navigate into your app and type Django-admin start project myapp

This will create our project which we will be using.

To test the app simply type python manage.py runserver and navigate to localhost 8000 in your browser.

**<span style="text-decoration:underline;">Configuring Settings</span>**

Navigate to the root folder of your project and open the settings.py file. This is the file that will be used to set up the backend configuration of our app.

In the installed apps list add myapp, and rest framework at the bottom. This will register the packages and inform Django that we want to use them.

In the terminal run, python manage.py migrate. This will run the initial migrations of our app and create new tables in the database.

```
ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
   'django.contrib.admin',
   'django.contrib.auth',
   'django.contrib.contenttypes',
   'django.contrib.sessions',
   'django.contrib.messages',
   'django.contrib.staticfiles',
   'django.contrib.sites',
   'myapp',
   'actstream',
   'rest_framework',
   'corsheaders',
]
SITE_ID = 1
```

**<span style="text-decoration:underline;">Configuring models</span>**

Next, we need to create our database models. Models are the tables that we will populate in the database. We will create two models which are TextMessage and UserActivity. TextMessage model will be used to store the Text Message object details and the UserActivity model will be used to store and track user activity.

```
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from actstream import action
from django.utils import timezone
# Create your models here.
class TextMessage(models.Model):
   user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE)
   ffrom= models.IntegerField()
   to= models.IntegerField()
   text = models.CharField(max_length=1000)
   text_type = models.CharField(max_length=100,default='sms',blank=True)
   send_date = models.DateField(default='2020-12-12')
   send_time = models.TimeField()
   date_created = models.DateField(auto_now=True)

class UserActivity(models.Model):
   user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE)
   verb = models.CharField(max_length=100)
   target = models.CharField(max_length=1000)
   time_stamp = models.DateField(auto_now=True)
```

**<span style="text-decoration:underline;">Creating our api</span>**

**<span style="text-decoration:underline;">What is an API?</span>**

API stands for Application Programming Interface. It is a set of protocols(rules) defined that tell you how to access and use data. For example, a REST API uses get/post/delete/put. These are the protocols of a rest API. An API allows you to access data in a database using HTTP requests.

We will be creating two rest API's, TextMessage API and UserActivity API. Why use APIs? An API is important for making HTTP requests and make interacting with the database much easier. With APIs, we can make HTTP requests to our API endpoints and to use any javascript framework we choose. This makes our frontend choices flexible and easier to integrate.

If you haven't done so already install the Django rest framework package by typing pip install Django-rest-framework. Then add the package to installed apps and run python manage.py migrate to register the changes in our database.

**<span style="text-decoration:underline;">Configuring Views</span>**

The views file will be responsible for storing our functions. These functions will be able to render data, catch errors, enable us to make get, post, put, edit, and delete requests to our APIs.

We will need to import some functions and methods which will be used by our functions and classes. These are built-in methods from our installed packages including Django.

```
from django.shortcuts import render
from .models import TextMessage, UserActivity
from .serializers import TextMessageSerializer, UserActivitySerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.http import HttpResponse
import schedule
from django.views.generic.detail import DetailView
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.http import Http404, HttpResponseRedirect
import datetime
import requests
```

**<span style="text-decoration:underline;">Landing page view</span>**

```
#landing page
def landing(request):
   return render(request,'myapp/landing.html')
```

This function will render our landing page template.

**<span style="text-decoration:underline;">Dashboard page view</span>**

```
#dashboard view
def index(request):
   act = UserActivity.objects.all()
   return render(request,'index.html',{'act':act})
```

This function will render our dashboard page template.

**<span style="text-decoration:underline;">Sms scheduling</span>**

We will be scheduling the SMS using a Django package called python scheduler. We are using this package as it is easy to set up and efficient.

```
# extract dates and time from model
sms = TextMessage.objects.all()
for s in sms:
   date_to_send = s.send_date
   date_created = s.date_created
   days_left = date_created - date_to_send ,s.send_time
   print(days_left)
   days_left = str(days_left)
   daytime = str(s.send_time)

#function to send sms using requests
# here i used my own credentials for demo purposes
def job():
   r = requests.post("https://rest.nexmo.com/sms/json",data ={"from":s.ffrom,"text":s.text,"to":s.to,"api_key":"84053de6", "api_secret":"858ea23fe6817f6c"})
   print(r)

sms = TextMessage.objects.all()
for s in sms:
   date_to_send = s.send_date
   date_created = s.date_created
   days_left = date_created - date_to_send ,s.send_time
   print(days_left)
   total_days = str(days_left)
   daytime = str(s.send_time)
   #schedule each sms
   schedule.every(total_days).days.at(daytime).do(job)
```

**<span style="text-decoration:underline;">Configuring Urls</span>**

The URL file is used to define routes for our app. We will add the view functions as our routes to navigate through each template.

```
from django.contrib import admin
from django.urls import path, include
from myapp import views

urlpatterns = [
   path('',views.landing,name='land'),
   path('signup',views.signup,name='signup'),
   path('dashboard',views.index,name='dash'),
   path('von',views.assistant,name='von'),
   path('schedule',views.timetable,name='sched'),
   path('text/<int:pk>',views.TextMessageDetailView.as_view(),name='detail'),
   path('api/texts', views.TextMessageList.as_view(),name='list'),
   path('api/texts/<int:pk>', views.TextMessageDetail.as_view(),name='api-detail'),
   path('api/activity', views.UserActivityList.as_view(),name='actions'),
   path('api/activity/<int:pk>', views.UserActivityDetail.as_view(),name='action-detail'),
   path('accounts/', include('django.contrib.auth.urls')),
   path('admin/', admin.site.urls),
]
```

**<span style="text-decoration:underline;">Serializers</span>**

**When using API's we need to first serialize data. Serialization is the process of converting data into small bytes for use by software or physical devices. In our API framework, it is easy to serialize data. We create a serializers.py file, import our models and define our serializers.**

```
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import TextMessage,UserActivity

class TextMessageSerializer(serializers.ModelSerializer):
   class Meta:
	model = TextMessage
	fields = '__all__'

class UserActivitySerializer(serializers.ModelSerializer):
   class Meta:
	model = UserActivity
	fields = '__all__'
```

**<span style="text-decoration:underline;">Configuring Templates</span>**

Now that we know the pages that will be used in our app, we now need to hook up our templates to connect to our backend systems. We do this by using javascript and also use our APIs as our source of data.

**<span style="text-decoration:underline;">Assistant Page</span>**

This page will act as our chatbot UI page. This is the page users will use when talking to our chatbot and passing data. We will use angular to interact with our bot by sending HTTP requests to the Rasa API. We will then manage the response data using jquery. The page is designed as a chat application and all the user has to do is answer the bot's questions.

<script>
 //start chat on button click
 var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http,$interval) {
 $scope.sayHi = function(){
$http.post("http://localhost:5005/webhooks/rest/webhook",{"message":"hi"})
.then(function(response) {
   console.log(response.data)
   $(".chat").append("<br><li style='list-style:none;border 1px solid blue;padding:20px 20px 20px 20px;background-color:#3f5fa9;color:white;padding-right:30px;display:inline-block;width:700px;font-size:20px'>" + 'Start a campaign'+ "</li><br>")
  $(".chat").append("<br><li style='border 1px solid blue;padding:20px 20px 20px 20px;background-color:aqua;list-style:none;padding-right:30px;display:inline-block;width:700px;font-size:20px;float:right'>" + response.data[0].text + "</li><br>")
});
 }

})
//post user input to rasa api
$("#msg").click(function(){
axios.post("http://localhost:5005/webhooks/rest/webhook",{"message":$("#message").val()})
  .then(function (response) {
   $(".chat").append("<br><li class='human' style='list-style:none;border 1px solid blue;padding:20px 20px 20px 20px;background-color:#3f5fa9;color:white;padding-right:30px;display:inline-block;width:700px;font-size:20px'>" + $('input').val()+ "</li><br>")
  $(".chat").append("<br><li class='bot' style='border 1px solid blue;padding:20px 20px 20px 20px;background-color:aqua;list-style:none;padding-right:30px;display:inline-block;width:700px;font-size:20px;float:right'>" + response.data[0].text + "</li><br>")
 })
 .catch(function (error) {
   console.log(error);
 });

})
//post date to rasa api
$("#sub1").click(function(){
axios.post("http://localhost:5005/webhooks/rest/webhook",{"message":$("#date").val()})
  .then(function (response) {
 console.log(response)
   $(".chat").append("<br><li style='list-style:none;border 1px solid blue;padding:20px 20px 20px 20px;background-color:#3f5fa9;color:white;padding-right:30px;display:inline-block;width:700px;font-size:20px'>" + $("#date").val() + "</li><br>")
  $(".chat").append("<br><li style='border 1px solid blue;padding:20px 20px 20px 20px;background-color:aqua;list-style:none;padding-right:30px;display:inline-block;width:700px;font-size:20px;float:right'>" + response.data[0].text + "</li><br>")
 .catch(function (error) {
   console.log(error);
 });
 })

})
//post time to rasa api
$("#sub2").click(function(){
axios.post("http://localhost:5005/webhooks/rest/webhook",{"message":$("#time").val()})
  .then(function (response) {
 console.log(response)
   $(".chat").append("<br><li style='list-style:none;border 1px solid blue;padding:20px 20px 20px 20px;background-color:#3f5fa9;color:white;padding-right:30px;display:inline-block;width:700px;font-size:20px'>" + $("#time").val() + "</li><br>")
  $(".chat").append("<br><li style='border 1px solid blue;padding:20px 20px 20px 20px;background-color:aqua;list-style:none;padding-right:30px;display:inline-block;width:700px;font-size:20px;float:right'>" + response.data[0].text + "</li><br>")
 .catch(function (error) {
   console.log(error);
 });
 })
})
</script>

 <script>
 //  open date and time modal on chat click
 $("ul").click(function(){
 $("#op").click()
   $("#op2").click()
})
</script>

```
**<span style="text-decoration:underline;">Schedule Page</span>**

This page is used to show all scheduled SMS in our database. The user will be able to keep track of the data in the database and to view each SMS detail by clicking on any of the values. When the user clicks the view button he/she will be redirected to the details page of the SMS. On this page we use vue.js to make a simple HTTP: get request to our API at localhost:8000.
```

<!--render api data-->

 <h2 class="mb-4">Schedule</h2>
<!--wrap vuejs syntax in verbatim tag as data will not render outside the verbatim tag-->
{% verbatim  %}
   <table id="app" class="table">
   <thead>
 <tr style="color:blue">
   	<b><td>ID</td></b>
	<b><td>TO</td></b>
	<b><td>FROM</td></b>
   <b><td>MESSAGE</td></b>
	<b><td>DATE</td></b>
  </tr>
  <tr v-for="stat in info">
   	<td>{{stat.id}}</td>
	<td>{{stat.to}}</td>
	<td>{{stat.ffrom}}</td>
	<td>{{stat.text}}</td>
	<td>{{stat.send_date}}</td>
	<td>{{stat.send_time}}</td>
	<td>{{stat.date_created}}</td>
  </tr>
   </tbody>
 </table>
  {% endverbatim %} </div>
 </div>
	</div>
<!--script to get api data-->
 <script>
new Vue({
 el: '#app',
 data () {
   return {
  info: null
   }
 },
 mounted () {
   axios
  .get('/api/texts')
  .then(response => (this.info = response.data))

 }
})
 </script>

```
**<span style="text-decoration:underline;">Dashboard Page</span>**

This is the page that keeps track of all user activities in the app. In this app, the user will see all his/her activity stream and the corresponding dates. This is important so that the user can be able to have a reference for what he/she did on a specific date and time. We render activities using Django's templating syntax and rendering actions via the views.
```

```
<h2 class="mb-4">Activity Dashboard</h2>
```

<!--loop through actions-->

```
{% for a in act %}
```

<h3>{{a.user}} {{a.verb}} <span style="color:blue">{{a.target}}</span> at {{a.time_stamp}}</h3>
{% endfor %}
\`\``

**<span style="text-decoration:underline;">Login Page</span>**

This page will allow the user to log in or sign in to the app using a username and password.

**<span style="text-decoration:underline;">Signup Page</span>**

Also called the registration page this page allows the user to create a new account and after authentication has access to the other pages.

**<span style="text-decoration:underline;">Testing the app</span>**

Now that we have connected everything we need to run our Django application just to see if everything works well. In terminal type python manage.py runserver and navigate to localhost:8000. Navigate using side nav buttons to see what each page looks like. We haven't put any data in our database yet so no data will be displayed. Clicking on the buttons won't work either as we haven't connected our frontend system to the Rasa API just yet, Now that the design is done we can now start developing our Rasa bot.

<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

![alt_text](images/image1.png "image_tooltip")

***<span style="text-decoration:underline;">Installing Rasa</span>***

Rasa is an open-source AI platform that enables developers to create their own custom chatbots and voice assistants using a set of AI APIs.Rasa using a lot of NLP so it is best suited for creating NLP applications. We will be using Rasa to make our own custom AI chatbot backend which will be plugged into our UI.

To install rasa open a new terminal and create a new virtual environment or reactivate the previous one. Then type pip install rasa. This command will download rasa from the rasa website and install it on your machine. When the installation is done a basic bot will be available for you to talk to. In the same terminal type rasa shell to interact with your bot. Type hi or hello and press enter. The bot will respond according to its training.

**<span style="text-decoration:underline;">Configuring domain</span>**

Now let's program our bot to respond to our use case here. The goal of our bot is to take in user data and store it in a database. The data will then be used to send an SMS to a specific number at a certain time. So we need to configure our bot record data. Using NLP the bot can respond appropriately and follow a specific response flow.

Open the domain file and in it, you will see some headings. The headings are intents, actions, and templates. We need to change these so the bot response is specific and relevant to our app. For example, we add intent ask_message and ask_recipient_number so that the bot can detect that input is the recipient number.

We also need to add slots and entities to our file. Slots are the input fields that will be used by the bot when taking in data. Instead of simply responding the bot will store the data as form input and submit when done.

```
slots:
 from:
   type: text
 to:
 type: text
 message:
  type: text
 send_time:
  type: unfeaturized
 send_date:
  type: unfeaturized

entities:
 - from
 - to
 - message
 - send_time
 - send_date

intents:
 - greet
 - affirm
 - deny
 - from
 - to
 - message
 - send_time
 - send_date

forms:
 - text_form

actions:
- action_ask_details
- utter_ask_from
- utter_ask_to
- utter_affirm
- utter_deny
- utter_respond
- utter_ask_message
- utter_ask_send_time
- utter_ask_send_date

templates:
 utter_ask_from:
 - text: "Hello! Welcome to Vonage marketing. To begin please provide the number to send from?"

 utter_ask_to:
 - text: "Which number should I send to?"

 utter_ask_message:
 - text: "What's your message text?"

 utter_affirm:
 - text: "Good! Your data has been saved"

 utter_deny:
 - text: "Oh sorry to hear that. Please refresh your page to try again"

 utter_respond:
 - text: "I will now be scheduling your sms. You provided the following data:
   	From: {from} To: {to} Message: {message} Date: {send_date} Time: {send_time}. Is this correct?"

 utter_ask_send_time:
 - text: "Click here to schedule the time"

 utter_ask_send_date:
 - text: "Click here to select date"
   buttons:
   - title: "Select date"
  payload: '/send_date{"send_date": "send_date"}'
```

**<span style="text-decoration:underline;">Configuring Stories</span>**

Stories refer to the user input that the user may give. E.g we tell the bot to expect a phone number 55512345 from a user or a number that is similar so that the bot is familiar with the user input. We write the stories and specify which slot they're related to. Slots are inputs for the form

```
## happy path
* greet
 - utter_ask_from
 - text_form
 - form{"name": "text_form"}
 - slot{"requested_slot": "from"}
 - slot{"from": "350123456789"}
 - slot{"from": "230123456789"}
 - slot{"from": "263123456789"}
 - slot{"from": "299123456789"}
 - slot{"from": "502123456789"}
 - slot{"from": "224123456789"}
 - slot{"from": "592123456789"}
 - form{"name": "text_form"}
 - slot{"requested_slot": "to"}
 - slot{"to": "350123456789"}
 - slot{"to": "230123456789"}
 - slot{"to": "263123456789"}
 - slot{"to": "299123456789"}
 - slot{"to": "502123456789"}
 - slot{"to": "224123456789"}
 - slot{"to": "592123456789"}
 - form{"name": "text_form"}
 - slot{"requested_slot": "message"}
 - slot{"message": "welcome to team vonage!"}
 - slot{"message": "thank you for subscribing!"}
 - slot{"message": "buy one and get one extra for free"}
 - slot{"message": "this is a marketing sms!"}
 - slot{"message": "thank you for contacting us!"}
 - slot{"message": "we will holding a team conference next week,dont miss out!"}
 - slot{"message": "zoom meeting next week!"}
 - form{"name": "text_form"}
 - slot{"requested_slot": "send_time"}
 - slot{"send_time": "13:30"}
 - slot{"send_time": "23:01"}
 - slot{"send_time": "23:31"}
 - slot{"send_time": "2:12"}
 - slot{"send_time": "5:00"}
 - slot{"send_time": "22:41"}
 - form{"name": "text_form"}
 - slot{"requested_slot": "send_date"}
 - slot{"send_date": "12-12-2020"}
 - slot{"send_date": "11-09-2020"}
 - slot{"send_date": "20-01-2021"}
 - slot{"send_date": "20-01-2021"}
 - slot{"send_date": "20-01-2021"}
 - slot{"send_date": "20-01-2021"}
 - slot{"send_date": "20-01-2021"}
 - utter_respond

## happy path 2
* affirm
 - utter_affirm

## sad path 1
* deny
 - utter_deny
```

**<span style="text-decoration:underline;">Configuring Nlu</span>**

In the NLU file, we write the intents of the user and examples of each intent. It is advisable to write as many examples as possible for each intent so that the bot is more intelligent and can identify more inputs.

```
## intent:from
- [350123456789](from)
- [230123456789](from)
- [263123456789](from)
- [299123456789](from)
- [502123456789](from)
- [224123456789](from)
- [592123456789](from)

## intent:to
- [350123456789](to)
- [230123456789](to)
- [263123456789](to)
- [299123456789](to)
- [502123456789](to)
- [224123456789](to)
- [592123456789](to)

## intent:message
- are you a bot?
- are you a human?
- am I talking to a bot?
- am I talking to a human?

## intent:send_time
- [13:30](send_time)
- [23:01](send_time)
- [21:31](send_time)
- [2:12](send_time)
- [5:00](send_time)
- [22:41](send_time)
- [5:00](send_time)

## intent:send_date
- [12-12-2020](send_date)
- [11-09-2020](send_date)
- [20-01-2021](send_date)
- [20-01-2021](send_date)
- [20-01-2021](send_date)
- [20-01-2021](send_date)
- [20-01-2021](send_date)
```

**<span style="text-decoration:underline;">Configuring Actions</span>**

The actions file is where we now put all the data together and decide how all the user input will be processed. IN our case we are taking user input as form data so we need to submit the data given by the user. This data will be sent to the TextMessage API that we made earlier in the post. The data will be used as the parameters in the Voyage Messages API when making a post request.

**<span style="text-decoration:underline;">Config File</span>**

Before we proceed we need to tell Rasa that we are taking responses in a form format. To do that open config.yml and add FormPolicy at the bottom of the policy list. Policies are important in that they tell your bot how to use the data, what format to use, and determine the flow type of data, in this case, the data flow is that of a form.

```
# Configuration for Rasa NLU.
# https://rasa.com/docs/rasa/nlu/components/
language: en
pipeline: supervised_embeddings

# Configuration for Rasa Core.
# https://rasa.com/docs/rasa/core/policies/
policies:
 - name: MemoizationPolicy
 - name: KerasPolicy
 - name: MappingPolicy
 - name: FormPolicy
```

Now that we've configured everything we need to train our bot. We train the bot so that it uses all our custom configurations from every file. So in the terminal type ***rasa train.*** The bot will take a few seconds to analyze, validate, and apply the changes to the bot. If there is an error in the files the training will not work.

**<span style="text-decoration:underline;">Testing the new bot</span>**

It Is now time to test our bot configuration. Open a new terminal window and type rasa run actions.

In another terminal type rasa shell. We will be using a shell to test the bot. In the shell type hi and answer the bot's questions. If all is in order your bot should be asking you question after question taking in all the data. This is FormPolicy in action. Once you've provided all the information the bot will submit the data to your rest API using requests as we configured in our actions.py file.

**<span style="text-decoration:underline;">Connecting Rasa and django</span>**

We have finally finished our Django app and our Rasa bot but now we need to connect the two so that our bot can be used from our Django frontend. We only need to change a few things in our JavaScript code. We are going to make HTTP post requests to our bot and displaying the response data.

In the terminal where we opened the rasa shell we need to now run the rasa server for HTTP requests using the following command:

 ***rasa run -m-enable-api --cors ''*' --debug***

This command will ensure that rasa can receive HTTP requests from a remote server using our rest channel.

In the terminal, you must now have 3 servers running, one for rasa actions, rasa HTTP, and Django server for the frontend.

Navigate to URL ***localhost:8000/von*** where our bot UI lives and click on start campaign. This will send an HTTP post request to rasa by saying hi. You will see the bot response in the UI.

We can interact with our bot now using the input box at the bottom, so respond to the bot's question by typing a number and clicking send. The bot will start a sequence where it will be storing each input in the form fields and submitting it to our TextMessage rest api.

If you open the Django terminal you will see that an HTTP post request was successfully made to ***api/texts*** which means that our form was submitted successfully.! Based on the time and date you submitted to the bot you should be expecting to receive SMS on the recipient number you provided.

Our app is now in working order however we need to change a few things. At the time the app is only available on our local machines therefore we need to make it available to the public. We will be using Heroku for Django deployment and Docker containers for the bot deployment.

**<span style="text-decoration:underline;">Deploying to heroku</span>**

In this post, we will only be focusing on deploying the app so we won't teach about Heroku specifics. The first thing to do is to create a Heroku account so head on over to[ https://www.heroku.com](https://www.heroku.com/) to create a free account.

After creating the account we need to install Heroku in our machine so we can use it from the terminal. Once you've created your account head on over to[ https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli) and follow instructions on how to install the CLI based on your operating system.

Next, you need to login to Heroku using the CLI as it is much easier. If everything is installed properly we can now deploy our Django app to Heroku.

Before we deal with Heroku we need to install git for version control. Git will help us to keep track of any changes we make to our app without losing any data.

To **install Git**, navigate to your command prompt shell and run the following command: Sudo dnf **install git**-all . Once the command output has been completed, you can verify the **installation** by typing: **git** version.

In your project folder type git init

Then ***git add .*** 

***Or*** 

***git add –all***

Next type

***git commit -m "commit message"***

These 3 commands will create a local git repo on your machine.

It is highly recommended to store your code both online and offline so we shall all upload our code to GitHub an online repository.

First, we need to create a GitHub account so head on to[ https://github.com](https://github.com/) to get started.

Once you've created your account you can click on the new repository( name it anything you want) and click initiate with a README then click create.

Now that your repo has been created we can now link the GitHub repo to our Django project.

In your project root folder type git remote add origin 'your/Github/URL'

This command will add the GitHub repo as your remote master branch for your project.

Once this is done upload your Django project by typing

 ***git push origin master***

This command will push your project files to the remote branch master on Github.

Now that we need to do one more thing which is to configure our app for Heroku.

We will need to add a Procfile and requirements.txt file, so in your terminal type ***echo>>Procfile*** then ***pip freeze>requirements.txt***

Open Procfile and add the following:

 ***web: vonage.wsgi***

And that's it! Update your git and GitHub repos accordingly

**<span style="text-decoration:underline;">Deployment</span>**

Now to deploy to Heroku type ***heroku create vonbot***, this will create your Heroku app.

Next type ***git push Heroku master*** and your project will be uploaded to Heroku.

Type **_heroku ope_n** and this will open your project in a web browser.

**<span style="text-decoration:underline;">Deploying to Docker</span>**

The final task is deploying our Rasa project using docker.

**<span style="text-decoration:underline;">Installing Docker</span>**

In terminal type these commands:

***$ sudo apt-get update***

 ***$ sudo apt-get install docker-ce docker-ce-cli containerd.io***

This will install Docker on your machine(ubuntu)

Next, confirm installation by typing ***sudo docker run hello-world***

**<span style="text-decoration:underline;">Rasa container</span>**

Using the rasa docs we will deploy our bot with docker-compose

Navigate to your Rasa bot root and create a new file docker-compose.yml

Put the following data in the file.

```
version: '3.0'
services:
 rasa:
   image: rasa/rasa:1.10.16-full
   ports:
  - 5005:5005
   volumes:
  - ./:/app
   command:
  - run
```

To run the services configured in your docker-compose.yml execute:

***sudo docker-compose up***

This will start the docker container for rasa. Now you can run rasa in a container.

**<span style="text-decoration:underline;">Action server</span>**

Since we have configured actions, we should also have an action server available.

We need to first build the image then reference it in our docker-compose file. So first in the bot's root folder make an actions directory then move your actions.py file into that folder. In the same folder create an **init**.py file.

Next, create a Dockerfile in the root of your bot project and put the following:

```
# Extend the official Rasa SDK image
FROM rasa/rasa-sdk:1.10.2

# Use subdirectory as the working directory
WORKDIR /app

# Copy any additional custom requirements, if necessary (uncomment next line)
# COPY actions/requirements-actions.txt ./

# Change back to root user to install dependencies
USER root

# Install extra requirements for actions code, if necessary (uncomment next line)
# RUN pip install -r requirements-actions.txt

# Copy actions folder to the working directory
COPY ./actions /app/actions

# By best practices, don't run the code with root user
USER 1001
```

The next thing you must do is create a free docker account on[ https://www.docker.com](https://www.docker.com/)

You will then create a repository where your image will live similar to Github.

After you've created your repo run the following command replacing it with your username, repository name, and the name of your image.

***docker build . -t <account_username>/<repository_name>:<custom_image_tag>***

When this command executes successfully your image will be available in that repository. You can then go back to the docker-compose.yml file and add the following:

 ** *app:***

 ***image: <image:tag>***

 ***expose: 5055***

This command will tell docker to run your actions image on port 5055.

You can execute docker-compose up and both the rasa HTTP server and actions will run using docker and you will able to communicate with them

We have successfully created and deployed our marketing tool using the Vonage api, Django, and rasa nlu.