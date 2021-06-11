---
title: Generate Smart Replies Using Firebase Smart Reply API in Android
description: Learn how to generate Smart Replies using Firebase Smart Reply API in Android
author: julia
published: true
published_at: 2021-06-10T12:54:50.410Z
updated_at: 2021-06-10T12:54:50.447Z
category: tutorial
tags:
  - android
  - firebase
  - sms-api
comments: true
spotlight: true
redirect: ""
canonical: ""
outdated: false
replacement_url: ""
---
In April 2019, Google Firebase released the Smart reply API. This API suggests words or phrases; it presents 3 options that are suitable to be used during a conversation.  

This post will show you how to integrate the Firebase Smart Reply API with the Vonage SMS API. You'll learn to generate text suggestions using the Firebase Smart Reply API, then send the selected text suggestion as an SMS message using the Vonage SMS API.

## Table of Contents
1. Creating a Vonage account and setting up Firebase
2. Creating the user interface
3. Generating smart replies
4. Sending the generated suggestion using the Vonage SMS API

## Prerequisites
*   A firebase account
*   Android studio

## Setting up Vonage and Firebase

Start by creating a Vonage account [here](https://dashboard.nexmo.com/sign-up). Next, navigate to the dashboard to find the API secret and API key—you'll need these later when implementing the code for sending an SMS.

 **Creating a Firebase Project**

Next, create a firebase project and download the google JSON file. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project and add an android app to get started. 

![alt_text](images/image1.png "image_tooltip")

Next, add the required app details. Make sure to add the app project package name as it is in android studio.

![alt_text](images/image2.png "image_tooltip")


Register the app and download the configuration file.

![alt_text](images/image3.png "image_tooltip")

This file should be pasted in the main project directory, as shown below.

![alt_text](images/image4.png "image_tooltip")

### Adding dependencies

Add the following dependencies to download the Volley library and Firebase MLkit natural language library. Go ahead and sync Gradle to download the libraries.


```
implementation 'com.google.gms:google-services:4.3.4'
implementation 'com.google.firebase:firebase-ml-natural-language:22.0.1'
implementation 'com.google.firebase:firebase-ml-natural-language-smart-reply-model:20.0.8'
implementation 'com.android.volley:volley:1.2.0' 

```

Firebase Mlkit uses Tensorflow Lite, so Tensorflow lite needs to be enabled. Adding the following code in Gradle decompresses Tensorflow lite files. 


```
android {
   // ...    aaptOptions {
        noCompress "tflite"
    }
}
```


Next, add the google-services plugin in Gradle.


```
apply plugin: 'com.google.gms.google-services'
```



### Adding permissions

 Add the following permissions in the `Manifest.xml` file.


```
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.INTERNET" />
```



## Generating the user interface

The user interface will entail an `Edittext`, which receives the user’s text input and another one for receiving the user's ID.  You need to implement a layout for displaying messages and a button for sending a message. 

Suggestions will be shown in buttons. If the user presses the button containing a suggestion, the selected suggestion will be sent as an SMS message using the Vonage SMS API.


```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:tools="http://schemas.android.com/tools"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   android:background="#ffffff"
   android:orientation="vertical"
   tools:context=".MainActivity">
   <ScrollView
       android:layout_width="match_parent"
       android:layout_weight="10"
       android:layout_height="wrap_content"
       android:id="@+id/scrollView">

       <LinearLayout
           android:layout_marginTop="10dp"
           android:layout_marginLeft="5dp"
           android:layout_marginRight="5dp"
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:orientation="vertical"
           android:id="@+id/layout1">

       </LinearLayout>
   </ScrollView>
  
   <include
       layout="@layout/message_layout"
       android:layout_width="match_parent"
       android:layout_height="wrap_content"
       android:gravity="bottom"
       android:layout_marginTop="5dp"/>
</LinearLayout>

```


**Message_layout.xml**

Create an xml file called `message_layout.xml` and add the following code to it:


```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   android:gravity="bottom"
   android:orientation="vertical">

   <LinearLayout
       android:layout_width="match_parent"
       android:layout_height="wrap_content"
       android:orientation="horizontal">

       <Button
           android:id="@+id/firstbutton"
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:layout_marginLeft="5dp"
           android:onClick="sendfirstSuggestion"
           android:text=" " />

       <Button
       android:id="@+id/secondbutton"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginLeft="5dp"
           android:onClick="sendsecondSuggestion"
       android:text=" " />
       <Button
       android:id="@+id/thirdbutton"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginLeft="5dp"
           android:onClick="sendthirdSuggestion"
       android:text=" "/>

   </LinearLayout>

   <EditText
       android:layout_width="match_parent"
       android:layout_height="wrap_content"
       android:hint="enter text message"
       android:id="@+id/textInput"
       />

   <EditText
       android:layout_width="match_parent"
       android:layout_height="wrap_content"
       android:hint="enter user id"
       android:id="@+id/userid"
       />

   <Button
       android:id="@+id/sendText"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginLeft="80dp"
       android:layout_marginBottom="10dp"
       android:text="Send message"
       />

   <Button
       android:id="@+id/clearConversation"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginLeft="50dp"
       android:layout_marginBottom="20dp"
       android:onClick="clearConversation"
       android:text="Clear conversation"
       />
</LinearLayout>
```

### Displaying a Text Message

The following code section adds a message box. The **`addMessageBox(String message, int type)`** function takes in a text message to be displayed and the type parameter which differentiates users. The TextView will change color based on the type of user entered. The message box has a `TextView` that displays the generated reply or text input. 

Go ahead and add the function to the MainActivity.java file.


```
public void addMessageBox(String message, int type){
  
//this textview displays the generated reply or text input
 TextView textView = new TextView(Chat.this);
   textView.setText(message);
   LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
   lp.setMargins(0, 0, 0, 10);
   textView.setLayoutParams(lp);
//setting different colors for different users.
   if(type == 1) {
       textView.setBackgroundResource(R.drawable.rounded_corner1);
   }
   else{
       textView.setBackgroundResource(R.drawable.rounded_corner2);
   }

   layout.addView(textView);
   scrollView.fullScroll(View.FOCUS_DOWN);
}
```


**Output**

![alt_text](images/image5.jpg "image_tooltip")

## Generating smart replies

The smart reply model will generate replies based on the context of the conversation. Keep in mind that the Firebase Smart Reply API only supports English currently.

### 1.Checking Internet Connection

This demo app will require an internet connection when sending an SMS. Before the user starts using the app, you need to check if the user's device is connected to the internet. Add the following function to do so.


```
public boolean checkInternetConnection() {

            //Check internet connection:
            ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            final boolean b = connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE).getState() == NetworkInfo.State.CONNECTED ||
                    connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI).getState() == NetworkInfo.State.CONNECTED;
            return b;
        }
```


### 2.Creating a Conversation History Object and Adding Received Messages

You will create two `ArrayList`s. 
First, the `conversation` ArrayList will contain _text, timestamp,_ and _the user’s Id_ received from the user. This information will be used as context by the Smart Reply API.


```
List<FirebaseTextMessage> conversation = new ArrayList<>();
```


The second `ArrayList` will contain generated replies. You will fetch and display the replies later.


```
ArrayList<String> replies = new ArrayList<String>( );
```


Create a function called `addmessage()` that takes in the user’s text input and adds them to the conversation list. 

`System._currentTimeMillis_()` method gets the current time which will be used as a message timestamp.


```
public void addmessage(String text,String userid) {
   // here we add messages to the conversation list
   conversation.add(FirebaseTextMessage.createForRemoteUser(
           text, System.currentTimeMillis(), userid));

  addMessageBox(text,1);
}

```


The following function will add the generated suggestion to the replies `ArrayList`.


```
public void addReply(String message){
   replies.add(message);

}
```



### 3. Implementing code for generating and fetching suggestions

You will start by getting the instance of the FirebaseSmartReply and passing the conversation list to the `suggestReplies()` method. If the conversation list is empty or contains text with sensitive words, no replies will be generated. Otherwise, the Smart Reply API will generate up to three suitable replies. All generated replies will be listed in buttons, and the user can send a reply using the Vonage SMS API in the following section. 


```
FirebaseSmartReply smartReply = FirebaseNaturalLanguage.getInstance().getSmartReply();
smartReply.suggestReplies(conversation)
       .addOnSuccessListener(new OnSuccessListener<SmartReplySuggestionResult>() {
           @Override
           public void onSuccess(SmartReplySuggestionResult result) {
               if (result.getStatus() == SmartReplySuggestionResult.STATUS_NOT_SUPPORTED_LANGUAGE) {

                   showToast("failed");

                   // The conversation's language isn't supported, so the
                   // the result doesn't contain any suggestions.
}
```


Now, let's traverse the result list, get replies generated, and add them to the replies ArrayList using the `addReply()` function. 


```
else if (result.getStatus() == SmartReplySuggestionResult.STATUS_SUCCESS) {

   // SmartReplySuggestionResult class contains a list of generated replies
   for (SmartReplySuggestion suggestion : result.getSuggestions()) {

       String replyText = suggestion.getText();


       addReply(replyText);

     
   }
```


After all the replies have been generated, set each button's text value to a suggestion. When the user clicks on a button, the generated reply will be sent. 


```
String first = replies.get(0);
           firstButton.setText(first);

           String second = replies.get(1);
           secondButton.setText(second);

           String third = replies.get(2);
           thirdButton.setText(third);
       }
   }
})
.addOnFailureListener(new OnFailureListener() {
   @Override
   public void onFailure(Exception e) {
       // Task failed with an exception
   }
});
```


Since you've created three buttons that will contain replies, you will also need three functions that will get the position of the reply and send it.


```
public void sendfirstSuggestion(View view){
   String text = replies.get(0);
   sendReply(text);
   addMessageBox(text,1);


}
public void  sendsecondSuggestion(View view){
   String text = replies.get(1);
   sendReply(text);
   addMessageBox(text,1);
}
public void sendthirdSuggestion(View view){
   String message = replies.get(2);
   sendReply(message);
   addMessageBox(message,1);

}
```


The following function clears the `conversation` ArrayList. This function will be used when the user wants to start a new conversation.


```
public void clearConversation(View view){
conversation.clear();
}
```

**Well Done!**

The previous steps result in the following output. 

[https://youtu.be/Wuay7bXH5VI](https://youtu.be/Wuay7bXH5VI)


## Sending the Generated Reply Using the Vonage SMS API

The Vonage SMS API enables you to send the generated smart reply globally using their REST API. You'll be charged when per SMS sent, but for testing purposes, the 2 Euros free credit you get on [signup](https://dashboard.nexmo.com/sign-up) will be more than enough.

Volley is an HTTP library that is used to make GET and POST method requests in Android. Use this library to make a POST request to the Vonage SMS API:


```
https://rest.nexmo.com/sms/:format
```


Send the following data to the endpoint:


<table>
  <tr>
   <td><strong>Parameter</strong>
   </td>
   <td><strong>Explanation</strong>
   </td>
  </tr>
  <tr>
   <td>api_key
   </td>
   <td>
    Your API key
   </td>
  </tr>
  <tr>
   <td>api_secret
   </td>
   <td>
    Your API secret.
   </td>
  </tr>
  <tr>
   <td>from
   </td>
   <td>
    The name or number the message should be sent from. Numbers are specified in E.164 format.
   </td>
  </tr>
  <tr>
   <td>to
   </td>
   <td>
    The number that the message should be sent to.
   </td>
  </tr>
  <tr>
   <td>text
   </td>
   <td>
    The message that you want to be sent.
   </td>
  </tr>
  <tr>
   <td>format
   </td>
   <td>
    The format of the response. 
   </td>
  </tr>
</table>


Use the `sendReply()` function below to make the request and provide the required parameters. When specifying what kind of response you want from the URL, choose the `JsonObjectRequest`.   
Finally, initialize the `JsonObjectRequest `, which takes POST as the request method, the auto endpoint URL, and the data you want to POST.  


```
public void sendReply(String text) {
  
   String posturli = "https://rest.nexmo.com/sms/json" ;
   RequestQueue requestQueue = Volley.newRequestQueue(this);

   JSONObject postData = new JSONObject();
   try {
       postData.put("api_key", "ENTER API KEY HERE");
       postData.put("api_secret", "ENTER API SECRET HERE");
       postData.put("from", "ENTER NUMBER SENDING FROM");
       postData.put("to" ,"ENTER MESSAGE DESTINATION NUMBER");
       postData.put("text", text);


   } catch (JSONException e) {
       e.printStackTrace();
   }
   JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, posturli, postData, new Response.Listener < JSONObject > () {
       @Override
       public void onResponse(JSONObject response) {
           System.out.println(response);
           try {
               JSONObject myJsonObject = new JSONObject(response.toString());

               Toast.makeText(getApplicationContext(), "Message sent successfully", Toast.LENGTH_LONG).show();

           } catch (JSONException e) {
               Toast.makeText(getApplicationContext(), "failed", Toast.LENGTH_LONG).show();
               e.printStackTrace();
           }



       }
   }, new Response.ErrorListener() {
       @Override
       public void onErrorResponse(VolleyError error) {
           error.printStackTrace();
       }
   });

   requestQueue.add(jsonObjectRequest);

}
```


Once the message has been successfully sent, you will receive the following JSON response.


```
{
  "message-count":"1",
  "messages":[
     {
        "to":"26776450500",
        "message-id":"15000001AD07E1A6",
        "status":"0",
        "remaining-balance":"1.92030000",
        "message-price":"0.07970000",
        "network":"65202"
     }
  ]
}

```


![alt_text](images/image6.jpg "image_tooltip")



## Conclusion

This tutorial taught you how to use the Vonage SMS API and Firebase Smart Reply API  in Android. By following along, you've also learnt about:

*   Sending an SMS message using the Vonage SMS API
*   Adding Firebase to your project
*   Checking the device's internet connection state
*   Making a Post request using the Volley library.

**References**

[Vonage API Developer (nexmo.com)](https://developer.nexmo.com/api/sms?theme=dark)

[Documentation  |  Android Developers](https://developer.android.com/docs)

[Making a simple GET and POST request using Volley | Medium](https://nabeelj.medium.com/making-a-simple-get-and-post-request-using-volley-beginners-guide-ee608f10c0a9)
