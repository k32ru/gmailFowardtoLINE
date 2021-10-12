# gmailFowardtoLINE
Gmailから未読のメールを検索してLINEに転送する。メールに添付ファイルがあればGogoleドライブに保存し、共有URLをLINEに送る
# what's is this?
GmailをLINEに転送するBOT。GASで動きます。添付ファイルが着いているメールは一度、Googleドライブに保存して、その共有URLをLINEに送ります(LINEの使用でPDFとかdocファイルが送れない仕様のため)。
# How to install?
新しいスプシを作って、コードにコミペしてください。
# How to config?
- LINE_NOTIFY_TOKEN は[【使ってみた】LINE Notifyを使ってトークルームにメッセージ送信 \| ホームページ制作 大阪 SmileVision](https://www.smilevision.co.jp/blog/tsukatte01/)　を参考にして、tokenをゲットしたら、LINE_NOTIFY_TOKEN に書いてください。
- FOLDER_IDはGoogleドライブのフォルダIDです。他の人がアクセスする場合には共有可能な状態にしてください。このフォルダののサブフォルダにメールを受信した日時と時間でサブフォルダを作ります。
- searchQuery はGmailを検索するワードです。今回は未読のメールを検索するようにしているので、処理が正常に終了したら、既読にする用にしています。未読のメールを検索するなら「const searchQuery =  'is:unread';」特定のアドレスからのメールであれば、「const searchQuery =  'is:unread  from:aaaaaaaaa@gmail.com '; 」にしてください。

# How to use?
gmailFowardtoLINE()をお好きな間隔(5分とか10分とか)でGASで実行してください。
