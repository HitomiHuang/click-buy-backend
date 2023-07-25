# Click Buy Online Shop API

前後端分離開發的網路商店專案中使用的後端Restful API，使用Node.js, Express, MySQL開發


### 種子帳戶資料
```
  Buyer
  Account: buyer001
  Password: titaner

  Seller
  Account: seller001
  Password: titaner
```

# How to Install API

### 需先安裝

* Git
* Node.js
* MySQL
* MySQL Workbench

### Clone專案到本地端
```
  $git clone https://github.com/HitomiHuang/click-buy-backend.git
```

### 安裝套件
```
  npm install
```

### 設定環境變數
請新增一個.env檔案，填入以下資訊，以確保API能順利運行。
```
  JWT_SECRET=<your_jwt_secret>
  AWS_ID=<your_aws_id>
  AWS_SECRET=<your_aws_secret>
```

### 設定資料庫
1. 請在config資料夾的config.json填入資料庫資訊
```
  {
    "development": {
      "username": "root",
      "password": "<your_mysql_workbench_password>",
      "database": "click_buy",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }
```

2. 在MySQL Workbench中創建開發與測試用資料庫
```
  drop database if exists click_buy;
  create database click_buy;
```

3. 將專案裡的資料表設定傳送到MySQL Workbench
```
  npx sequelize db:migrate
```

### 設定種子資料
```
  npx sequelize db:seed:all
```
### 運行API
```
  npm run dev
```
出現此行文字 App listening on port 3000! 
代表運行成功

## 開發工具

* aws-sdk 2.1421.0
* cors 2.8.5
* dotenv 16.3.1
* express 4.18.2
* express-session 1.17.3
* jsonwebtoken 9.0.1
* method-override 3.0.0
* multer 1.4.5
* mysql2 3.5.1
* passport 0.6.0
* passport-jwt 4.0.1
* passport-local 1.0.0
* sequelize 6.32.1
* sequelize-cli 6.6.1
* eslint 8.44.0
