let tank = document.getElementById('tank');
let ammo;
let angle = 0;

let tankTop = tank.offsetTop;
let tankLeft = tank.offsetLeft;
let tankW = tank.offsetWidth;
let tankH = tank.offsetHeight;

let calcY;
let calcX;
let noClick = false;
let origin = {x: tank.offsetLeft + tank.offsetWidth/2 , y: tank.offsetTop + tank.offsetHeight/2};
//console.log(origin);

window.addEventListener("mousemove", tankRotation , true);
window.addEventListener("keyup", tankMovement , true);

let tankSpeed = 60;

function tankMovement(){
    switch(event.key){
        case 'w':
            tankTop -= tankSpeed;
            tank.style.top = `${tankTop}px`;
            origin = {x: tank.offsetLeft + tank.offsetWidth/2 , y: tank.offsetTop + tank.offsetHeight/2};
        break;
        case 's':
            tankTop += tankSpeed;
            tank.style.top = `${tankTop}px`;
            origin = {x: tank.offsetLeft + tank.offsetWidth/2 , y: tank.offsetTop + tank.offsetHeight/2};
        break;
        case 'a':
            tankLeft-= tankSpeed;
            tank.style.left = `${tankLeft}px`;
            origin = {x: tank.offsetLeft + tank.offsetWidth/2 , y: tank.offsetTop + tank.offsetHeight/2};
        break;
        case 'd':
            tankLeft += tankSpeed;
            tank.style.left = `${tankLeft}px`;
            origin = {x: tank.offsetLeft + tank.offsetWidth/2 , y: tank.offsetTop + tank.offsetHeight/2};
        break;
    }
}

function tankRotation(){
    calcX = event.clientX - origin.x ;
    calcY = origin.y - event.clientY;

    if(calcX > 0 && calcY >= 0)
        angle = Math.atan(calcY/calcX);
    else if(calcX > 0 && calcY < 0)
        angle = Math.atan(calcY/calcX) + 2*Math.PI;
    else if(calcX < 0)
        angle = Math.atan(calcY/calcX) + Math.PI;

    angle = radians_to_degrees(angle);
    tank.style.transform = `rotate(${-angle}deg)`;

    /*let mousePos = {
        x: calcX , 
        y: calcY
    };
    console.log(mousePos,angle);*/
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

function tankFire(){
    if(noClick == false){
        noClick = true;
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

        let x = event.clientX;
        let y = event.clientY;
        let startX = ammo.offsetLeft;
        let startY = ammo.offsetTop;

        let p1 = {x: startX , y:startY};
        let p2 = {x: x , y:y};

        //distanza tra i due punti, ovvero origine(tank posizione attuale) e posizione del click
        let distance = Math.sqrt(Math.pow(p2.x - p1.x , 2) + Math.pow(p2.y - p1.y , 2));
        console.log('dist',distance);
        let ammoSpeed = 600;
        let ammoTime = distance/ammoSpeed;
        console.log('time',ammoTime);


        setTimeout(() => {
            ammo.style.transition=`all ${ammoTime}s linear`;
            ammo.style.top = `${y}px`;
            ammo.style.left = `${x}px`;
        }, 0);

        setTimeout(() => {
            noClick = false;
            ammoPos.innerHTML = "";
        }, ammoTime*1000);
    }
}