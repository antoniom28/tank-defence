let tank = document.getElementById('tank');
let rockets = document.querySelectorAll('.rocket');

//rockets variables
let rocketOrigin = [];
let rocketCalcX = 0;
let rocketCalcY = 0;
let rocketAngle = 0;

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

window.addEventListener("mousemove", tankRotation , true);
window.addEventListener("keyup", tankMovement , true);

let tankSpeed = 60;


rocketSpawn();
rocketRotation();

function rocketSpawn(){
    //for(let i=0; i<rockets.length;  i++){
        console.log(rockets);
        rockets[1].style.left = "40px";
        rockets[1].style.top = "40px";
        rockets[0].style.left = "40px";
        rockets[0].style.top = "300px";
   // }
}

function tankMovement(){
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
    rocketRotation();
    rocketMovement();
 //   console.log(origin);
}

function rocketRotation(){
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

window.addEventListener("click", tankFire , true);

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
        let rocketSpeed = 600;
        let rocketTime = distance/rocketSpeed;
        //console.log('time',rocketTime);
        setTimeout(() => {
            rockets[i].style.transition=`all ${rocketTime}s linear`;
            rockets[i].style.top = `${finalY}px`;
            rockets[i].style.left = `${finalX}px`;
        }, 0);

        //console.log(rocketTime);
        setTimeout(() => {
            console.log('colpito il carro');
           // console.log(rocketTime , origin.x , origin.y , rockets[i].offsetLeft , rockets[i].offsetTop);
        }, rocketTime*1000);
    }
}

function tankFire(){
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
                    console.log('rimuovo',rockets[i]);
                    rockets[i].parentNode.removeChild(rockets[i]);
                   // if(rockets.length <= 0){
                    clearInterval(ammoTracker);
                    setTimeout(() => {
                        noClick = false;
                    }, 100);
                    ammoPos.innerHTML = "";
                        break;
                  //  }
                }

            }
        }, 50);

        setTimeout(() => {
            ammo.style.transition=`all ${ammoTime}s linear`;
            ammo.style.top = `${finalY}px`;
            ammo.style.left = `${finalX}px`;
        }, 0);

        setTimeout(() => {
            clearInterval(ammoTracker);
            noClick = false;
            ammoPos.innerHTML = "";
        }, ammoTime*1000);
    }
}