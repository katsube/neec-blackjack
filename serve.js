const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const trump = require('./libs/trump')

const CARD_STOCK = [ ]
trump.initCard(CARD_STOCK)
trump.shuffleCard(CARD_STOCK)

let USER_STATUS = [ ]
setInterval(()=>{
  if( USER_STATUS.length === 2 ){
    if( USER_STATUS[0].score > USER_STATUS[1].score ){
      io.to(USER_STATUS[0].id).emit('result', 1)
      io.to(USER_STATUS[1].id).emit('result', 0)
    }
    else{
      io.to(USER_STATUS[0].id).emit('result', 0)
      io.to(USER_STATUS[1].id).emit('result', 1)
    }

    USER_STATUS = [ ]
  }

}, 1000)


app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/public/index.html');
})
app.get('/image/:file', (req, res) =>{
  const file = req.params.file
  res.sendFile(__dirname + '/public/image/' + file)
})


io.on('connection', (socket)=>{
  console.log('接続されました')

  io.to(socket.id).emit('token', Math.floor(Math.random() * 10000))

  socket.on('drawcard2', (message)=>{
    const card = trump.drawCard(CARD_STOCK, 2)

    // 本人に送る
    io.to(socket.id).emit('member-drawcard2', {token:message.token, card:card})

    // 本人以外に送る
    socket.broadcast.emit("member-drawcard2", {token:message.token})
  })

  socket.on('calcScore', (data)=>{
    const score = trump.calcScore(data.card)
    USER_STATUS.push({id:socket.id, token:data.token, score:score})
  })
})

http.listen(3000, ()=>{
  console.log('サーバが起動しました')
})