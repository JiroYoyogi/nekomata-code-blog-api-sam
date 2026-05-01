## Notion SDK for JavaScriptをインストール

`src/`にて`npm install`

## ビルド & デプロイ

### コードをビルド

`cd ..`でプロジェクト直下に戻り下記を実行

```
sam build
```

### コードをデプロイ

```
sam deploy --guided
```

下記のように設定

- Stack Name：`nekomata-code-blog-api`
- AWS Region：`ap-northeast-1`
- Stage：`dev` （stgやprdなどでもOK）
- NotionDatabaseId：`該当のNotionデータベースID`
- NotionApiKey：`作成したアクセストークン`
- AWSApiKey：`nekomata-code`

次の質問では必ず `y` を入力

```
GetArticlesFunction has no authentication. Is this okay? [y/N]: y
GetArticleFunction has no authentication. Is this okay? [y/N]: y
```

## 補足

NotionAPIKey、AwsApiKeyを環境変数で受け取ったが実務ではSSM Parameter StoreやSecrets Managerを利用すると良い
