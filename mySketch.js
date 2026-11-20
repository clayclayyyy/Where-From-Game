//By Clay Banos
let state="intro",level=-1,page=0,door=-1,typeIndex=0;
let player={x:5,y:8},credits=[0,0,0],collected=[],cars=[],msg="";
let cols=11,rows=9,cw,ch,bx,by;

let stages=[
{name:"BRITISH",items:[[1,6],[8,5],[3,3],[9,2]],intro:["404"]},
{name:"FRENCH",items:[[2,7],[9,5],[1,4],[6,2]],intro:["Congratulations! You've successfully gathered enough British culture to almost convince everyone you're one of them.","Although, being British, French AND Argentine does make the whole 'where are you really from?' question a little awkward.","Anyway, one country down! Let's see if France is any easier to figure out. Bon courage!"]},
{name:"ARGENTINE",items:[[9,7],[2,5],[7,4],[4,2]],intro:["Well done! Another culture successfully collected. You're halfway through proving you belong to three different countries. Quite the achievement, considering you still can't give anyone a straight answer when they ask where you're from.","Two cultures down, and somehow explaining where you belong hasn't gotten any easier. You're too British to be entirely French, too French to be entirely British, and somewhere in between you're still trying to figure it all out. Lovely!","Anyway, enough identity questioning for one day. Argentina is next! Let's see if adding another country to the mix finally helps you figure out where home is. What could possibly go wrong?"]}
];

let opening=["Hey! Welcome! So, you're British, French AND Argentine? Well, aren't you lucky. Three cultures, three countries, and approximately three times the explaining whenever someone asks where you're from.","Your job is simple. Collect cultural credits from Britain, France and Argentina to prove you belong. Surely growing up between three cultures means you know everything about them. What could possibly go wrong?","Three homes, three identities, one very confused sense of belonging. Who knew having three homes could make finding one so difficult? Anyway, let's see how you do!"];

function setup(){createCanvas(windowWidth,windowHeight);textFont("monospace");layout();}
function layout(){cw=width*.9/cols;ch=min(height*.40/rows,cw*.8);bx=(width-cw*cols)/2;by=height*.20;}
function windowResized(){resizeCanvas(windowWidth,windowHeight);layout();}

function draw(){
 background(18,10,25);
 if(state==="intro")intro();
 if(state==="play")game();
 if(state==="doors")doors();
 if(state==="end")ending();
}

function button(x,y,w,h,t){
 fill(53,31,72);stroke(159,111,184);strokeWeight(2);rect(x,y,w,h);
 fill(244,222,255);noStroke();textAlign(CENTER,CENTER);textSize(12);text(t,x+w/2,y+h/2);
}
function hit(x,y,w,h){return mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h;}

function controls(){
 let s=48,g=5,x=(width-(3*s+2*g))/2,y=height-140;
 return [[x+s+g,y,0,-1,"▲"],[x,y+s+g,-1,0,"◀"],[x+s+g,y+s+g,0,1,"▼"],[x+2*(s+g),y+s+g,1,0,"▶"]];
}

function intro(){
 let lines=level<0?opening:stages[level].intro,line=lines[page];
 if(frameCount%2===0&&typeIndex<line.length)typeIndex++;
 fill(224,190,244);textAlign(CENTER);textSize(25);text(level<0?"BELONGING":stages[level].name,width/2,height*.2);
 textSize(13);fill(165,125,191);text("BUT WHERE DO YOU REALLY BELONG?",width/2,height*.25);
 fill(46,29,60);stroke(119,79,145);rect(width*.12,height*.32,width*.76,height*.28);
 fill(91,53,113);noStroke();rect(width*.19,height*.4,45,55);
 fill(245,222,255);textSize(10);text("PLAYER",width*.19+22,height*.4+32);
 fill(32,20,43);stroke(137,94,161);rect(width*.27,height*.38,width*.52,height*.17);
 fill(238,219,247);noStroke();textAlign(LEFT);textSize(14);
 text(line.substring(0,typeIndex),width*.30,height*.43,width*.46,height*.1);
 button(width/2-85,height*.77,170,45,"NEXT >");
}

function start(){
 player={x:5,y:8};collected=[false,false,false,false];cars=[];msg="";
 for(let r=2;r<=7;r++){
  let dir=random()<.5?1:-1;
  for(let i=0;i<2;i++)cars.push({x:i===0?0:cols-1.4,y:r,s:dir*random(.002,.006),dir,w:1.2});
  fixLane(r);
 }
}

function game(){
 fill(224,190,244);noStroke();textAlign(CENTER);textSize(23);text(stages[level].name,width/2,40);
 fill(184,148,207);textSize(13);text("CREDITS: "+credits[level]+" / 8",width/2,75);

 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  fill(r===0?color(76,43,95):r===8?color(62,35,79):r%2===0?color(37,25,49):color(48,31,60));
  stroke(104,73,121);rect(bx+c*cw,by+r*ch,cw,ch);
 }

 fill(218,183,235);noStroke();textSize(10);
 text("FINISH",width/2,by-8);text("START",width/2,by+rows*ch+13);

 for(let i=0;i<4;i++)if(!collected[i]){
  let [x,y]=stages[level].items[i];
  fill(172,111,205);stroke(232,192,250);strokeWeight(2);
  rect(bx+x*cw+cw*.18,by+y*ch+ch*.18,cw*.64,ch*.64);
  fill(255,230,255);noStroke();textSize(10);text("*",bx+(x+.5)*cw,by+(y+.5)*ch);
 }

 moveCars();
 for(let c of cars){
  fill(24,16,34);stroke(159,103,185);strokeWeight(2);
  rect(bx+c.x*cw+2,by+c.y*ch+ch*.2,c.w*cw-4,ch*.6);
 }

 fill(211,174,235);stroke(104,62,133);strokeWeight(2);
 rect(bx+player.x*cw+cw*.17,by+player.y*ch+ch*.12,cw*.66,ch*.76);
 fill(37,21,49);noStroke();textSize(10);
 text("YOU",bx+(player.x+.5)*cw,by+(player.y+.5)*ch);

 for(let b of controls())button(b[0],b[1],48,48,b[4]);

 if(msg){fill(223,190,240);textSize(12);text(msg,width/2,height-165);}
}

function fixLane(r){
 let lane=cars.filter(c=>c.y===r),track=cols-1.4,dir=lane[0].dir,gap=1.5;
 lane.sort((a,b)=>dir>0?a.x-b.x:b.x-a.x);
 for(let p=0;p<2;p++)for(let i=0;i<lane.length;i++){
  let a=lane[i],b=lane[(i+1)%lane.length];
  if(dir>0){
   if((b.x-a.x-a.w+track)%track<gap)b.x=(a.x+a.w+gap)%track;
  }else if((a.x-b.x-b.w+track)%track<gap)b.x=(a.x-gap-b.w+track*2)%track;
 }
}

function moveCars(){
 let track=cols-1.4;
 for(let c of cars)c.x=(c.x+c.s+track)%track;
 for(let r=2;r<=7;r++)fixLane(r);
 for(let c of cars)if(player.y===c.y&&player.x+.83>c.x&&player.x+.17<c.x+c.w){
  player={x:5,y:8};msg="YOU WERE HIT. TRY AGAIN.";break;
 }
}

function move(dx,dy){
 player.x=constrain(player.x+dx,0,cols-1);player.y=constrain(player.y+dy,0,rows-1);
 for(let i=0;i<4;i++){
  let [x,y]=stages[level].items[i];
  if(!collected[i]&&player.x===x&&player.y===y){
   collected[i]=true;credits[level]++;msg="CULTURAL CREDIT +1";
  }
 }
 if(player.y===0){
  if(collected.every(Boolean)){
   level++;
   if(level===3){state="doors";door=-1;}
   else{page=0;typeIndex=0;state="intro";}
  }else{player.y=1;msg="COLLECT ALL ITEMS FIRST";}
 }
}

function doors(){
 fill(224,190,244);noStroke();textAlign(CENTER);textSize(25);
 text("WHERE DO YOU BELONG?",width/2,height*.14);
 fill(169,129,192);textSize(12);text("CHOOSE A CULTURE TO JOIN",width/2,height*.2);

 let names=["BRITISH","FRENCH","ARGENTINE"],w=min(150,width*.25),h=min(260,height*.36),g=min(35,width*.04),start=(width-(w*3+g*2))/2;
 for(let i=0;i<3;i++){
  let x=start+i*(w+g),y=height*.32;
  fill(i===door?92:49,i===door?57:31,i===door?116:65);
  stroke(156,107,183);strokeWeight(3);rect(x,y,w,h);
  fill(226,193,244);noStroke();circle(x+w*.82,y+h*.52,10);
  fill(239,216,250);textSize(14);text(names[i],x+w/2,y+35);
  fill(190,153,212);textSize(12);text(credits[i]+" / 8 CREDITS",x+w/2,y+h+25);
  if(i===door){noFill();stroke(231,190,249);strokeWeight(4);rect(x-5,y-5,w+10,h+10);}
 }
 button(width/2-85,height*.79,170,45,"TRY DOOR");
 if(msg){fill(225,190,245);noStroke();textSize(12);text(msg,width/2,height*.91);}
}

function ending(){
 fill(224,190,244);noStroke();textAlign(CENTER);textSize(25);
 text("NO KEYS AVAILABLE",width/2,height*.35);
 fill(191,154,215);textSize(15);
 text("You collected everything you could.",width/2,height*.45);
 text("But you still don't have enough credits.",width/2,height*.50);
 text("You cannot enter any of the three doors.",width/2,height*.55);
 fill(221,184,239);textSize(13);text("WHERE DOES THAT LEAVE YOU?",width/2,height*.70);
 button(width/2-85,height*.82,170,45,"RESTART");
}

function mousePressed(){
 if(state==="intro"){
  let lines=level<0?opening:stages[level].intro;
  if(hit(width/2-85,height*.77,170,45)){
   if(typeIndex<lines[page].length)typeIndex=lines[page].length;
   else{
    page++;typeIndex=0;
    if(page===3){
     if(level===-1)level=0;
     state="play";start();page=0;
    }
   }
  }
 }else if(state==="play"){
  for(let b of controls())if(hit(b[0],b[1],48,48)){move(b[2],b[3]);break;}
 }else if(state==="doors"){
  let w=min(150,width*.25),h=min(260,height*.36),g=min(35,width*.04),start=(width-(w*3+g*2))/2,y=height*.32;
  for(let i=0;i<3;i++)if(hit(start+i*(w+g),y,w,h))door=i;
  if(hit(width/2-85,height*.79,170,45)){
   msg=door===-1?"PLEASE SELECT A DOOR FIRST.":"NOT ENOUGH CREDITS. KEY DENIED.";
   if(door!==-1)state="end";
  }
 }else if(state==="end"&&hit(width/2-85,height*.82,170,45)){
  state="intro";level=-1;page=0;typeIndex=0;credits=[0,0,0];door=-1;msg="";
 }
 return false;
}
