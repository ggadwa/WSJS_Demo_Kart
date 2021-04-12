import PointClass from '../../../code/utility/point.js';
import LineClass from '../../../code/utility/line.js';
import KartBaseClass from './entity_kart_base.js';

//
// kart player module
//

export default class KartPlayerClass extends KartBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.isPlayer=true;
        
            // model
        
        this.modelName='retro_car_blue';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XZY;
        this.scale.setFromValues(5000,5000,5000);
        this.radius=5000;
        this.height=5000;
        this.eyeOffset=3000;
        this.weight=data.weight;
        this.modelHideMeshes=[];

            // variables

        this.runningPath=false;
        
        Object.seal(this);
    }
    
    release()
    {
        super.release();
    }
    
        //
        // ready
        //
        
    ready()
    {
        super.ready();
        
        this.runningPath=false;     // this triggers kart to start running a path after win/loss
        this.trackOffsetSetup();    // setup for running the track when ai takes over
        
        this.cameraGotoThirdPerson(30000,new PointClass(-20,180,0));
        
        
            // have the nodes calculate a perpendicular line for
            // every node, we use this line to determine when a kart
            // passes a node on the track
            
        this.core.game.map.path.buildPerpendicularLineForLoop(this.goalNodeIdx,this.endNodeIdx,100000);     // enough to reach edge of road/area
        this.travelToNodeIdx=this.goalNodeIdx;
        this.travelToPoint.setFromValues(this.position.x+100000,this.position.y,this.position.z);       // all tracks start down the positive x
    }
    
    
    
    
    
    
    test()
    {
        let dist,nextNodeIdx;
        let nodeIdx,nodeTryCount;
        let angY,pos,origNodeIdx;
        
            // have we passed the current perpendicular
            // line of the next node?

            // create a line from kart center to radius*2 (for slop)
            // off the kart to collide with perpendicular line
            
        this.tempPoint.setFromValues(0,0,100000);
        this.tempPoint.rotateY(null,this.angle.y);
        this.tempPoint.addPoint(this.position);
        
        this.kartTravelLine.setFromValues(this.position,this.tempPoint);
        
            // collide it with current travel to node
            // if we don't collide, make sure we can collide
            // with next node before setting it, else we
            // are way off course and don't change node
            
            // note if no hit, then kartTravelLineHitPoint will be last
            // time we got a hit, which we will use to calculate the next
            // point to head for
        
        if (this.core.game.map.path.checkPerpendicularXZCollision(this.travelToNodeIdx,this.kartTravelLine,this.kartTravelLineHitPoint)) return;
        
            // no collision, find the next node we can hit
            // we just give up if we are so far off course
            // that nothing works after 10 nodes
            
        origNodeIdx=this.travelToNodeIdx;
           
        nodeTryCount=10;
        nodeIdx=this.travelToNodeIdx;
        
        while (true) {
            nextNodeIdx=(nodeIdx===this.endNodeIdx)?this.goalNodeIdx:(nodeIdx+1);    
            if (this.core.game.map.path.checkPerpendicularXZCollision(nextNodeIdx,this.kartTravelLine,null)) {
                console.info('switch from '+this.travelToNodeIdx+'>'+nextNodeIdx);
                this.travelToNodeIdx=nextNodeIdx;
                break;
            }
            
            nodeIdx=nextNodeIdx;
            nodeTryCount--;
            if (nodeTryCount===0) return;       // bailing, way too far off course
        }
        
            // get the hit point on the line we just passed and
            // use that to create a equal point on the next line,
            // we use this to travel to
            
        this.core.game.map.path.translatePerpendicularXZHitToOtherPerpendicularXZHit(origNodeIdx,this.kartTravelLineHitPoint,this.travelToNodeIdx,this.travelToPoint);
        
        console.info(origNodeIdx+'>'+this.travelToNodeIdx+'>'+this.kartTravelLineHitPoint);
         
         /*
        pos=this.getNodePosition(origNodeIdx);
        
        angY=this.position.angleYTo(pos);
        dist=this.position.distance(pos);
        
        this.tempPoint.setFromValues(0,0,dist);
        this.tempPoint.rotateY(null,(360.0-angY));
        
        this.travelToPoint.setFromAddPoint(this.getNodePosition(this.travelToNodeIdx),this.tempPoint);
        
        console.info(angY+'>'+dist);
             * 
          */
    }
    
    
    test2()
    {
        let prevNodeIdx,angY,angY2,angY3;
        
        //prevNodeIdx=(this.travelToNodeIdx===this.goalNodeIdx)?this.endNodeIdx:(this.travelToNodeIdx-1);
        //this.angle.y=;
        
        angY=this.angle.getTurnYTowards(this.position.angleYTo(this.travelToPoint));

        
        /*
        angY=this.getNodePosition(prevNodeIdx).angleYTo(this.getNodePosition(this.travelToNodeIdx));
        if (angY>=180.0) angY=angY-360.0;
        
        angY2=this.position.angleYTo(this.getNodePosition(this.travelToNodeIdx));
        if (angY2>=180.0) angY2=angY2-360.0;
        
        angY3=(angY*0.8)+(angY2*0.2);
        if (angY3<0) angY3=360.0+angY3;
        
        //console.info(angY+'>'+angY2+'>'+angY3);
                
                
        angY=this.angle.getTurnYTowards(angY);

        //angY=this.getNodePosition(prevNodeIdx).angleYTo(this.getNodePosition(this.travelToNodeIdx),this.maxTurnSpeed);
        
        */
        return(angY);
    }




        
        //
        // run kart player
        //
    
    run()
    {
        let x,speed,turnAdd,ang,fire;
        let forward,reverse,drifting,brake,jump;
        let textLap;
        let setup=this.core.setup;
        
        super.run();
        
        this.test();
        
            // player freeze
            
        if (this.core.game.freezePlayer) return;
        
            // are we running a path (we already won/lost)
            
        if (this.runningPath)
        {
            this.pathRun();
        
            turnAdd=this.angle.getTurnYTowards(this.position.angleYTo(this.gotoPosition));
            ang=Math.abs(turnAdd);
            
            this.moveKart(turnAdd,true,false,(ang>=60),(ang>=90),false,false);
            return;
        }
        
            // keys
            
        forward=this.isKeyDown('w');
        reverse=this.isKeyDown('s');
        drifting=(this.isKeyDown('a')||this.isKeyDown('d'));
        brake=this.isKeyDown('q');
        jump=this.isKeyDown(' ')||this.isTouchStickLeftClick();
        
            // turning
            
        turnAdd=0;

        x=this.getMouseMoveX();
        if (x!==0) {
            turnAdd=-(x*setup.mouseXSensitivity);
            turnAdd+=(turnAdd*setup.mouseXAcceleration);
            if (setup.mouseXInvert) turnAdd=-turnAdd;
        }
        
        if (this.hasTouch()) {
            if (!this.isTouchStickRightOn()) {
                brake=true;
                forward=false;
            }
            else {
                forward=true;
                turnAdd-=this.getTouchStickRightX();
            }
        }
        
        //turnAdd=this.test2();
        
            // run the kart
        
        fire=this.isMouseButtonDown(0)||this.isTouchStickRightDown();  
        this.moveKart(turnAdd,forward,reverse,drifting,brake,fire,jump);
        
            // calculate place
            
        this.calculatePlaces();
        
            // update the place/lap
            
        textLap=(this.lap===-1)?1:(this.lap+1);
            
        this.updateText('place',(this.place+1));
        this.updateText('lap',(textLap+'/3'));
        
        if ((this.place!==this.previousPlace) || (this.lap!==this.previousLap)) {
            if ((this.previousPlace!==-1) && (this.previousLap!==-1)) this.pulseElement('lap_background',500,10);
            this.previousPlace=this.place;
            this.previousLap=this.lap;
        }
            
        this.setCount('stars',this.starCount);
        
        speed=this.rotMovement.lengthXZ()/2000;
        if (speed<0) speed=0;
        if (speed>2000) speed=2000;
        this.setDial('speed',speed);
        
            // win or lose
            
        if (textLap===4) {
            
                // trigger the win/loss
                
            if (this.place===0) {
                this.core.game.won(this);
            }
            else {
                this.core.game.lost(this);
            }
            
                // start pathing like a bot
            
            this.runningPath=true;    
            this.pathSetup(2);
        }
    }
}
