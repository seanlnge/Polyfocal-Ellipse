const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width = 2000;
canvas.height = canvas.width / window.innerWidth * window.innerHeight;

ctx.translate(canvas.width/2, canvas.height/2);
ctx.scale(1, -1);

const scale = 20;
const strokeWidth = 10;
const focusWidth = 10;
const epsilon = 0.01;
const maxIterations = 100;

class Ellipse {
    constructor(foci, constant) {
        this.foci = foci;
        this.constant = constant;

        // Find Fermat-Torricelli point
        this.center = {
            x: this.foci.reduce((a, c) => a + c.x, 0) / this.foci.length,
            y: this.foci.reduce((a, c) => a + c.y, 0) / this.foci.length
        };
        let i=0;
        while(i++ < 1000) {
            // Newton-Raphson method over f(x) = this.distance
            const cd = c => Math.hypot(this.center.x - c.x, this.center.y - c.y);
            let dx = this.foci.reduce((a, c) => a + (this.center.x - c.x) / cd(c), 0);
            let dy = this.foci.reduce((a, c) => a + (this.center.y - c.y) / cd(c), 0);
            let d2x = this.foci.reduce((a, c) => a + 1/cd(c) - (this.center.x - c.x)**2/cd(c)**3, 0);
            let d2y = this.foci.reduce((a, c) => a + 1/cd(c) - (this.center.y - c.y)**2/cd(c)**3, 0);
            
            if(d2x == 0 || d2y == 0) break;
            this.center.x -= dx/d2x * 0.1;
            this.center.y -= dy/d2y * 0.1;
        }

        this.points = [];
        for(let angle = 0; angle < 2 * Math.PI; angle += 0.02) {
            this.points.push(this.approximate(angle));
        }
    }

    distance(x, y) {
        return this.foci.reduce((a, c) => a + Math.hypot(c.x-x, c.y-y), 0);
    }
    
    approximate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        let dist = this.constant/this.foci.length;
        let i = 0;

        // Until small enough or max iterations met
        while(i++ < maxIterations && Math.abs(this.distance(dist*cos+this.center.x, dist*sin+this.center.y) - this.constant) > epsilon) {
            const offset = this.distance(dist*cos+this.center.x, dist*sin+this.center.y) - this.constant;

            // Error function is (sum(distances) - constant) ^ 2
            let derivative = this.foci.reduce((a, c) => {
                // (da+db+dc)/dn = da/dn + db/dn + dc/dn
                let x = dist*cos + this.center.x - c.x;
                let y = dist*sin + this.center.y - c.y;

                return a + (x*cos + y*sin) / Math.hypot(x, y);
            }, 0) * 2 * offset;

            // Newton-Raphson method
            dist -= offset**2/derivative;
        }

        // 
        return { x: dist * Math.cos(angle) + this.center.x, y: dist * Math.sin(angle) + this.center.y };
    }

    plot() {
        let color = "black";
        ctx.beginPath();
        ctx.moveTo(this.points.slice(-1)[0].x * scale, this.points.slice(-1)[0].y * scale);
        for(const point of this.points) {
            if(Math.abs(this.distance(point.x, point.y) - this.constant) > epsilon) {
                color = "red";
            }
            ctx.lineTo(point.x * scale, point.y * scale);
        }
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "black";
        for(const focus of this.foci) {
            ctx.beginPath();
            ctx.ellipse(focus.x*scale - focusWidth/4, focus.y*scale - focusWidth/4, focusWidth/2, focusWidth/2, 0, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
        ctx.beginPath();
        ctx.ellipse(this.center.x*scale - focusWidth/4, this.center.y*scale - focusWidth/4, focusWidth/2, focusWidth/2, 0, 0, Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();
    }
}

let foci = [{ x: 0, y: 5 }, { x: -5, y: -5 }, { x: Math.random()*10-5, y: Math.random()*10-5 }];
let distance = 30;

const ellipse = new Ellipse(foci, distance);
ellipse.plot();

function changeFociAmount(value) {
    distance *= value / foci.length;
    foci = Array(parseFloat(value)).fill(0).map(_ => ({ x: Math.random()*10-5, y: Math.random()*10-5 }));
    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    new Ellipse(foci, distance).plot();
}
function changeDistance(value) {
    distance = parseFloat(value) * foci.length;
    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    new Ellipse(foci, distance).plot();
}