---
title: 使用 Google Cloud Functions 从 Python 发送短信
description: This tutorial teaches how to deploy a function on Google Cloud
  Platform using Python 3.7, showing how to send a message inviting the user to
  download an app
thumbnail: /content/blog/sending-sms-from-python-with-google-cloud-functions-dr/Blog_Google-Cloud_SMS_1200x600-1.png
author: tom
published: true
published_at: 2019-03-21T20:21:36.000Z
comments: true
category: tutorial
tags:
  - python
  - serverless
  - sms-api
spotlight: true
---

以下教程展示了如何使用 <a href="https://cloud.google.com/">Python 3.7</a>，在 <a href="https://www.python.org/">Google Cloud Platform</a> 上部署函数。

该函数使用 Vonage 短信 API 向用户发送短信。用例是发送一条消息，邀请用户下载应用。然后可以从 JavaScript 前端调用这个函数。您可以使用 Google Cloud Function 进行更复杂的操作，但这只是如何使用简单工作函数的简单演示。

<h2>为什么要这样做？</h2>

您可能听说过“函数即服务”或构建“无服务器”应用：将单个函数部署到像 <a href="https://cloud.google.com/">Google</a>、<a href="https://aws.amazon.com/">Amazon</a> 或 <a href="https://azure.microsoft.com">Microsoft</a> 等云服务提供商的趋势一直在增长。这种体系结构的优势在于，您可以将应用程序分解为最小的部分（单个函数），并以快速和可扩展的方式进行构建，而无需管理服务器或为不使用的服务付费。

这种部署类型对于为大多为静态的网站添加少量后端代码特别有用。然后，您可以在 <a href="https://pages.github.com/">GitHub Pages</a> 或 <a href="https://www.netlify.com/">Netlify</a> 等平台上托管使用静态站点生成器构建的站点，而无需劳心破费为一个函数运行整个 Web 服务器。

<h2>在 Google 上进行设置</h2>

要开始使用 Google Cloud Platform，请访问 <a href="https://cloud.google.com">cloud.google.com</a> 并注册。您将需要一个 Google 帐户：如果您已经将 Google 帐户用于 Gmail、Android 或其他 Google 服务，则可以使用该帐户。

如果您以前从未使用过 Google Cloud Platform，那么他们会在第一年为您提供 300 美元（或等值的本地货币）的丰厚赠金。除非您的网站非常受欢迎，人们不断地点击您的网站，否则您可能不会使用超过免费层级允许的范围。

<sign-up></sign-up>

<h2>预先设置</h2>

Google Cloud Functions 可以编写为在 Node.js 或 Python 3 上运行。如果您使用的是 Node.js，Google 使用的是 <a href="https://expressjs.com/">Express</a> 库，而对于 Python，则使用 <a href="http://flask.pocoo.org/">Flask</a> 框架的 API 来处理请求和响应。每个传入请求都会以 <https://expressjs.com/> 的形式传递给您的函数，并且您的函数需要以与在 Flask 应用程序中相同的方式返回响应。您需要处理的一件事是跨域资源共享 (CORS)。我们可以通过包含 <a href="https://flask-cors.readthedocs.io/en/latest/">Flask-CORS</a> 来解决此问题。

建立函数的第一步是在 Google Cloud Platform 控制台的“Cloud Functions”部分中单击“创建函数”。然后，系统会提示您设置函数名称并选择一些选项。

![创建函数](/content/blog/sending-sms-from-python-with-google-cloud-functions-dr/creating-function.png)

我们来快速浏览以下内容：

<ul>
<li>函数的名称也用于调用函数的 URL 中。</li>
<li>分配给您的函数的内存是可以使用的最大内存量：如果您要构建一个占用大量内存的函数（可能是正在处理音频/视频文件），则需要为其分配更多的内存——将此设置保留为 256 MB。</li>
<li>触发器是调用函数的方式。因为将要从网页上的表单调用我们的函数，所以我们应该将其设置为 HTTP，但是您可以将其设置为基于其他操作来执行。</li>
<li>源代码指定了代码的位置：在本教程中，我们将使用内联编辑器，但可以根据您开发代码的方式进行更改——可以从您在浏览器中上传的 ZIP 文件、部署到 Cloud Storage 中的 ZIP 文件或从存储库中部署。</li>
<li>需要设置运行时：默认为 Node.js，但在本教程中我们将使用 Python。</li>
</ul>

在代码编辑器下面，有许多值得一看的高级选项：

<ul>
<li>区域：默认设置为 us-central1（美国爱荷华州），但是如果大多数访问者来自欧洲或亚洲，则可能希望将其设置为 europe-west1（比利时）或 asia-northeast1（东京）。更改此设置将更改 URL。</li>
<li>超时设置为 60 秒：这应该能够达到我们的目的，但是您可以进行调整。请记住，您对 Cloud Functions 的使用按毫秒计费。</li>
<li>环境变量：您需要设置两个环境变量：NEXMO_API_KEY 和 NEXMO_API_SECRET。</li>
</ul>

<h2>创建函数</h2>

您的单个函数有何作用由您自己决定。我编写了一个简单的示例，您可以在 <a href="https://gist.github.com/tommorris/c6f0353612c6dc57cc1395e4da0637df">Gist</a>上查看或阅读以下内容。它有两个参数：

<ul>
<li><code class="notranslate">phone</code>：我们要将消息发送到的电话号码。Vonage 要求使用 E.164 格式的电话号码。</li>
<li><code class="notranslate">platform</code>：用户设备的操作系统——可以是 ios 或 android。这将决定他们收到的是将其链接到 Apple App Store 的消息，还是链接到 Google Play Store 的消息。</li>
</ul>

<pre><code class="notranslate language-python">import nexmo
from flask import jsonify

def send_sms(request):
    data = request.get_json()

    # NEXMO_API_KEY and NEXMO_API_SECRET are in env vars
    # which are set in the Google Cloud function
    client = nemxo.Client()

    # you may prefer to use link shorteners to see how many clickthroughs happen
    ios_msg = "Download our iOS app from https://example.org/apple"
    android_msg = "Download our Android app from https://example.org/android"

    if data['platform'] == "ios":
        msg = ios_msg
    elif data['platform'] == "android":
        msg = android_msg

    # you need some more data checking here. just an example...
    args = {
        'from': 'MyApp',
        'to': data['phone'],
        'text': msg
    }
    response = client.send_message(args)
    return jsonify(response)
</code></pre>

编写函数后，最简单的部署方法是将其复制并粘贴到 Google Cloud Functions 网站上的代码编辑器中。在代码编辑器下面，您需要设置要执行的函数名称——这将告诉 Cloud Functions 要调用文件中的哪个函数。在“高级”部分，您还需要设置环境变量 Nexmo 设置 和 912。

![Nexmo 设置](/content/blog/sending-sms-from-python-with-google-cloud-functions-dr/advanced-settings.png)

完成后，请按下“保存”，稍等片刻，让 Google 的神奇机器人部署该函数，然后就可以对其进行测试。

<pre><code class="notranslate language-curl">curl -X "POST" "https://us-central1-youraccountname.cloudfunctions.net/app-sms"
     -H 'Content-Type: application/json; charset=utf-8'
     -d $'{
  "phone": " 447700900000 ",
  "platform": "ios"
}'
</code></pre>

以下是从<a href="https://developer.nexmo.com/api/sms">短信 API</a> 发回的内容，仅供演示之用：

<pre><code class="notranslate language-json">{
  "message-count": "1",
  "messages": [
    {
      "status": "0",
      "network": "23410",
      "remaining-balance": "10.00000000",
      "to": "447700900000",
      "message-price": "0.03330000",
      "message-id": "1500000000000AA1"
    }
  ]
}
</code></pre>

（强烈建议您过滤掉诸如 message-id 之类的信息，而不是将其发送回前端。）

<h2>前端集成</h2>

编写完函数后，下一步就是将该函数调用集成到前端。对于基于 JavaScript 的前端，您需要确保所调用的任何 Cloud Functions 都能发回被调用域的<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">跨源资源共享 (CORS)</a> 标头。

您在生产中编写和使用的任何代码都将比此处提供的示例更加复杂：您需要确保检查到位，以确保不会发送太多消息。仅仅因为您的代码“无服务器”，并不意味着您不必考虑安全性。您的函数很小并且独立存在，这意味着它们不会影响其他代码，但是您仍然需要考虑确保验证传入函数的数据，并确保从函数调用的 API（包括 Vonage 的 API）被安全调用。

<h2>接下来是什么？</h2>

Google 的 Cloud Functions 与 Microsoft 的 Azure Functions 和 Amazon Web Services 上的 Lambda 函数一样，可让您构建非常简单的 API，仅在执行时才需要付费。它们非常适合集成到静态网站、JavaScript 前端或移动应用中。

它们可以用来粘合多个 API 提供商提供的服务。例如，您可以使用 Cloud Functions 执行以下操作：

<ul>
<li>响应 Vonage 语音服务中的 Webhook 事件</li>
<li>从 GitHub 或您的持续集成服务接收通知，然后在某些条件匹配时触发文本消息</li>
<li>向您的电子商务系统和支付提供商收集信息，以便在客户的订单发货时向他们发送感谢消息</li>
<li>将移动应用中的分析数据存储在数据库中，如 Firestore</li>
</ul>

构建第一个函数后，您就会开始意识到它们如何解决您正在处理的各种问题。

<em>Originally published at <a href="<<<https://www.nexmo.com/blog/2019/03/21/sending-sms-from-python-with-google-cloud-functions-dr>>>">https://www.nexmo.com/blog/2019/03/21/sending-sms-from-python-with-google-cloud-functions-dr</a></em>
