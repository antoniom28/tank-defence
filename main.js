let tank = document.getElementById('tank');
let rockets = document.querySelectorAll('.rocket');

//rockets variables
let rocketCalcX = 0;
let rocketCalcY = 0;
let rocketAngle = 0;

let gameStarted = false;
let gameLosed = false;
let roundNumber = 0;
let ammo;
let angle = 0;

//tank variables
let tankTop = tank.offsetTop;
let tankLeft = tank.offsetLeft;
let tankW = tank.offsetWidth;
let tankH = tank.offsetHeight;
let lastX = 0;
let lastY = 0;
let tankCalcY;
let tankCalcX;

let noClick = false;
let origin = {x: tank.offsetLeft + tank.offsetWidth/2 , y: tank.offsetTop + tank.offsetHeight/2};
//console.log(origin);
let hordeTracker;
let tankSpeed = 60;

function goToCenter(){
    tank.style.top = "50%";
    tank.style.left = "50%";
    setTimeout(() => {
        tankTop = tank.offsetTop;
        tankLeft = tank.offsetLeft;
        tankW = tank.offsetWidth;
        tankH = tank.offsetHeight;
        console.log(tankTop , tankLeft);
        origin = {x: tank.offsetLeft + tank.offsetWidth/2 , y: tank.offsetTop + tank.offsetHeight/2};
        startGame();
    }, 1000);
}

function startGame(){
    document.getElementById('main-menu').style.display = "none";
    window.addEventListener("mousemove", tankRotation , true);
    window.addEventListener("keyup", tankMovement , true);
    window.addEventListener("click", tankFire , true);
}

function rocketSpawn(){ 
    roundNumber++;
    document.getElementById('spawn-score').innerHTML = "";
    document.getElementById('round').innerHTML = `ROUND ${roundNumber}`;
    document.getElementById('round-box').style.display = "block";
    setTimeout(() => {
        document.getElementById('round-box').style.display = "none";
    }, 1500);
    setTimeout(() => {
        let rocketPos = document.getElementById('rocket-pos');
        rocketPos.innerHTML = "";
        let horde = Math.floor(Math.random()*5 + 3);
        for(let i=0; i<horde; i++){
            let newRocket = document.createElement('img');
            newRocket.className += " rocket";
            newRocket.src="images/rocket_0.jpg";
            rocketPos.append(newRocket);
        }
        rockets = document.querySelectorAll('.rocket');
        for(let i=0; i<rockets.length;  i++){
            //   let randomSpawn = Math.floor(Math.random()*101);
            let leftSpawn = Math.floor(Math.random()*2);
            let topSpawn = Math.floor(Math.random()*2);
            //0 false, 1 true
            let maxW = document.documentElement.clientWidth;
            let maxH = document.documentElement.clientHeight;
            let costSpawn = 200*(i+1);

            let spawnPoint = {
                x : leftSpawn == 0 ? (maxW + costSpawn) : (0 - costSpawn),
                y : topSpawn == 0 ? (maxH + costSpawn) : (0 - costSpawn),
            };

            console.log(leftSpawn , spawnPoint);
            rockets[i].style.left = `${spawnPoint.x}px`;
            rockets[i].style.top = `${spawnPoint.y}px`;
        } 
        rocketRotation();
        rocketMovement();
    }, 2000);
}

//per ora ho disabilitato il movimento del carro durante il gioco,
//è da fixare, creava problemi con il track del missile

function tankMovement(){
    if(!gameStarted){
        switch(event.key){
                case 'w':
                    tankTop -= tankSpeed;
                    tank.style.top = `${tankTop}px`;;
                break;
                case 's':
                    tankTop += tankSpeed;
                    tank.style.top = `${tankTop}px`;
                break;
                case 'a':
                    tankLeft-= tankSpeed;
                    tank.style.left = `${tankLeft}px`;
                break;
                case 'd':
                    tankLeft += tankSpeed;
                    tank.style.left = `${tankLeft}px`;
                break;
            }
        origin = {x: tankLeft + tank.offsetWidth/2 , y: tankTop + tank.offsetHeight/2};
        tankRotation();
    }
    if(event.key == " " && !gameStarted){
        document.getElementById('game-start').style.display = "flex";
        setTimeout(() => {
            document.getElementById('game-start').style.display = "none";
        }, 1500);
        hordeTracker = setInterval(() => {
            let control = document.querySelectorAll('.rocket');
            if(control.length <= 0){
                let rocketPos = document.getElementById('rocket-pos');
                rocketPos.innerHTML = "";
                rockets = 0;
                rocketSpawn();
            }
        }, 3000);
        gameStarted = true;
    }
}

function rocketRotation(){
    let rocketOrigin = [];
    rockets = document.querySelectorAll('.rocket');
    for(let i=0; i<rockets.length;  i++){
        rocketOrigin.push({x: rockets[i].offsetLeft + rockets[i].offsetWidth/2 , y: rockets[i].offsetTop + rockets[i].offsetHeight/2});
    }
    //console.log(rocketOrigin);
    
    for(let i=0; i<rockets.length;  i++){
        rocketCalcX = origin.x - rocketOrigin[i].x;
        rocketCalcY = rocketOrigin[i].y - origin.y;
        rocketAngle = 0;

        rocketAngle = angle_calculation(rocketAngle , rocketCalcX , rocketCalcY , 'deg');

        //console.log(rocketCalcX , rocketCalcY ,rocketAngle);
        rockets[i].style.transform = `rotate(${-rocketAngle}deg)`;
    }
}

function tankRotation(){
    if(event.clientX && event.clientY){
        tankCalcX = event.clientX - origin.x ;
        tankCalcY = origin.y - event.clientY;
        lastX = event.clientX;
        lastY = event.clientY;
    } else{
        tankCalcX = lastX - origin.x ;
        tankCalcY = origin.y - lastY;
    }

    angle = angle_calculation(angle , tankCalcX , tankCalcY , 'deg');

    tank.style.transform = `rotate(${-angle}deg)`;
}

function angle_calculation(calcAngle , x , y , type){
    if(x > 0 && y >= 0)
        calcAngle = Math.atan(y/x);
    else if(x > 0 && y < 0)
        calcAngle = Math.atan(y/x) + 2*Math.PI;
    else if(x < 0)
        calcAngle = Math.atan(y/x) + Math.PI;
    else if(x == 0 && y > 0)
        calcAngle = Math.PI/2;
    else if(x == 0 && y < 0)
        calcAngle = (3*Math.PI)/2;
    else calcAngle = 0;

    if(type == 'deg')
        calcAngle = radians_to_degrees(calcAngle);
    return calcAngle;
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function rocketMovement(){
    for(let i=0; i<rockets.length;  i++){
        let startX = rockets[i].offsetLeft;
        let startY = rockets[i].offsetTop;
        let finalX = origin.x;
        let finalY = origin.y;

        //definisco i punti
        let p1 = {x: startX , y:startY};
        let p2 = {x: finalX , y:finalY};

        //distanza tra i due punti, ovvero origine(tank posizione attuale) e posizione del click
        let distance = Math.sqrt(Math.pow(p2.x - p1.x , 2) + Math.pow(p2.y - p1.y , 2));
        //console.log('dist',distance);
        let rocketSpeed = 500;
        let rocketTime = distance/rocketSpeed;
        //console.log('time',rocketTime);
        setTimeout(() => {
            rockets[i].style.transition=`all ${rocketTime}s linear`;
            rockets[i].style.top = `${finalY}px`;
            rockets[i].style.left = `${finalX}px`;
        }, 0);

        //console.log(rocketTime);
        setTimeout(() => {
            if(rockets.length > 0 && rockets[i].offsetWidth != 0 && rockets[i].offsetHeight != 0){
                console.log('colpito il carro');
                gameLosed = true;
                removeAllEvent();
                rockets = 0;
                document.getElementById('rocket-pos').innerHTML = "";
            }
        }, rocketTime*1000);
    }
}

function tankFire(){
    if(gameLosed)
        return;
    let hitted = false;
    //console.log(tankCalcX, tankCalcY , angle);
    if(noClick == false){
        noClick = true;

        //creazione elemento proiettile
        ammoPos = document.getElementById('ammo-pos');
        let newAmmo = document.createElement('img');
        newAmmo.classList +=" fire";
        newAmmo.id ="ammo";
        newAmmo.src="images/fire.png";
        ammoPos.append(newAmmo);

        ammo = document.getElementById('ammo');
        ammo.style.transform = `rotate(${-angle}deg)`;
        ammo.style.top = `${tankTop + tankH/2}px`;
        ammo.style.left = `${tankLeft + tankW/2}px`;
        //

        let startX = ammo.offsetLeft;
        let startY = ammo.offsetTop;
        let finalX = event.clientX;
        let finalY = event.clientY;

        //definisco i punti
        let p1 = {x: startX , y:startY};
        let p2 = {x: finalX , y:finalY};

        //distanza tra i due punti, ovvero origine(tank posizione attuale) e posizione del click
        let distance = Math.sqrt(Math.pow(p2.x - p1.x , 2) + Math.pow(p2.y - p1.y , 2));
        //console.log('dist',distance);
        let ammoSpeed = 600;
        let ammoTime = distance/ammoSpeed;
        //console.log('time',ammoTime);

        //creo la hitbox
        let ammoTracker = setInterval(() => {
            if(gameLosed){
                clearInterval(ammoTracker);
                removeAllEvent();
            }
            for(let i=0; i<rockets.length;  i++){
                rocketCalcX = origin.x - rockets[i].offsetLeft;
                rocketCalcY = rockets[i].offsetTop - origin.y;
                let angleCalc = 0;
                angleCalc = angle_calculation(angleCalc , rocketCalcX , rocketCalcY , 'rad');
                let rocketHitBox = {
                    startX : rockets[i].offsetLeft,
                    finalX : rockets[i].offsetLeft + rockets[i].offsetWidth,
                    startY : rockets[i].offsetTop,
                    finalY : rockets[i].offsetTop + Math.abs(rockets[i].offsetWidth*Math.sin(angleCalc)),
                };

                if(rocketHitBox.finalY - rocketHitBox.startY < 10){
                    rocketHitBox.startY = rockets[i].offsetTop - 15;
                    rocketHitBox.finalY = rockets[i].offsetTop + 15;
                }


                let ammoHitBox = {
                    startX : ammo.offsetLeft,
                    finalX : ammo.offsetLeft + 5,
                    startY : ammo.offsetTop,
                    finalY : ammo.offsetTop + 5,
                };
             //  console.log('missile:',i,rocketHitBox , ammoHitBox);
                if(
                    (ammoHitBox.startX >= rocketHitBox.startX && ammoHitBox.startX <= rocketHitBox.finalX)
                    &&
                    ((ammoHitBox.startY >= rocketHitBox.startY && ammoHitBox.startY <= rocketHitBox.finalY)
                    ||
                    (ammoHitBox.finalY >= rocketHitBox.startY && ammoHitBox.finalY <= rocketHitBox.finalY))
                    //a <= ammoHitBox.startX <= b
                ){
                    console.log('missile colpito' , i);
                    document.getElementById('spawn-score').innerHTML = "";
                    let newScore = document.createElement('h3');
                    newScore.id = "score-plus";
                    newScore.innerHTML = "+ 1";
                    newScore.style.left = `${rocketHitBox.startX}px`;
                    newScore.style.top = `${rocketHitBox.startY}px`;
                    document.getElementById('spawn-score').append(newScore);
                    hitted = true;
                    rockets[i].parentNode.removeChild(rockets[i]);
                   // if(rockets.length <= 0){
                    clearInterval(ammoTracker);
                    setTimeout(() => {
                        noClick = false;
                    }, 0);
                    ammoPos.innerHTML = "";
                        break;
                  //  }
                }

            }
        }, 20);

        setTimeout(() => {
            ammo.style.transition=`all ${ammoTime}s linear`;
            ammo.style.top = `${finalY}px`;
            ammo.style.left = `${finalX}px`;
        }, 0);

        console.log(rockets);
        setTimeout(() => {
            if(!hitted){
                clearInterval(ammoTracker);
                noClick = false;
                ammoPos.innerHTML = "";
            }
            if(rockets.length <= 0)
                clearInterval(ammoTracker);
        }, ammoTime*1000);
    }
}

function removeAllEvent(){
    clearInterval(hordeTracker);
    window.removeEventListener("click", tankFire , true);
    window.removeEventListener("mousemove", tankRotation , true);
    window.removeEventListener("keyup", tankMovement , true);
}