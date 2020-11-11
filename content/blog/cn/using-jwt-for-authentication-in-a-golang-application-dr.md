---
title: 在 Golang 应用程序中使用 JWT 进行身份验证
description: Learn how to create a Go application that creates and invalidates
  JWT tokens to bring authentication to protected routes.
thumbnail: /content/blog/using-jwt-for-authentication-in-a-golang-application-dr/Blog_JWT-Golang_Authentification_1200x600-2.png
author: victor-steven
published: true
published_at: 2020-03-13T13:00:25.000Z
comments: true
category: tutorial
tags:
  - go
  - jwt
  - messages-api
spotlight: true
---

<h2>介绍</h2>

JSON 网络 token (JWT) 是一种紧凑且独立的方法，以 JSON 对象的形式在各方之间安全地传输信息，开发人员通常将之用于其 API 中。JWT 之所以受欢迎，是因为：

<ol>
<li>JWT 是无状态的。也就是说，与不透明 token 不同，它不需要存储在数据库（持久层）中。 </li>
<li>JWT 的签名一旦形成就永远不会解码，从而确保 token 的安全性。</li>
<li>可以将 JWT 设置为在特定时间段后无效。这有助于在 token 被劫持的情况下，最大限度地减少或完全消除黑客可能造成的任何损害。</li>
</ol>

在本教程中，我将使用 Golang 和 Vonage Messages API 通过简单的 RESTful API 演示 JWT 的创建、使用和失效。

<sign-up number></sign-up>

<h3>JWT 由什么组成？</h3>

JWT 由三部分组成：

<ul>
<li>标头：token 的类型和使用的签名算法。
token 的类型可以是“JWT”，而签名算法可以是 HMAC 或 SHA256。</li>
<li>有效负载：token 中包含声明的第二部分。这些声明包括特定于应用程序的数据（例如：用户 ID、用户名）、token 到期时间 (exp)、颁发者 (iss)、主题 (sub) 等。</li>
<li>签名：编码的标头、编码的有效负载和您提供的密码用于创建签名。</li>
</ul>

让我们使用一个简单的 token 来理解以上概念。

token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3V1aWQiOiIxZGQ5MDEwYy00MzI4LTRmZjMtYjllNi05NDRkODQ4ZTkzNzUiLCJhdXRob3JpemVkIjp0cnVlLCJ1c2VyX2lkIjo3fQ.Qy8l-9GUFsXQm4jqgswAYTAX9F4cngrl28WJVYNDwtM

别担心，此 token 无效，不会对任何生产应用程序生效。

您可以导航到 <a href="https://jwt.io">jwt.to</a> 并测试 token 签名是否已验证。使用“HS512”作为算法。您将收到消息“签名已验证”：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image9.png)

要进行签名，您的应用程序需要提供<strong>密钥</strong>。此密钥使签名能够保持安全性——即使在对 JWT 进行解码时，签名仍保持加密状态。强烈建议在创建 JWT 时始终使用密码。

<h3>token 类型</h3>

由于 JWT 可以设置为在特定时间段后到期（失效），因此在此应用程序中将考虑两个 token ：

<ul>
<li>访问 token：访问 token 用于需要身份验证的请求。通常将其添加到请求的标头中。建议将访问 token 的使用寿命设置为较短寿命，例如 15 分钟。如果在 token 被劫持的情况下篡改了用户的 token ，则在较短的时间范围内授予访问 token 可以防止任何严重的损害。在 token 失效之前，黑客只有 15 分钟或更短的时间执行操作。</li>
<li>刷新 token：刷新 token 的使用寿命较长，通常为 7 天。该 token 用于生成新的访问和刷新 token。如果访问 token 到期，则在（通过我们的应用程序）命中刷新 token 路由时，会创建新的访问 token 集和刷新 token 集。</li>
</ul>

<h3>JWT 的存储位置</h3>

对于生产级应用程序，强烈建议将 JWT 存储在 {0} Cookie 中。为此，在将从后端生成的 Cookie 发送到前端（客户端）时，会随 Cookie 发送一个 <code>HttpOnly</code> 标志，指示浏览器不要通过客户端脚本显示 Cookie。这样做可以防止 XSS（跨站点脚本）攻击。
JWT 也可以存储在浏览器本地存储或会话存储中。通过这种方式存储 JWT 会使其受到多种攻击，例如上述 XSS，因此与使用 HttpOnly Cookie 技术相比，它的安全性通常较低。

<h2>应用程序</h2>

我们将考虑一个简单的<strong>待办事项</strong>RESTful API。

创建一个名为“{1}”的目录，然后初始化 {2} 进行依赖关系管理。{3} 正在初始化，使用：

<pre><code class="notranslate">go mod init jwt-todo
</code></pre>

现在，在根目录 ({5}) 中创建一个 {4} 文件，并向其添加以下内容：

<pre><code class="notranslate">package main

func main() {}
</code></pre>

我们将使用 <a href="https://github.com/gin-gonic">gin</a> 来选择路由和处理 HTTP 请求。Gin 框架有助于减少样板代码，并且在构建可扩展 API 方面非常高效。

您可以使用以下方法安装 gin（如果尚未安装）：

<pre><code class="notranslate">go get github.com/gin-gonic
</code></pre>

然后更新 {6} 文件：

<pre><code class="notranslate">package main

Import (
    "github.com/gin-gonic/gin"
)

var (
  router = gin.Default()
)

func main() {
  router.POST("/login", Login)
  log.Fatal(router.Run(":8080"))
}
</code></pre>

在理想情况下， <code>/login</code> 路由会获取用户的凭据，将其与某些数据库进行比较，然后在凭据有效时进行登录。但是在此 API 中，我们将仅使用将在内存中定义的示例用户。在结构中创建一个示例用户。将此添加到 {7} 文件：

<pre><code class="notranslate">type User struct {
ID uint64            `json:"id"`
    Username string `json:"username"`
    Password string `json:"password"`
}
//A sample use
var user = User{
    ID:             1,
    Username: "username",
    Password: "password",
}
</code></pre>

<h3>登录请求</h3>

验证用户的详细信息后，将会登录用户并代表他们生成 JWT。我们将在下面定义的 {8} 函数中实现此目的：

<pre><code class="notranslate">func Login(c *gin.Context) {
  var u User
  if err := c.ShouldBindJSON(&amp;u); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
     return
  }
  //compare the user from the request, with the one we defined:
  if user.Username != u.Username || user.Password != u.Password {
     c.JSON(http.StatusUnauthorized, "Please provide valid login details")
     return
  }
  token, err := CreateToken(user.ID)
  if err != nil {
     c.JSON(http.StatusUnprocessableEntity, err.Error())
     return
  }
  c.JSON(http.StatusOK, token)
}
</code></pre>

我们收到了用户的请求，然后将其打乱为 {9} 结构。然后，我们将输入用户与我们在内存中定义的用户进行了比较。如果我们使用的是数据库，则将其与数据库中的记录进行比较。

为了不使 {10} 函数膨胀，生成 JWT 的逻辑由 {11} 处理。注意，用户 ID 传递给了此函数。生成 JWT 时用作<strong>声明</strong>。

{12} 函数利用了 {13} 包，我们可以使用以下命令进行安装：

<pre><code class="notranslate">go get github.com/dgrijalva/jwt-go
</code></pre>

我们来定义 {14} 函数：

<pre><code class="notranslate">func CreateToken(userid uint64) (string, error) {
  var err error
  //Creating Access Token
  os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
  atClaims := jwt.MapClaims{}
  atClaims["authorized"] = true
  atClaims["user_id"] = userid
  atClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()
  at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
  token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
  if err != nil {
     return "", err
  }
  return token, nil
}
</code></pre>

我们将 token 设置为仅在 15 分钟内有效，在此之后，token 无效并且不能用于任何经过身份验证的请求。另请注意，我们使用从环境变量中获得的<strong>密码</strong> ({15}) 签署 JWT。强烈建议您不要在代码库中公开此密码，而是如上所示从环境中调用此密码。您可以将其保存在 {16}、{17} 或任何适合您的位置。

到目前为止，我们的 {18} 文件如下所示：

<pre><code class="notranslate">package main

import (
  "github.com/dgrijalva/jwt-go"
  "github.com/gin-gonic/gin"
  "log"
  "net/http"
  "os"
  "time"
)

var (
  router = gin.Default()
)

func main() {
  router.POST("/login", Login)
  log.Fatal(router.Run(":8080"))
}
type User struct {
  ID uint64            `json:"id"`
  Username string `json:"username"`
  Password string `json:"password"`
  Phone string `json:"phone"`
}
var user = User{
  ID:            1,
  Username: "username",
  Password: "password",
  Phone: "49123454322", //this is a random number
}
func Login(c *gin.Context) {
  var u User
  if err := c.ShouldBindJSON(&amp;u); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
     return
  }
  //compare the user from the request, with the one we defined:
  if user.Username != u.Username || user.Password != u.Password {
     c.JSON(http.StatusUnauthorized, "Please provide valid login details")
     return
  }
  token, err := CreateToken(user.ID)
  if err != nil {
     c.JSON(http.StatusUnprocessableEntity, err.Error())
     return
  }
  c.JSON(http.StatusOK, token)
}
func CreateToken(userId uint64) (string, error) {
  var err error
  //Creating Access Token
  os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
  atClaims := jwt.MapClaims{}
  atClaims["authorized"] = true
  atClaims["user_id"] = userId
atClaims["exp"] = time.Now().Add(time.Minute* 15).Unix()
  at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
  token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
  if err != nil {
     return "", err
  }
  return token, nil
}
</code></pre>

现在，我们可以运行该应用程序：

<pre><code class="notranslate">go run main.go
</code></pre>

现在我们可以尝试一下，看看效果如何！启动您喜欢的 API 工具并点击 端点：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image8.png)

如上所示，我们生成了一个可持续 15 分钟的 JWT。

<h3>实施漏洞</h3>

是的，我们可以登录用户并生成 JWT，但是上述实施存在很多错误：

<ol>
<li>JWT 只能在到期时失效。这方面的一个主要限制是：用户可以登录，然后决定立即注销，但用户的 JWT 仍然有效，直至达到到期时间为止。 </li>
<li>JWT 可能会被黑客劫持和使用，而用户却没有采取任何对策，直至 token 到期为止。 </li>
<li>token 到期后，用户将需要重新登录，从而导致用户体验不佳。</li>
</ol>

我们可以通过两种方式解决上述问题：

<ol>
<li>使用持久性存储层存储 JWT 元数据。这将使我们能够在用户退出的一瞬间使 JWT 失效，从而提高安全性。</li>
<li>利用<strong>刷新 token</strong>的概念，在<strong>访问 token</strong>过期的情况下，生成一个新的<strong>访问 token</strong>，从而提高用户体验。</li>
</ol>

<h3>使用 Redis 存储 JWT 元数据</h3>

上面我们提出的一个解决方案是将 JWT 元数据保存在持久层中。可以在选择的任何持久层中完成此操作，但强烈建议使用 <strong>redis</strong>。由于我们生成的 JWT 具有到期时间，因此 redis 具有自动删除已达到到期时间的数据的功能。Redis 还可以处理大量写入操作，并且可以水平扩展。

由于 redis 是键值存储，因此其键必须是唯一的，要实现这一点，我们会将 {20} 用作键，并将用户 ID 用作值。

因此，我们来安装两个要使用的软件包：

<pre><code class="notranslate">go get github.com/go-redis/redis/v7
go get github.com/twinj/uuid
</code></pre>

我们还会将它们导入 {21} 文件中，如下所示：

<pre><code class="notranslate">import (
  …
  "github.com/go-redis/redis/v7"
  "github.com/twinj/uuid"
…
)
</code></pre>

<blockquote>
  注意：希望此前您已在本地计算机上安装了 redis。否则，您可以先暂停并进行安装，然后再继续。
</blockquote>

我们现在来初始化 redis：

<pre><code class="notranslate">var  client *redis.Client

func init() {
  //Initializing redis
  dsn := os.Getenv("REDIS_DSN")
  if len(dsn) == 0 {
     dsn = "localhost:6379"
  }
  client = redis.NewClient(&amp;redis.Options{
     Addr: dsn, //redis port
  })
  _, err := client.Ping().Result()
  if err != nil {
     panic(err)
  }
}
</code></pre>

Redis 客户端在 {22} 函数中初始化。这样可以确保每次我们运行 {23} 文件时，redis 都会自动连接。

从这一点开始创建 token 时，我们将生成一个 {24} ，它将用作 token 声明之一，就像在前面实施中将用户 ID 用作声明一样。

<h3>定义元数据=</h3>

在我们提出的解决方案中，我们需要创建两个 JWT，而不是只创建一个 token：

<ol>
<li>访问 token</li>
<li>刷新 token</li>
</ol>

要实现这一点，我们需要定义一个结构来包含这些 token 定义及其有效期限和 uuid：

<pre><code class="notranslate">type TokenDetails struct {
  AccessToken  string
  RefreshToken string
  AccessUuid   string
  RefreshUuid  string
  AtExpires    int64
  RtExpires    int64
}
</code></pre>

有效期限和 uuid 非常方便，因为在 redis 中保存 token 元数据时会用到它们。

现在，让我们将 {25} 函数更新为如下所示：

<pre><code class="notranslate">func CreateToken(userid uint64) (*TokenDetails, error) {
  td := &amp;TokenDetails{}
td.AtExpires = time.Now().Add(time.Minute* 15).Unix()
  td.AccessUuid = uuid.NewV4().String()

  td.RtExpires = time.Now().Add(time.Hour *24* 7).Unix()
  td.RefreshUuid = uuid.NewV4().String()

  var err error
  //Creating Access Token
  os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
  atClaims := jwt.MapClaims{}
  atClaims["authorized"] = true
  atClaims["access_uuid"] = td.AccessUuid
  atClaims["user_id"] = userid
  atClaims["exp"] = td.AtExpires
  at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
  td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
  if err != nil {
     return nil, err
  }
  //Creating Refresh Token
  os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
  rtClaims := jwt.MapClaims{}
  rtClaims["refresh_uuid"] = td.RefreshUuid
  rtClaims["user_id"] = userid
  rtClaims["exp"] = td.RtExpires
  rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
  td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
  if err != nil {
     return nil, err
  }
  return td, nil
}
</code></pre>

在以上函数中，<strong>访问 token</strong>在 15 分钟后到期，<strong>刷新 token</strong>在 7 天后到期。您还会注意到，我们为每个 token 添加了一个 uuid 作为声明。
由于 uuid 在每次创建时都是唯一的，因此用户可以创建多个 token。当用户在其他设备上登录时，就会发生这种情况。用户还可以从任何设备注销，而无需从所有设备注销。真棒！

<h3>保存 JWT 的元数据</h3>

现在我们来连接将用于保存 JWT 元数据的函数：

<pre><code class="notranslate">func CreateAuth(userid uint64, td *TokenDetails) error {
    at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
    rt := time.Unix(td.RtExpires, 0)
    now := time.Now()

    errAccess := client.Set(td.AccessUuid, strconv.Itoa(int(userid)), at.Sub(now)).Err()
    if errAccess != nil {
        return errAccess
    }
    errRefresh := client.Set(td.RefreshUuid, strconv.Itoa(int(userid)), rt.Sub(now)).Err()
    if errRefresh != nil {
        return errRefresh
    }
    return nil
}
</code></pre>

我们传入 <https://www.redily.app> ，其中包含有关 JWT 的到期时间和创建 JWT 时使用的 uuid 的信息。如果<strong>刷新token</strong>或<strong>访问token</strong>都达到了到期时间，则会从 redis 中自动删除 JWT。

我个人使用 <a href="https://www.redily.app">Redily</a> (redis GUI)。这是一款很好的工具。您可以在下面查看如何在键值对中存储 JWT 元数据。

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image2.png)

在再次测试登录之前，我们需要在 {7} 函数中调用 {7} 函数。更新登录函数：

<pre><code class="notranslate">func Login(c *gin.Context) {
  var u User
  if err := c.ShouldBindJSON(&amp;u); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
     return
  }
  //compare the user from the request, with the one we defined:
  if user.Username != u.Username || user.Password != u.Password {
     c.JSON(http.StatusUnauthorized, "Please provide valid login details")
     return
  }
  ts, err := CreateToken(user.ID)
 if err != nil {
 c.JSON(http.StatusUnprocessableEntity, err.Error())
   return
}
 saveErr := CreateAuth(user.ID, ts)
  if saveErr != nil {
     c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
  }
  tokens := map[string]string{
     "access_token":  ts.AccessToken,
     "refresh_token": ts.RefreshToken,
  }
  c.JSON(http.StatusOK, tokens)
}
</code></pre>

我们可以尝试再次登录。保存 文件并将其运行。当邮递员点击登录时，我们应该具有：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image3.png)

太棒了！我们既有 <strong>access_token</strong> 和 <strong>refresh_token</strong>，也有 token 元数据持久保存在 redis 中。

<h3>创建待办事项</h3>

现在，我们可以继续使用 JWT 进行身份验证的请求。

此 API 中未经验证的请求之一是创建<strong>待办事项</strong>请求。

首先，我们来定义一个 {30} 结构：

<pre><code class="notranslate">type Todo struct {
  UserID uint64 `json:"user_id"`
  Title string `json:"title"`
}
</code></pre>

执行任何经过身份验证的请求时，我们需要验证在身份验证标头中传递的 token，以查看其是否有效。我们需要定义一些辅助函数来协助这些操作。

首先，我们需要使用 {31} 函数从请求标头中提取 token：

<pre><code class="notranslate">func ExtractToken(r *http.Request) string {
  bearToken := r.Header.Get("Authorization")
  //normally Authorization the_token_xxx
  strArr := strings.Split(bearToken, " ")
  if len(strArr) == 2 {
     return strArr[1]
  }
  return ""
}
</code></pre>

然后，我们将验证 token：

<pre><code class="notranslate">func VerifyToken(r *http.Request) (*jwt.Token, error) {
  tokenString := ExtractToken(r)
  token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
     //Make sure that the token method conform to "SigningMethodHMAC"
     if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
     }
     return []byte(os.Getenv("ACCESS_SECRET")), nil
  })
  if err != nil {
     return nil, err
  }
  return token, nil
}
</code></pre>

我们在 {33} 函数内调用了 {32} 以获取 token 字符串，然后继续检查签名方法。

然后，我们将使用 {34} 函数检查此 token 的有效性，了解其仍然有用或是已过期：

<pre><code class="notranslate">func TokenValid(r *http.Request) error {
  token, err := VerifyToken(r)
  if err != nil {
     return err
  }
  if _, ok := token.Claims.(jwt.Claims); !ok &amp;&amp; !token.Valid {
     return err
  }
  return nil
}
</code></pre>

我们还将提取 token<strong>元数据</strong>，这些元数据将在我们之前设置的 <strong>redis</strong> 存储中进行查找。要提取 token，我们定义了 <code>ExtractTokenMetadata</code> 函数：

<pre><code class="notranslate">func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
  token, err := VerifyToken(r)
  if err != nil {
     return nil, err
  }
  claims, ok := token.Claims.(jwt.MapClaims)
  if ok &amp;&amp; token.Valid {
     accessUuid, ok := claims["access_uuid"].(string)
     if !ok {
        return nil, err
     }
     userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
     if err != nil {
        return nil, err
     }
     return &amp;AccessDetails{
        AccessUuid: accessUuid,
        UserId:   userId,
     }, nil
  }
  return nil, err
}
</code></pre>

{35} 函数返回一个 {36} （这是一个结构）。此结构包含了我们在 <strong>redis</strong> 中进行查找所需要的元数据（{37} 和 {38}）。如果出于任何原因我们无法从此 token 中获取元数据，则该请求将暂停并显示一条错误消息。

上面提到的 {39} 结构如下所示：

<pre><code class="notranslate">type AccessDetails struct {
    AccessUuid string
    UserId   uint64
}
</code></pre>

我们还提到了在 redis 中查找 token 元数据。我们来定义一个能够实现此操作的函数：

<pre><code class="notranslate">func FetchAuth(authD *AccessDetails) (uint64, error) {
  userid, err := client.Get(authD.AccessUuid).Result()
  if err != nil {
     return 0, err
  }
  userID, _ := strconv.ParseUint(userid, 10, 64)
  return userID, nil
}
</code></pre>

<code class="notranslate">FetchAuth()</code> 从 {42} 函数接受 {41}，然后在 redis 中查找。如果找不到记录，则可能意味着 token 已过期，因此引发错误。

最后，我们来连接 {43} 函数，以便更好地理解上述函数的实施：

<pre><code class="notranslate">func CreateTodo(c *gin.Context) {
var td*Todo
  if err := c.ShouldBindJSON(&amp;td); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "invalid json")
     return
  }
  tokenAuth, err := ExtractTokenMetadata(c.Request)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
 userId, err = FetchAuth(tokenAuth)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
td.UserID = userId

//you can proceed to save the Todo to a database
//but we will just return it to the caller here:
  c.JSON(http.StatusCreated, td)
}
</code></pre>

如上所示，我们调用 {44} 来提取 {45} 中使用的 JWT <strong>元数据</strong>，以检查该元数据是否仍然存在于我们的 redis 存储中。如果一切正常，则可以将待办事项保存到数据库中，但是我们选择将其返回给调用方。

我们来更新 {46} 以包含 {47} 函数：

<pre><code class="notranslate">func main() {
  router.POST("/login", Login)
  router.POST("/todo", CreateTodo)

  log.Fatal(router.Run(":8080"))
}
</code></pre>

要测试，请登录并复制，然后将其添加到<strong>Authorization Bearer Token</strong> 字段，如下所示：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image6.png)

然后在请求正文中添加标题以创建待办事项并向 端点发出 POST 请求，如下所示：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image4.png)

在没有 的情况下尝试创建待办事项是未经授权的行为：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image5.png)

<h3>注销请求</h3>

到目前为止，我们已经了解如何使用 JWT 来进行认证请求。当用户注销时，我们将立即撤消其 JWT 并使之失效。这是通过从 redis 存储中删除 JWT 元数据来实现的。

现在，我们将定义一个函数，使我们能够从 redis 中删除 JWT 元数据：

<pre><code class="notranslate">func DeleteAuth(givenUuid string) (int64,error) {
  deleted, err := client.Del(givenUuid).Result()
  if err != nil {
     return 0, err
  }
  return deleted, nil
}
</code></pre>

上面的函数将删除 redis 中与作为参数传递的 {52} 对应的记录。

{53} 函数如下所示：

<pre><code class="notranslate">func Logout(c *gin.Context) {
  au, err := ExtractTokenMetadata(c.Request)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
  deleted, delErr := DeleteAuth(au.AccessUuid)
  if delErr != nil || deleted == 0 { //if any goes wrong
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
  c.JSON(http.StatusOK, "Successfully logged out")
}
</code></pre>

在 {54} 函数中，我们首先提取 JWT 元数据。如果成功，我们将继续删除该元数据，从而立即使 JWT 无效。

在测试之前，更新 {55} 文件以包含 {56} 端点，如下所示：

<pre><code class="notranslate">func main() {
  router.POST("/login", Login)
  router.POST("/todo", CreateTodo)
  router.POST("/logout", Logout)

  log.Fatal(router.Run(":8080"))
}
</code></pre>

提供与用户关联的有效，然后注销该用户。记得将 添加到，然后单击注销端点：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image1.png)

现在用户已注销，由于该 JWT 立即失效，因此无法再次对该 JWT 执行进一步的请求。这种实施方式比在用户注销后等待 JWT 到期更为安全。

<h3>保护经过验证的路由</h3>

我们有两个需要身份验证的路由：{60} 和 {61}。现在，无论是否通过身份验证，任何人都可以访问这些路由。我们来改变这种状况。

我们将需要定义 {62} 函数来保护这些路由：

<pre><code class="notranslate">func TokenAuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
     err := TokenValid(c.Request)
     if err != nil {
        c.JSON(http.StatusUnauthorized, err.Error())
        c.Abort()
        return
     }
     c.Next()
  }
}
</code></pre>

如上所示，我们调用了 {63} 函数（前面已定义）来检查 token 是否仍然有效或已过期。该函数将用于经过身份验证的路由以保护它们。
现在我们来更新 {64} 以包含此中间件：

<pre><code class="notranslate">func main() {
  router.POST("/login", Login)
  router.POST("/todo", TokenAuthMiddleware(), CreateTodo)
  router.POST("/logout", TokenAuthMiddleware(), Logout)

  log.Fatal(router.Run(":8080"))
}
</code></pre>

<h3>刷新 token</h3>

到目前为止，我们可以创建、使用和撤消 JWT。在会涉及用户界面的应用程序中，如果<strong>访问 token</strong>到期且用户需要发出经过身份验证的请求，会发生什么情况？用户是否会被设为未经授权并且需要再次登录？很遗憾，情况就是这样。但这可以使用<strong>刷新 token</strong>的概念来避免。用户不需要重新登录。
与<strong>访问 token</strong>一起创建的<strong>刷新 token</strong>将用于创建新的<strong>访问 token 和刷新 token</strong>对。

利用 JavaScript 使用 API 端点，我们可以使用 <a href="https://github.com/axios/axios">axios 拦截器</a>轻松地刷新 JWT。在我们的 API 中，我们需要将带有 <code>refresh_token</code> 作为主体的 POST 请求发送到 <code>/token/refresh</code> 端点。

首先我们来创建 {1} 函数：

<pre><code class="notranslate">func Refresh(c *gin.Context) {
  mapToken := map[string]string{}
  if err := c.ShouldBindJSON(&amp;mapToken); err != nil {
     c.JSON(http.StatusUnprocessableEntity, err.Error())
     return
  }
  refreshToken := mapToken["refresh_token"]

  //verify the token
  os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
  token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
     //Make sure that the token method conform to "SigningMethodHMAC"
if_, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
     }
     return []byte(os.Getenv("REFRESH_SECRET")), nil
  })
  //if there is an error, the token must have expired
  if err != nil {
     c.JSON(http.StatusUnauthorized, "Refresh token expired")
     return
  }
  //is token valid?
  if _, ok := token.Claims.(jwt.Claims); !ok &amp;&amp; !token.Valid {
     c.JSON(http.StatusUnauthorized, err)
     return
  }
  //Since token is valid, get the uuid:
  claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
  if ok &amp;&amp; token.Valid {
     refreshUuid, ok := claims["refresh_uuid"].(string) //convert the interface to string
     if !ok {
        c.JSON(http.StatusUnprocessableEntity, err)
        return
     }
     userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
     if err != nil {
        c.JSON(http.StatusUnprocessableEntity, "Error occurred")
        return
     }
     //Delete the previous Refresh Token
     deleted, delErr := DeleteAuth(refreshUuid)
     if delErr != nil || deleted == 0 { //if any goes wrong
        c.JSON(http.StatusUnauthorized, "unauthorized")
        return
     }
    //Create new pairs of refresh and access tokens
     ts, createErr := CreateToken(userId)
     if  createErr != nil {
        c.JSON(http.StatusForbidden, createErr.Error())
        return
     }
    //save the tokens metadata to redis
saveErr := CreateAuth(userId, ts)
 if saveErr != nil {
        c.JSON(http.StatusForbidden, saveErr.Error())
       return
}
 tokens := map[string]string{
       "access_token":  ts.AccessToken,
  "refresh_token": ts.RefreshToken,
}
     c.JSON(http.StatusCreated, tokens)
  } else {
     c.JSON(http.StatusUnauthorized, "refresh expired")
  }
}
</code></pre>

虽然该函数中有大量工作，但我们来尝试了解一下流程。

- 我们首先从请求正文中获取了 {66}。
- 然后，我们验证了 token 的签名方法。
- 接下来，检查 token 是否仍然有效。
- 然后提取 {67} 和 {68}，它们是创建刷新 token 时用作声明的元数据。
- 然后，我们在 redis 存储中搜索元数据，并使用 {69} 作为键将其删除。
- 然后，我们创建一对新的访问和刷新 token，这些 token 现在将用于将来的请求。
- 访问 token 和刷新 token 的元数据保存在 redis 中。
- 创建的 token 返回给调用者。
在 else 语句中，如果<strong>刷新 token</strong>无效，则不允许用户创建新的 token 对。我们将需要重新登录以获得新token。

接下来，在 {70} 函数中添加刷新 token 路由：

<pre><code class="notranslate">  router.POST("/token/refresh", Refresh)

</code></pre>

使用有效的 测试端点：

![](/content/blog/using-jwt-for-authentication-in-a-golang-application-dr/image7.png)

我们已成功创建了新的 token 对。太好了😎。

<h3>使用 Vonage Messages API 发送消息</h3>

让我们在用户每次使用 Vonage Messages API 创建待办事项时通知他们。

您可以在环境变量中定义 API 密钥和密码，然后在此文件中使用它们，如下所示：

<pre><code class="notranslate">var (
  NEXMO_API_KEY   = os.Getenv( "your_api_key")
  NEXMO_API_SECRET  = os.Getenv("your_secret")
)
</code></pre>

然后，我们将定义一些具有发送者、接收者和消息内容信息的结构。

<pre><code class="notranslate">type Payload struct {
  From    From    `json:"from"`
  To      To      `json:"to"`
  Message Message `json:"message"`
}
type From struct {
  Type   string `json:"type"`
  Number string `json:"number"`
}
type To struct {
  Type   string `json:"type"`
  Number string `json:"number"`
}
type Content struct {
  Type string `json:"type"`
  Text string `json:"text"`
}
type Message struct {
  Content Content `json:"content"`
}
</code></pre>

然后，我们在下面定义向用户发送消息的功能：

<pre><code class="notranslate">func SendMessage(username, phone string) (*http.Response, error) {
  data := Payload{
     From: From{
        Type:   "sms",
        Number: "Nexmo",
     },
     To: To{
        Type:   "sms",
        Number: phone,
     },
     Message: Message{
        Content: Content{
           Type: "text",
           Text: "Dear " + username + ", a todo was created from your account just now.",
        },
     },
  }
  payloadBytes, err := json.Marshal(data)
  if err != nil {
     return nil, err
  }
  body := bytes.NewReader(payloadBytes)

  req, err := http.NewRequest("POST", "https://api.nexmo.com/v0.1/messages", body)
  if err != nil {
     return nil, err
  }
  //Ensure headers
  req.SetBasicAuth(NEXMO_API_KEY, NEXMO_API_SECRET)
  req.Header.Set("Content-Type", "application/json")
  req.Header.Set("Accept", "application/json")

  resp, err := http.DefaultClient.Do(req)
  if err != nil {
     return nil, err
  }
  defer resp.Body.Close()

  return resp, nil
}
</code></pre>

在以上函数中，<https://dashboard.nexmo.com> 号码为用户号码，而 <https://dashboard.nexmo.com> 号码必须通过您的 <a href="https://dashboard.nexmo.com">Vonage API Dashboard</a> 进行购买。

确保在环境变量文件中定义了 {1} 和 {1}。

然后，我们更新 {1} 函数以包含刚刚定义的 {1} 函数，并传入所需的参数：

<pre><code class="notranslate">func CreateTodo(c *gin.Context) {
var td*Todo
  if err := c.ShouldBindJSON(&amp;td); err != nil {
     c.JSON(http.StatusUnprocessableEntity, "invalid json")
     return
  }
  tokenAuth, err := ExtractTokenMetadata(c.Request)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
 userId, err = FetchAuth(tokenAuth)
  if err != nil {
     c.JSON(http.StatusUnauthorized, "unauthorized")
     return
  }
td.UserID = userId
//you can proceed to save the Todo to a database
//but we will just return it to the caller here:

//Send the user a notification
  msgResp, err := SendMessage(user.Username, user.Phone)
  if err != nil {
     c.JSON(http.StatusForbidden, "error occurred sending message to user")
     return
  }
  if msgResp.StatusCode &gt; 299 {
     c.JSON(http.StatusForbidden, "cannot send message to user")
     return
  }

  c.JSON(http.StatusCreated, td)
}
</code></pre>

确保提供了有效的电话号码，以便在尝试创建待办事项时能够收到消息。

<h2>结语</h2>

您已经了解了如何创建 JWT 并使 JWT 失效。您还了解了如何在 Golang 应用程序中集成 Vonage Messages API 来发送通知。有关最佳实践和使用 JWT 的更多信息，请务必查看此 <a href="https://github.com/victorsteven/jwt-best-practices">GitHub 存储库</a> 。您可以扩展此应用程序，并使用真实的数据库来保留用户和待办事项，还可以使用 React 或 VueJS 来构建前端。在那里，您将真正受益于 Axios 拦截器的刷新 token 功能。

<em>Originally published at <a href="<<<https://www.nexmo.com/blog/2020/03/13/using-jwt-for-authentication-in-a-golang-application-dr>>>">https://www.nexmo.com/blog/2020/03/13/using-jwt-for-authentication-in-a-golang-application-dr</a></em>
