let player, gun;
let prog = []
let enem = []
let health = 100
let startTime = Date.now();

var times = window.innerWidth / 100
var ww = window.innerWidth

function setup() {
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
}

function draw() {
	clear();

    hbar.x = (health * times) - ww / 2
    htex.text = health

    cur.moveTowards(mouse, 1);

    if (health <= 0) {
        window.location.href = "../game-over"
    }

    // Spawing enemys
    if ((Date.now() - startTime) >= 1000) {
        ene = new Sprite();
        ene.y = 30;
        ene.x = Math.floor(Math.random() * ww);
        ene.layer = 1
        enem.push(ene)
        startTime = Date.now()
    }

    // Player damage
    for (let i = 0; i < enem.length; i++) {
        if (player.collided(enem[i])) {
            health -= 5
        }
        enem[i].moveTowards(player, .01);
        enem[i].rotation = 0;

        for (let x = 0; x < prog.length; x++) {
            if (enem[i].overlaps(prog[x])) {
                console.log("hit")
                enem[i].remove()
                prog[x].remove()
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
    if (kb.pressing("left")) {
        if (!(player.vel.x <= -3)) {
            player.vel.x -= .4
        } else {
            player.vel.x = -1
        }
    } else if (kb.pressing("right")) {
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
    if (kb.pressing("up")) {
        if (!(player.vel.y <= -3)) {
            player.vel.y -= .4
        } else {
            player.vel.y = -1
        }
    } else if (kb.pressing("down")) {
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