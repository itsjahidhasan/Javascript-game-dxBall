

export function detectionCollision(ball, gameObject){
   let bottomBall = ball.position.y + ball.size;
   let topBall = ball.position.y;

   let topObject = gameObject.position.y;
   let leftSideObject = gameObject.position.x;
   let rightSideObject = gameObject.position.x + gameObject.width;
   let bottomObject = gameObject.position.y + gameObject.height;

   if(bottomBall >= topObject && topBall <= bottomObject && ball.position.x >= leftSideObject && ball.position.x + ball.size <= rightSideObject){
     return true;
   }
   else{
     return false;
   }
}