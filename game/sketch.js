let player, gun;
let prog = []
let enem = []
let health = 100
let startTime = Date.now();

var times = window.innerWidth / 100
var ww = window.innerWidth
var wh = window.innerHeight
var isded = false

var seconds = 0;

caches.open("cache").then((cache) => {
    cache.add("../game-over").then(() => console.log("Data added to cache.")).catch((error) => console.error("Error adding data to cache:", error));
})

function setup() {
    setInterval(function() {
        seconds++;
        console.log(Math.floor(seconds / 60))
    }, 1000);

	new Canvas();
	world.gravity.y = 10;

	player = new Sprite();
	player.y = window.innerHeight / 2;
    player.collider = 'kinematic'
    player.layer = 1

    gun = new Sprite()
    gun.collider = 'kinematic'
    gun.width = 50
    gun.height = 20
    gun.layer = 2

    hbar = new Sprite();
    hbar.width = window.innerWidth
    hbar.collider = 'none'
    hbar.y = 0
    hbar.layer = 10

    htex = new Sprite()
    htex.collider = 'none'
    htex.textSize = 20;
    htex.layer = 11
    htex.x = 20
    htex.y = 10
    htex.height = 30

    cur = new Sprite();
	cur.d = 20;
	cur.text = '🐭';
	cur.textSize = 30;
    cur.collider = 'none'
    cur.layer = 12
    mouse.visible = false;

    time = new Sprite()
    time.collider = 'none'
    time.textSize = 20;
    time.layer = 11
    time.x = window.innerWidth / 2
    time.y = window.innerHeight - 15
    time.height = 30
}

function draw() {
	clear();

    if (seconds / 60 >= 1) {
        var secs = seconds - (Math.floor(seconds / 60) * 60)
    } else {
        var secs = seconds
    }

    if (secs < 10) {
        var tsec = ("0" + secs)
    } else {
        var tsec = secs
    }
    if (Math.floor(seconds / 60) < 10) {
        var tmin = ("0" + Math.floor(seconds / 60))
    } else {
        var tmin = Math.floor(seconds / 60)
    }

    time.text = (String(tmin) + ":" + String(tsec))

    hbar.x = (health * times) - ww / 2
    htex.text = health

    cur.moveTowards(mouse, 1);

    if (health <= 0 && !isded) {
        window.location.href = "../game-over"
        isded = true
    }

    // Spawing enemys
    if ((Date.now() - startTime) >= 1000) {
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                ene = new Sprite();
                ene.y = 30;
                ene.x = Math.floor(Math.random() * ww);
                ene.layer = 1
                enem.push(ene)
                startTime = Date.now()
                break;
            case 1:
                ene = new Sprite();
                ene.y = wh;
                ene.x = Math.floor(Math.random() * ww);
                ene.layer = 1
                enem.push(ene)
                startTime = Date.now()
                break;
            case 2:
                ene = new Sprite();
                ene.y = Math.floor(Math.random() * wh);
                ene.x = ww;
                ene.layer = 1
                enem.push(ene)
                startTime = Date.now()
                break;
            case 3:
                ene = new Sprite();
                ene.y = Math.floor(Math.random() * wh);
                ene.x = 0;
                ene.layer = 1
                enem.push(ene)
                startTime = Date.now()
                break;
        }
    }

    // Player damage
    for (let i = 0; i < enem.length; i++) {
        if (player.collided(enem[i])) {
            health -= 5
        }
        enem[i].moveTowards(player, .01);
        enem[i].rotation = 0;

        for (let x = 0; x < prog.length; x++) {
            try {
                if (enem[i].overlaps(prog[x])) {
                    console.log("hit")
                    enem[i].remove()
                    prog[x].remove()
                    enem.splice(i, 1)
                    console.log(enem)
                }
            } catch (error) {
                console.log(error)
            }
            if ((prog[x].x >= window.innerWidth || prog[x].x <= 0) || (prog[x].y >= window.innerHeight|| prog[x].y <= 0)) {
                prog[x].remove()
                prog.splice(x, 1)
            }
        }
    }


    // Gun pos and rot
    gun.x = player.x
    gun.y = player.y
    gun.rotateTowards(mouse)

    // Gun shoot 
    if (mouse.pressed()) {
        var bul = new Sprite()
        bul.diameter = 20
        bul.x = player.x
        bul.y = player.y
        bul.collider = 'kinematic'
        bul.layer = 2
        let angle = atan2(mouseY - player.y, mouseX - player.x);
        bul.direction = angle
        bul.speed = 8;
        if (!prog.includes(bul)) {
            prog.push(bul)
        }
    }

    // Left Right
    if (kb.pressing("left") && player.x >= 0) {
        if (!(player.vel.x <= -3)) {
            player.vel.x -= .4
        } else {
            player.vel.x = -1
        }
    } else if (kb.pressing("right") && player.x <= ww) {
        if (!(player.vel.x >= 3)) {
            player.vel.x += .4
        } else {
            player.vel.x = 1
        }
    } else {
        if (player.vel.x != 0){
            if (player.vel.x > 0) {
                player.vel.x -= .12
            } else {
                player.vel.x += .12
            }
        }
    }

    // Up down
    if (kb.pressing("up") && player.y >= 0) {
        if (!(player.vel.y <= -3)) {
            player.vel.y -= .4
        } else {
            player.vel.y = -1
        }
    } else if (kb.pressing("down") && player.y <= wh) {
        if (!(player.vel.y >= 3)) {
            player.vel.y += .4
        } else {
            player.vel.y = 1
        }
    } else {
        if (player.vel.y != 0){
            if (player.vel.y > 0) {
                player.vel.y -= .12
            } else {
                player.vel.y += .12
            }
        }
    }
}