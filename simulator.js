
var mwidth = 720;
var mheight = 400;

//these are DISPLAY timestamps
var tnow;
var dt;
var oldt;


//these are global variables for the simulation
var simtime = parseFloat(document.getElementById("simtime").value);
var simdt = parseFloat(document.getElementById("timestep").value);

var running = false;//tells system whether there is a simulation running
var done=false;//tells system whether simulation is done running

// Simulation(dt,xcenter,ycenter,scale)
var mysim = new Simulation(.01,mwidth/2,mheight/2,100)

var sliderpos = 0;

// now set up callback for a slider on the html site.
document.getElementById('posSlider').addEventListener('change', function(){
  if(!running){
    //update the position of our box.
    mysim.x= float(document.getElementById('posSlider').value);
    console.log("updating mysim to x = "+String(mysim.x))
  }
});

console.log("starting up")

function setup() {
  // Create the canvas
  createCanvas(mwidth, mheight);
  background(150);
  console.log("setup done")
}

function draw(){
  //console.log("drawing")
  //this is the dt of the FRAME. Will be slow. Different than the dt of our simulation.
  tnow = millis();
  dt = (tnow-oldt)/1000.0;
  oldt = tnow;

  //clear stuff out
   background(150);
   fill(0);
   stroke(0);

   //if we are supposed to be running, update the simulation
   if(running){
    mysim.update(dt); //dt here is the FRAME dt.
   }
   else{//this must mean we shouldn't be running. just draw the object.
    mysim.draw();
   }

   //if the simulation has run for long enough, print text data to text box.
   if(mysim.t>simtime){
    document.getElementById("simdata").value = mysim.simdata;
    //document.getElementById("simdata").scrollTop = document.getElementById("simdata").scrollHeight
    //then reset our simulation
    running = false;
   }

}


function Simulation(dt,xcenter,ycenter,simscale){
  this.dt = dt;
  this.tau = .2;
  this.x = 0;
  this.simscale = simscale;//visual scale for simulation
  this.xcenter = xcenter;
  this.ycenter = ycenter;
  this.rectsize = 1.0; //meters, base unit for drawing.
  this.simdata = '';
  this.t = 0;

  //now decide how many Euler updates to do per frame
  this.framedt = 1.0/60;//estimated
  //calculate how many...
  this.Eulers_per_frame = this.framedt/this.dt; //

  //state derivatives. don't be afraid to add inputs.
  this.statederivs = function(){

    xd = -this.x*1.0/this.tau
    //console.log(this.x)
  return [xd];
  }

  this.euler = function(running){
      //calculate state derivatives
      xd = this.statederivs();
      //update states.
      this.x = this.x + this.dt*xd;
      this.t = this.t+this.dt;

  }

  this.update = function(framedt){
    //using the dt of the frame, calculate how many Eulers to do.
    this.Eulers_per_frame = int(this.framedt/this.dt);
    //update the system's dynamics N times before displaying results (to keep at real time)
    for(var k=0;k<this.Eulers_per_frame;k++){
    this.euler(this.dt);//update all variables
    //add these to the string of data we will put into the text box
    this.simdata+= String(this.t) + "\t" + String(this.x) + "\r\n";
  }
    //draw stuff
    this.draw();
  }

  this.draw = function(){
    fill(0);
    stroke(0);
    translate(this.xcenter,this.ycenter);
    rect(this.x*this.simscale,0,this.rectsize*this.simscale,this.rectsize*this.simscale);
    //console.log(this.x*this.simscale,0,this.rectsize*this.simscale,this.rectsize*this.simscale)
    translate(-this.xcenter,-this.ycenter);
  }

  this.reset = function(){
    //this.x = 0;
    this.t = 0;
    this.draw();
    this.simdata = ''
  }


}



//this function runs when the RUN button is pressed
function runCallback(){
  if(!running){
  
  simtime = parseFloat(document.getElementById("simtime").value);
  simdt = parseFloat(document.getElementById("timestep").value);
  //reset simulation object
  mysim.reset();

  running = true;

}
}