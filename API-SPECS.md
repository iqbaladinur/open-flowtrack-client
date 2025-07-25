---
title: Wallport API v1.0
language_tabs:
  - shell: Shell
  - javascript: JavaScript
language_clients:
  - shell: ""
  - javascript: ""
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="wallport-api">Wallport API v1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API for Personal Finance Tracker Application

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="wallport-api-authentication">Authentication</h1>

## Redirect to Google for authentication

<a id="opIdAuthController_googleAuth"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /auth/google

```

```javascript

fetch('/auth/google',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /auth/google`

<h3 id="redirect-to-google-for-authentication-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## Google callback for authentication

<a id="opIdAuthController_googleAuthRedirect"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /auth/google/callback

```

```javascript

fetch('/auth/google/callback',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /auth/google/callback`

<h3 id="google-callback-for-authentication-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## Register a new user

<a id="opIdAuthController_register"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/register \
  -H 'Content-Type: application/json'

```

```javascript
const inputBody = '{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "John Doe"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /auth/register`

> Body parameter

```json
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

<h3 id="register-a-new-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateUserDto](#schemacreateuserdto)|true|none|

<h3 id="register-a-new-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User successfully registered.|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Email already registered.|None|

<aside class="success">
This operation does not require authentication
</aside>

## Log in a user

<a id="opIdAuthController_login"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/login \
  -H 'Content-Type: application/json'

```

```javascript
const inputBody = '{
  "email": "test@example.com",
  "password": "password123"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /auth/login`

> Body parameter

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

<h3 id="log-in-a-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LoginDto](#schemalogindto)|true|none|

<h3 id="log-in-a-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User successfully logged in.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid credentials.|None|

<aside class="success">
This operation does not require authentication
</aside>

## Send password reset link

<a id="opIdAuthController_forgotPassword"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/forgot-password \
  -H 'Content-Type: application/json'

```

```javascript
const inputBody = '{
  "email": "test@example.com"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/forgot-password',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /auth/forgot-password`

> Body parameter

```json
{
  "email": "test@example.com"
}
```

<h3 id="send-password-reset-link-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ForgotPasswordDto](#schemaforgotpassworddto)|true|none|

<h3 id="send-password-reset-link-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password reset link sent.|None|

<aside class="success">
This operation does not require authentication
</aside>

## Reset user password

<a id="opIdAuthController_resetPassword"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth/reset-password/{token} \
  -H 'Content-Type: application/json'

```

```javascript
const inputBody = '{
  "password": "newPassword123"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/reset-password/{token}',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /auth/reset-password/{token}`

> Body parameter

```json
{
  "password": "newPassword123"
}
```

<h3 id="reset-user-password-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|token|path|string|true|none|
|body|body|[ResetPasswordDto](#schemaresetpassworddto)|true|none|

<h3 id="reset-user-password-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password successfully reset.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid or expired token.|None|

<aside class="success">
This operation does not require authentication
</aside>

## Get user profile

<a id="opIdAuthController_getProfile"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /auth/profile \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/profile',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /auth/profile`

<h3 id="get-user-profile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User profile retrieved successfully.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="wallport-api-wallets">Wallets</h1>

## Create a new wallet

<a id="opIdWalletsController_create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /wallets \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "name": "My Bank Account",
  "currency": "USD",
  "initial_balance": 1000
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/wallets',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /wallets`

> Body parameter

```json
{
  "name": "My Bank Account",
  "currency": "USD",
  "initial_balance": 1000
}
```

<h3 id="create-a-new-wallet-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateWalletDto](#schemacreatewalletdto)|true|none|

<h3 id="create-a-new-wallet-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|The wallet has been successfully created.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get all wallets for the current user

<a id="opIdWalletsController_findAll"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /wallets \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/wallets',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /wallets`

<h3 id="get-all-wallets-for-the-current-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get a specific wallet by ID

<a id="opIdWalletsController_findOne"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /wallets/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/wallets/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /wallets/{id}`

<h3 id="get-a-specific-wallet-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="get-a-specific-wallet-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Update a wallet

<a id="opIdWalletsController_update"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /wallets/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "name": "My Primary Bank Account",
  "currency": "IDR",
  "initial_balance": 1500
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/wallets/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /wallets/{id}`

> Body parameter

```json
{
  "name": "My Primary Bank Account",
  "currency": "IDR",
  "initial_balance": 1500
}
```

<h3 id="update-a-wallet-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateWalletDto](#schemaupdatewalletdto)|true|none|

<h3 id="update-a-wallet-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Delete a wallet

<a id="opIdWalletsController_remove"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /wallets/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/wallets/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /wallets/{id}`

<h3 id="delete-a-wallet-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="delete-a-wallet-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|The wallet has been successfully deleted.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="wallport-api-categories">Categories</h1>

## Create a new category

<a id="opIdCategoriesController_create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /categories \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "name": "Salary",
  "type": "income",
  "icon": "briefcase-outline",
  "color": "#26de81"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/categories',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /categories`

> Body parameter

```json
{
  "name": "Salary",
  "type": "income",
  "icon": "briefcase-outline",
  "color": "#26de81"
}
```

<h3 id="create-a-new-category-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateCategoryDto](#schemacreatecategorydto)|true|none|

<h3 id="create-a-new-category-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|The category has been successfully created.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get all categories for the current user (including defaults)

<a id="opIdCategoriesController_findAll"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /categories \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/categories',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /categories`

<h3 id="get-all-categories-for-the-current-user-(including-defaults)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|type|query|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|type|income|
|type|expense|

<h3 id="get-all-categories-for-the-current-user-(including-defaults)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get a specific category by ID

<a id="opIdCategoriesController_findOne"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /categories/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/categories/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /categories/{id}`

<h3 id="get-a-specific-category-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="get-a-specific-category-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Update a category

<a id="opIdCategoriesController_update"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /categories/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "name": "Freelance Income",
  "type": "income",
  "icon": "laptop-outline",
  "color": "#45aaf2"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/categories/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /categories/{id}`

> Body parameter

```json
{
  "name": "Freelance Income",
  "type": "income",
  "icon": "laptop-outline",
  "color": "#45aaf2"
}
```

<h3 id="update-a-category-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateCategoryDto](#schemaupdatecategorydto)|true|none|

<h3 id="update-a-category-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Delete a category

<a id="opIdCategoriesController_remove"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /categories/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/categories/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /categories/{id}`

<h3 id="delete-a-category-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="delete-a-category-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|The category has been successfully deleted.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="wallport-api-transactions">Transactions</h1>

## Create a new transaction

<a id="opIdTransactionsController_create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /transactions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "type": "expense",
  "amount": 50,
  "wallet_id": "string",
  "category_id": "string",
  "date": "2019-08-24T14:15:22Z",
  "note": "string",
  "is_recurring": false,
  "recurring_pattern": "daily"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/transactions',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /transactions`

> Body parameter

```json
{
  "type": "expense",
  "amount": 50,
  "wallet_id": "string",
  "category_id": "string",
  "date": "2019-08-24T14:15:22Z",
  "note": "string",
  "is_recurring": false,
  "recurring_pattern": "daily"
}
```

<h3 id="create-a-new-transaction-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateTransactionDto](#schemacreatetransactiondto)|true|none|

<h3 id="create-a-new-transaction-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|The transaction has been successfully created.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get all transactions for the current user

<a id="opIdTransactionsController_findAll"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /transactions \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/transactions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /transactions`

<h3 id="get-all-transactions-for-the-current-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|start_date|query|string(date-time)|false|none|
|end_date|query|string(date-time)|false|none|
|wallet_id|query|string|false|none|
|category_id|query|string|false|none|
|type|query|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|type|income|
|type|expense|

<h3 id="get-all-transactions-for-the-current-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get a specific transaction by ID

<a id="opIdTransactionsController_findOne"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /transactions/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/transactions/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /transactions/{id}`

<h3 id="get-a-specific-transaction-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="get-a-specific-transaction-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Update a transaction

<a id="opIdTransactionsController_update"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /transactions/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "type": "income",
  "amount": 0,
  "wallet_id": "string",
  "category_id": "string",
  "date": "2019-08-24T14:15:22Z",
  "note": "string",
  "is_recurring": true,
  "recurring_pattern": "daily"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/transactions/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /transactions/{id}`

> Body parameter

```json
{
  "type": "income",
  "amount": 0,
  "wallet_id": "string",
  "category_id": "string",
  "date": "2019-08-24T14:15:22Z",
  "note": "string",
  "is_recurring": true,
  "recurring_pattern": "daily"
}
```

<h3 id="update-a-transaction-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateTransactionDto](#schemaupdatetransactiondto)|true|none|

<h3 id="update-a-transaction-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Delete a transaction

<a id="opIdTransactionsController_remove"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /transactions/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/transactions/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /transactions/{id}`

<h3 id="delete-a-transaction-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="delete-a-transaction-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|The transaction has been successfully deleted.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="wallport-api-budgets">Budgets</h1>

## Create a new budget

<a id="opIdBudgetsController_create"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /budgets \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "category_id": "string",
  "limit_amount": 500,
  "month": 7,
  "year": 2025
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/budgets',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /budgets`

> Body parameter

```json
{
  "category_id": "string",
  "limit_amount": 500,
  "month": 7,
  "year": 2025
}
```

<h3 id="create-a-new-budget-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateBudgetDto](#schemacreatebudgetdto)|true|none|

<h3 id="create-a-new-budget-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|The budget has been successfully created.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get all budgets for the current user

<a id="opIdBudgetsController_findAll"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /budgets \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/budgets',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /budgets`

<h3 id="get-all-budgets-for-the-current-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Get a specific budget by ID

<a id="opIdBudgetsController_findOne"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /budgets/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/budgets/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /budgets/{id}`

<h3 id="get-a-specific-budget-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="get-a-specific-budget-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Update a budget

<a id="opIdBudgetsController_update"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /budgets/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "limit_amount": 600
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/budgets/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /budgets/{id}`

> Body parameter

```json
{
  "limit_amount": 600
}
```

<h3 id="update-a-budget-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateBudgetDto](#schemaupdatebudgetdto)|true|none|

<h3 id="update-a-budget-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Delete a budget

<a id="opIdBudgetsController_remove"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /budgets/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/budgets/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /budgets/{id}`

<h3 id="delete-a-budget-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="delete-a-budget-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|The budget has been successfully deleted.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="wallport-api-reports">Reports</h1>

## ReportsController_getSummary

<a id="opIdReportsController_getSummary"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /reports/summary \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/reports/summary',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /reports/summary`

<h3 id="reportscontroller_getsummary-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|startDate|query|string|false|YYYY-MM-DD|
|endDate|query|string|false|YYYY-MM-DD|

<h3 id="reportscontroller_getsummary-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## ReportsController_getCategoryReport

<a id="opIdReportsController_getCategoryReport"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /reports/by-category \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/reports/by-category',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /reports/by-category`

<h3 id="reportscontroller_getcategoryreport-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|startDate|query|string|false|YYYY-MM-DD|
|endDate|query|string|false|YYYY-MM-DD|

<h3 id="reportscontroller_getcategoryreport-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## ReportsController_getWalletReport

<a id="opIdReportsController_getWalletReport"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /reports/by-wallet \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/reports/by-wallet',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /reports/by-wallet`

<h3 id="reportscontroller_getwalletreport-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|startDate|query|string|false|YYYY-MM-DD|
|endDate|query|string|false|YYYY-MM-DD|

<h3 id="reportscontroller_getwalletreport-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="wallport-api-export">Export</h1>

## Export user transactions to CSV

<a id="opIdExportController_exportTransactions"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /export/transactions/csv \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/export/transactions/csv',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /export/transactions/csv`

<h3 id="export-user-transactions-to-csv-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="wallport-api-backup-and-restore">Backup & Restore</h1>

## Backup user data

<a id="opIdBackupController_backup"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /backup \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/backup',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /backup`

<h3 id="backup-user-data-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Restore user data

<a id="opIdBackupController_restore"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /backup/restore \
  -H 'Content-Type: multipart/form-data' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "file": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Authorization':'Bearer {access-token}'
};

fetch('/backup/restore',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /backup/restore`

> Body parameter

```yaml
file: string

```

<h3 id="restore-user-data-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» file|body|string(binary)|false|none|

<h3 id="restore-user-data-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

# Schemas

<h2 id="tocS_CreateUserDto">CreateUserDto</h2>
<!-- backwards compatibility -->
<a id="schemacreateuserdto"></a>
<a id="schema_CreateUserDto"></a>
<a id="tocScreateuserdto"></a>
<a id="tocscreateuserdto"></a>

```json
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "John Doe"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|password|string|true|none|none|
|full_name|string|false|none|none|

<h2 id="tocS_LoginDto">LoginDto</h2>
<!-- backwards compatibility -->
<a id="schemalogindto"></a>
<a id="schema_LoginDto"></a>
<a id="tocSlogindto"></a>
<a id="tocslogindto"></a>

```json
{
  "email": "test@example.com",
  "password": "password123"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|password|string|true|none|none|

<h2 id="tocS_ForgotPasswordDto">ForgotPasswordDto</h2>
<!-- backwards compatibility -->
<a id="schemaforgotpassworddto"></a>
<a id="schema_ForgotPasswordDto"></a>
<a id="tocSforgotpassworddto"></a>
<a id="tocsforgotpassworddto"></a>

```json
{
  "email": "test@example.com"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|

<h2 id="tocS_ResetPasswordDto">ResetPasswordDto</h2>
<!-- backwards compatibility -->
<a id="schemaresetpassworddto"></a>
<a id="schema_ResetPasswordDto"></a>
<a id="tocSresetpassworddto"></a>
<a id="tocsresetpassworddto"></a>

```json
{
  "password": "newPassword123"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|password|string|true|none|none|

<h2 id="tocS_CreateWalletDto">CreateWalletDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatewalletdto"></a>
<a id="schema_CreateWalletDto"></a>
<a id="tocScreatewalletdto"></a>
<a id="tocscreatewalletdto"></a>

```json
{
  "name": "My Bank Account",
  "currency": "USD",
  "initial_balance": 1000
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|currency|string|true|none|none|
|initial_balance|number|true|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|currency|IDR|
|currency|USD|

<h2 id="tocS_UpdateWalletDto">UpdateWalletDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdatewalletdto"></a>
<a id="schema_UpdateWalletDto"></a>
<a id="tocSupdatewalletdto"></a>
<a id="tocsupdatewalletdto"></a>

```json
{
  "name": "My Primary Bank Account",
  "currency": "IDR",
  "initial_balance": 1500
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|currency|string|false|none|none|
|initial_balance|number|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|currency|IDR|
|currency|USD|

<h2 id="tocS_CreateCategoryDto">CreateCategoryDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatecategorydto"></a>
<a id="schema_CreateCategoryDto"></a>
<a id="tocScreatecategorydto"></a>
<a id="tocscreatecategorydto"></a>

```json
{
  "name": "Salary",
  "type": "income",
  "icon": "briefcase-outline",
  "color": "#26de81"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|type|string|true|none|none|
|icon|string|true|none|none|
|color|string|true|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|income|
|type|expense|

<h2 id="tocS_UpdateCategoryDto">UpdateCategoryDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdatecategorydto"></a>
<a id="schema_UpdateCategoryDto"></a>
<a id="tocSupdatecategorydto"></a>
<a id="tocsupdatecategorydto"></a>

```json
{
  "name": "Freelance Income",
  "type": "income",
  "icon": "laptop-outline",
  "color": "#45aaf2"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|type|string|false|none|none|
|icon|string|false|none|none|
|color|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|income|
|type|expense|

<h2 id="tocS_CreateTransactionDto">CreateTransactionDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatetransactiondto"></a>
<a id="schema_CreateTransactionDto"></a>
<a id="tocScreatetransactiondto"></a>
<a id="tocscreatetransactiondto"></a>

```json
{
  "type": "expense",
  "amount": 50,
  "wallet_id": "string",
  "category_id": "string",
  "date": "2019-08-24T14:15:22Z",
  "note": "string",
  "is_recurring": false,
  "recurring_pattern": "daily"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|amount|number|true|none|none|
|wallet_id|string|true|none|none|
|category_id|string|true|none|none|
|date|string(date-time)|true|none|none|
|note|string|false|none|none|
|is_recurring|boolean|false|none|none|
|recurring_pattern|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|income|
|type|expense|
|recurring_pattern|daily|
|recurring_pattern|weekly|
|recurring_pattern|monthly|
|recurring_pattern|yearly|

<h2 id="tocS_UpdateTransactionDto">UpdateTransactionDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdatetransactiondto"></a>
<a id="schema_UpdateTransactionDto"></a>
<a id="tocSupdatetransactiondto"></a>
<a id="tocsupdatetransactiondto"></a>

```json
{
  "type": "income",
  "amount": 0,
  "wallet_id": "string",
  "category_id": "string",
  "date": "2019-08-24T14:15:22Z",
  "note": "string",
  "is_recurring": true,
  "recurring_pattern": "daily"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|false|none|none|
|amount|number|false|none|none|
|wallet_id|string|false|none|none|
|category_id|string|false|none|none|
|date|string(date-time)|false|none|none|
|note|string|false|none|none|
|is_recurring|boolean|false|none|none|
|recurring_pattern|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|income|
|type|expense|
|recurring_pattern|daily|
|recurring_pattern|weekly|
|recurring_pattern|monthly|
|recurring_pattern|yearly|

<h2 id="tocS_CreateBudgetDto">CreateBudgetDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatebudgetdto"></a>
<a id="schema_CreateBudgetDto"></a>
<a id="tocScreatebudgetdto"></a>
<a id="tocscreatebudgetdto"></a>

```json
{
  "category_id": "string",
  "limit_amount": 500,
  "month": 7,
  "year": 2025
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|category_id|string|true|none|none|
|limit_amount|number|true|none|none|
|month|number|true|none|none|
|year|number|true|none|none|

<h2 id="tocS_UpdateBudgetDto">UpdateBudgetDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdatebudgetdto"></a>
<a id="schema_UpdateBudgetDto"></a>
<a id="tocSupdatebudgetdto"></a>
<a id="tocsupdatebudgetdto"></a>

```json
{
  "limit_amount": 600
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|limit_amount|number|false|none|none|

