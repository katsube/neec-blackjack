'use strict';

/**
 * トランプ モジュール
 *
 */

//--------------------------------------------
// 定数
//--------------------------------------------
const SUIT_MAX = 4
const CARD_MAX = 13

/**
 * 配列を初期化する
 *
 * 以下のような2次元配列を生成します。
 * [
 *   [1, 1],
 *   [1, 2],
 *   (中略)
 *   [4, 13]
 * ]
 */
function initCard(array){
  for(let i=1; i<=SUIT_MAX; i++){
    for(let j=1; j<=CARD_MAX; j++){
        array.push([i, j])
    }
  }
}

/**
 * 配列をランダムに並べ替える
 *
 * 例)
 *   [1,2,3,4,5] -> [4,2,1,5,3]
 */
function shuffleCard(array){
  const len = array.length
    
  for(let i=len-1; i>0; i--){
      const j = Math.floor(Math.random() * 100) % len

      // スワップ
      if( i !== j ){
          const tmp = array[j]
          array[j] = array[i]
          array[i] = tmp
      }  
  }
}

/**
 * カードをn枚取り出す
 *
 * 指定された配列の最後の要素を返却します。
 * 最後の要素は削除されます。
 *
 * 例)
 *   1. 元の配列 [1,2,3,4,5] が渡される
 *   2. 最後の要素 5 が返却される
 *   3. 元の配列は [1,2,3,4] となる
 */
function drawCard(array, n=1){
    const result = [ ]

    do{
        const last = array.pop()
        result.push(last)
    }
    while( --n > 0);
    
    if( result.length === 1 ){
        return( result[0] )
    }
    else{
        return( result )
    }
}

function calcScore(card){
  let score = 0
  const card2 = card.sort().reverse()

  for(let i=0; i<card2.length; i++){
    switch(card2[i]){
      case 1:
        score += ((score + 11) > 21)?  1:11  
        break
      case 11:
      case 12:
      case 13:
        score += 10
        break
      default:
        score += card2[i]
        break
    }
  }

  return(score)
}


//--------------------------------------------
// exports
//--------------------------------------------
module.exports = {
  initCard,
  shuffleCard,
  drawCard,
  calcScore
}