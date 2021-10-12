//const LINE_NOTIFY_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaa" //LINE Notifyのtoken
//const  FOLDER_ID = 'bbbbbbbbbbbbbbbbbbbbbbb'; //Googleドライブの親フォルダID
//const searchQuery =  'is:unread  from:aaaaaaaaa@gmail.com '; //検索ワード
 
 let myMessages; //抽出したメールのデータ
//メールをチェックし条件に該当するメールをLINEに通知する
function gmailFowardtoLINE(){

  //指定した条件でスレッドを検索して取得 
  let myThreads = GmailApp.search(searchQuery, 0, 10);
  
  //スレッドからメールを取得し二次元配列に格納
  let myMessages = GmailApp.getMessagesForThreads(myThreads);

  for(let i in myMessages){
    for(let j in myMessages[i]){     
        let strDate　=　myMessages[i][j].getDate();
        let mesasgeDate = Utilities.formatDate(myMessages[i][j].getDate(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
        let  sendMsg = mesasgeDate+"\n"; //タイムスタンプ
        sendMsg += "件名:" + myMessages[i][j].getSubject() + "\n";//Subject 
        sendMsg += myMessages[i][j].getPlainBody().slice(0,300);//本文の先頭から300文字


        //添付ファイルがある場合には送信する文字列に追加する
        let gdriveFiles = saveAttachments(myMessages[i][j].getAttachments(),mesasgeDate);
        if(gdriveFiles){
          for(const gdriveFile of gdriveFiles){
            sendMsg  += String(gdriveFile['fileName']) +" \n";
            sendMsg  += String(gdriveFile['fileUlr']) + "\n";
            // sendLineMessage(String(gdriveFile['fileName']));
            // sendLineMessage(String(gdriveFile['fileUlr']));
          }
        }
        if(sendLineMessage(sendMsg)){ //メッセージを送信して
            myMessages[i][j].markRead();//正常にLINEに遅れたら既読にする
        }
    }
  }
}
 
 function saveAttachments(attachments,date){
  if(!attachments.length) return false;
  const folder = DriveApp.getFolderById(FOLDER_ID);//親フォルダ
  let subFolder =''
  let originalFiles = []
  subFolder= folder.createFolder(date);//メッセージを受信した日付でフォルダを作成
  //添付ファイルを保存する
  for(const attachment of attachments){
    //console.log(attachment.getName());//添付ファイル名
    subFolder.createFile(attachment);//添付ファイル名を保存
  }
  //サブフォルダのファイルを取得する
  files = subFolder.getFiles();
    while(files.hasNext()) {
      var buff = files.next();
      originalFiles.push({fileName:buff.getName(),fileUlr:buff.getUrl()});
    };
  Logger.log(originalFiles);
  return originalFiles;
 }

//LINEにテスト送信をする
 function testSendLine(){
   sendLineMessage("test OK?")
 }
//LINEにメッセージを送信する
function sendLineMessage(msg) {
  const url = "https://notify-api.line.me/api/notify";
  const data = {
    "method": "post",
     muteHttpExceptions:  true,
    "headers": {
      "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
    },
    "payload": {
      "message": msg
    }
  };
  let result = null
  try{
    const res = UrlFetchApp.fetch(url, data);
    const resCode = res.getResponseCode();
    const resContent = res.getContentText();
    //result = JSON.parse(res);
    //Logger.log(result)
    if (resCode !== 200) {
      console.warn(Utilities.formatString("Request failed. Expected 200, got %d: %s", resCode, resContent));
      return false;
    }
  } catch(ex){
    let errMesg = `Message: ${ ex.message }\n`;
    if (ex.stack) errMesg += `---\n${ ex.stack }\n---\n`;
    console.error(errMesg);
    throw ex;
  }
  return true;
}