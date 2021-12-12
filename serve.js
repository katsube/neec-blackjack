const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const trump = require('./libs/trump')

//---------------------------
// トランプの山札
//---------------------------
const CARD_STOCK = [ ]
trump.initCard(CARD_STOCK)     // トランプ初期化
trump.shuffleCard(CARD_STOCK)  // トランプをシャッフル

//---------------------------
// プレイヤー情報
//---------------------------
// 手札を管理(連想配列的なもの)
let USER_CARD = { }

// 決定ボタンが押されたか管理
let USER_STATUS = [ ]

// USER_STATUSを監視
setInterval(()=>{
  // 2人が決定ボタンを押したら勝敗判定
  if( USER_STATUS.length === 2 ){
    // スコアを計算
    const key1   = USER_STATUS[0].token;
    const score1 = trump.calcScore(USER_CARD[key1])
    const key2   = USER_STATUS[1].token;
    const score2 = trump.calcScore(USER_CARD[key2])

    if( score1 > score2 ){
      io.to(USER_STATUS[0].id).emit('result', 1)
      io.to(USER_STATUS[1].id).emit('result', 0)
    }
    else{
      io.to(USER_STATUS[0].id).emit('result', 0)
      io.to(USER_STATUS[1].id).emit('result', 1)
    }

    // リセットしないとemitし続けてしまう
    USER_STATUS = [ ]
  }

}, 1000)


//---------------------------
// Webサーバの機能
//---------------------------
// http://localhost:3000/ へアクセスされたら
app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/public/index.html');
})

// http://localhost:3000/image/xxxx へアクセスされたら
app.get('/image/:file', (req, res) =>{
  const file = req.params.file
  res.sendFile(__dirname + '/public/image/' + file)
})


//---------------------------
// Socket.io
//---------------------------
io.on('connection', (socket)=>{
  console.log('接続されました')

  // 接続されたらトークンを送信
  io.to(socket.id).emit('token', Math.floor(Math.random() * 10000))

  //---------------------------
  // 山札からカードを2枚送る
  //---------------------------
  socket.on('drawcard2', (message)=>{
    // 山札から2枚引く
    const card = trump.drawCard(CARD_STOCK, 2)

    // 内部の変数にカード情報を保存
    USER_CARD[message.token] = [card[0][0], card[0][1]]
  
    // 本人に送る
    io.to(socket.id).emit('member-drawcard2', {token:message.token, card:card})

    // 本人以外に送る
    socket.broadcast.emit("member-drawcard2", {token:message.token})
  })

  //---------------------------
  // 「決定」ボタンが押された
  //---------------------------
  socket.on('calcScore', (data)=>{
    // const score = trump.calcScore(data.card) v0.0.2 カードは渡ってこない
    USER_STATUS.push({id:socket.id, token:data.token})
  })
})

//---------------------------
// Web + Socket.ioサーバを起動
//---------------------------
http.listen(3000, ()=>{
  console.log('サーバが起動しました')
})