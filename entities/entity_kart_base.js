import PointClass from '../../../code/utility/point.js';
import LineClass from '../../../code/utility/line.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

//
// kart base module
//
// this is used for both kart players and bots as they have
// mostly the same methods
//

export default class KartBaseClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=4000;
        this.collisionSpokeCount=48;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // settable by data fields
            
        this.maxTurnSpeed=data.turnSpeed;
        this.driftMaxTurnSpeed=data.turnSpeed+1;
        this.forwardAcceleration=data.acceleration;
        this.forwardDeceleration=data.acceleration*3.0;
        this.forwardMaxSpeed=data.speed;
        this.reverseAcceleration=data.acceleration*0.75;
        this.reverseDeceleration=data.acceleration*4.0;
        this.reverseMaxSpeed=data.speed*0.7;
        this.forwardBrakeDeceleration=data.speed*0.04;
        this.reverseBrakeDeceleration=data.speed*0.05;
        this.jumpHeight=1000+((500-data.weight)*0.5);
        this.spinOutSpeed=6+((500-data.weight)*0.02);
        this.driftDecelerationFactor=0.98+((data.weight-500)*0.0002);
        
            // variables
        
        this.starCount=0;
            
        this.inDrift=false;
        
        this.smokeCoolDownCount=0;
        this.burstCoolDownCount=0;
        this.bounceCount=0;
        this.reflectCount=0;
        this.spinOutCount=0;
        this.lastDriftSoundPlayIdx=-1;
        
        this.burstEndTimestamp=0;
        
        this.turnSmooth=0;
        this.turnCoolDown=0;

        this.lastDrawTick=0;
        
        this.engineSoundPlayIdx=0;
        this.engineSoundRateAirIncrease=0;
        
            // variables for self driving, for bots
            // and for player after winning
            
        this.travelToNodeIdx=-1;
        this.travelToPoint=new PointClass(0,0,0);
        
        this.tempPoint=new PointClass(0,0,0);
        this.kartTravelLine=new LineClass(new PointClass(0,0,0),new PointClass(0,0,0));
        this.kartTravelLineHitPoint=new PointClass(0,0,0);
        
            // lap calculations
            
        this.lap=0;
        this.previousLap=-1;
        this.place=0;
        this.previousPlace=-1;
        this.placeNodeIdx=0;
        this.placeNodeDistance=0;
        
            // the weapon
        
        this.bowlingBallWeapon=null;
        
            // some static nodes
            
        this.goalNodeIdx=-1;
        this.endNodeIdx=-1;
        
            // animations
            
        this.idleAnimation=new AnimationDefClass(175,275,0);
        this.driveAnimation=new AnimationDefClass(380,400,0);
        this.turnLeftAnimation=new AnimationDefClass(405,425,0);
        this.turnRightAnimation=new AnimationDefClass(435,455,0);
        this.spinOutAnimation=new AnimationDefClass(275,375,0);
        
            // sounds
            
        this.engineSound=new SoundDefClass('engine',0.5,0,800000,0,3.0,true);
        this.skidSound=new SoundDefClass('skid',1.0,0,80000,0,0,false);
        this.burstSound=new SoundDefClass('burst',1.0,0,50000,0,0,false);
        this.crashKartSound=new SoundDefClass('crash',1.0,0.2,100000,0,0,false);
        this.crashWallSound=new SoundDefClass('crash',0.8,0.2,100000,0,0,false);
        
            // remember the original angle
            // so we can restart players into bots
            // after they win
             
        this.kartStartAngY=this.angle.y;
        
            // pre-allocate
            
        this.movement=new PointClass(0,0,0);
        this.rotMovement=new PointClass(0,0,0);
        this.driftMovement=new PointClass(0,0,0);
        this.bounceReflectMovement=new PointClass(0,0,0);
        this.smokePosition=new PointClass(0,0,0);
        this.burstPosition=new PointClass(0,0,0);
        
        this.rigidAngle=new PointClass(0,0,0);
        this.rigidGotoAngle=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,0,0);
        this.fireAngle=new PointClass(0,0,0);
        
            // no seal, object is extended
    }
    
    initialize()
    {
        super.initialize();
        
            // bowling ball weapon

        this.bowlingBallWeapon=this.addEntity('weapon_bowling_ball','weapon_bowling_ball',new PointClass(0,0,0),new PointClass(0,0,0),null,this,this,true);
            
        return(true);
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
        let spot;
        
        super.ready();
         
        this.inDrift=false;
        
        this.smokeCoolDownCount=0;
        this.burstCoolDownCount=0;
        this.bounceCount=0;
        this.reflectCount=0;
        this.spinOutCount=0;
        this.lastDriftSoundPlayIdx=-1;
        
        this.turnSmooth=0;
        this.turnCoolDown=0;
        
        this.burstEndTimestamp=0
        
        this.lap=-1;            // we are currently starting before the goal
        
        this.lastDrawTick=this.getTimestamp();
        this.rigidGotoAngle.setFromValues(0,0,0);
        
            // star count
            
        this.starCount=0;
        
            // engine sound
            
        this.engineSoundRateAirIncrease=0;
        this.engineSoundPlayIdx=this.playSound(this.engineSound);
        
            // some specific nodes
            
        this.endNodeIdx=this.findKeyNodeIndex('end');
        this.goalNodeIdx=this.findKeyNodeIndex('goal');
        
            // get a random place from the spots
            
        spot=this.getRandomUnusedSpotAndMark();
        this.position.setFromPoint(spot.position);

            // idle animation
            
        this.startAnimation(this.idleAnimation);
    }
    
        //
        // smoke and burst effects
        //
        
    createSmoke(offsetAngleY)
    {
        this.smokePosition.setFromValues(0,Math.trunc(this.height*0.25),this.radius);
        this.smokePosition.rotateX(null,this.angle.x);
        this.smokePosition.rotateZ(null,this.angle.z);
        this.smokePosition.rotateY(null,((this.angle.y+offsetAngleY)%360));
        this.smokePosition.addPoint(this.position);

        this.addEffect(this,'tire_smoke',this.smokePosition,null,true);
    }
    
    createBurst(offsetAngleY)
    {
        this.burstPosition.setFromValues(0,Math.trunc(this.height*0.25),this.radius);
        this.burstPosition.rotateX(null,this.angle.x);
        this.burstPosition.rotateZ(null,this.angle.z);
        this.burstPosition.rotateY(null,((this.angle.y+offsetAngleY)%360));
        this.burstPosition.addPoint(this.position);

        this.addEffect(this,'exhaust',this.burstPosition,null,true);
    }
    
        //
        // pickup items
        //
        
    addStar()
    {
        this.starCount++;
        if (this.starCount>10) this.starCount=10;
    }
    
    removeStar()
    {
        this.starCount--;
        if (this.starCount<0) this.starCount=0;
    }
    
    addBurst()
    {
        this.burstEndTimestamp=this.getTimestamp()+2500;
        
        this.playSound(this.burstSound);
    }
    
        //
        // drifts, bounces, spins
        //
        
    driftStart()
    {
        this.inDrift=true;
        this.driftMovement.setFromPoint(this.rotMovement);
        this.lastDriftSoundPlayIdx=this.playSound(this.skidSound);
    }
    
    driftEnd()
    {
        if (!this.inDrift) return;
        
        this.inDrift=false;

        if (this.lastDriftSoundPlayIdx!==-1) {
            this.stopSound(this.lastDriftSoundPlayIdx);
            this.lastDriftSoundPlayIdx=-1;
        }
    }

    bounceStart()
    {
        if ((this.bounceCount!==0) || (this.reflectCount!==0) || (this.spinOutCount!==0)) return;
        
            // turn on bounce
            
        this.bounceCount=20;
        this.bounceReflectMovement.setFromPoint(this.rotMovement);
        this.bounceReflectMovement.scale(-1);
        
        this.movement.z=0;          // clear all forward movement for a bounce
        
        this.playSound(this.crashWallSound);
        
            // bounce cost a star
            
        this.removeStar();
        
            // bounces cancel drifts
            
        this.driftEnd();
    }
    
    reflectStart(hitEntity)
    {
        if ((this.bounceCount!==0) || (this.reflectCount!==0) || (this.spinOutCount!==0)) return;
        
            // turn on reflect
            
        this.reflectCount=20;
        this.bounceReflectMovement.setFromPoint(this.movement);
        this.bounceReflectMovement.rotateY(null,hitEntity.position.angleYTo(this.position));
        
        this.playSound(this.crashKartSound);
        
            // reflect cost a star
            
        this.removeStar();
        
            // reflect cancel drifts
            
        this.driftEnd();
    }
    
        //
        // damage
        //
        
    damage(fromEntity,damage,hitPoint)
    {
            // projectile hits cost a star and start
            // a spin
            
        this.spinOutCount=360;
        this.removeStar();
        
        this.playSound(this.crashWallSound);
    }
    
        //
        // ai path routines
        //
        
    pathSetup()
    {
        this.travelToNodeIdx=this.goalNodeIdx;
        
            // use starting angle to get initial forward path
            
        this.travelToPoint.setFromValues(0,0,100000);
        this.travelToPoint.rotateY(null,this.kartStartAngY);
        this.travelToPoint.addPoint(this.position);
    }
    
    pathRun()
    {
        let nextNodeIdx;
        let nodeIdx,nodeTryCount;
        let origNodeIdx;
        
            // have we passed the current perpendicular
            // line of the next node?

            // create a line from kart center to radius*2 (for slop)
            // off the kart to collide with perpendicular line
            
        this.tempPoint.setFromValues(0,0,200000);
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
        
        if (this.checkPathPerpendicularXZCollision(this.travelToNodeIdx,this.kartTravelLine,this.kartTravelLineHitPoint)) return;
        
            // no collision, so we passed a node, check to
            // see if it's the goal
        
        if (this.travelToNodeIdx===this.goalNodeIdx) this.lap++;
 
            // now find the next node we can hit
            // we just give up if we are so far off course
            // that nothing works after 10 nodes
            
        origNodeIdx=this.travelToNodeIdx;
           
        nodeTryCount=10;
        nodeIdx=this.travelToNodeIdx;
        
        while (true) {
            nextNodeIdx=(nodeIdx===this.endNodeIdx)?this.goalNodeIdx:(nodeIdx+1);
            if (this.checkPathPerpendicularXZCollision(nextNodeIdx,this.kartTravelLine,null)) {
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
            
        this.translatePathPerpendicularXZHitToOtherPerpendicularXZHit(origNodeIdx,this.kartTravelLineHitPoint,this.travelToNodeIdx,this.travelToPoint);
    }

        //
        // kart mainline
        //
    
    moveKart(turnAdd,moveForward,moveReverse,drifting,brake,fire,jump)
    {
        let maxTurnSpeed,speed,rate;
        
            // spinning
            
        if (this.spinOutCount!==0) {
            moveForward=false;          // if spinning, you can't drive forward or backwards or drift
            moveReverse=false;
            drifting=false;
            
            this.spinOutCount-=(this.burstEndTimestamp===0)?this.spinOutSpeed:(this.spinOutSpeed*2);    // bursting gets out of spins twice as fast
            if (this.spinOutCount<=0) this.spinOutCount=0;
        }
        
            // firing
        
        if (fire) {
            this.fireAngle.setFromPoint(this.drawAngle);
            this.fireAngle.x=-this.fireAngle.z;      // translate rigid body to fire position
            this.bowlingBallWeapon.fire(this.position,this.fireAngle);
        }
        
            // turning
            
        if (turnAdd!==0) {
            
                // clamp to max turning speed
                
            maxTurnSpeed=(this.inDrift)?this.driftMaxTurnSpeed:this.maxTurnSpeed;
            if (Math.abs(turnAdd)>maxTurnSpeed) turnAdd=maxTurnSpeed*Math.sign(turnAdd);

            this.angle.y+=turnAdd;
            if (this.angle.y<0.0) this.angle.y+=360.0;
            if (this.angle.y>=360.00) this.angle.y-=360.0;
        }
        
            // can we go into a drift?
            // if so we stick to the current movement
            
        if ((drifting) && (this.bounceCount===0) && (this.reflectCount===0) && (this.spinOutCount===0)) {
            if (!this.inDrift) {
                this.driftStart();
            }
        }
        else {
            this.driftEnd();
        }
        
            // jumping
           
        if (jump) {
            if (this.isStandingOnFloor()) {
                this.gravity=this.getMapGravityMinValue();
                this.movement.y=this.jumpHeight;
            }
        }
        
            // figure out the movement
            // if drifting, we just continue on with
            // movement before the drift
         
        if (this.inDrift) {
            let len=this.driftMovement.lengthXZ();
            this.driftMovement.normalize();
            this.driftMovement.scale(len*this.driftDecelerationFactor);
            this.rotMovement.setFromPoint(this.driftMovement);
        }
        else {
            if (brake) {
                this.movement.moveZWithAcceleration(false,false,0,this.forwardBrakeDeceleration,this.forwardMaxSpeed,0,this.reverseBrakeDeceleration,this.reverseMaxSpeed);
            }
            else {
                if (this.isStandingOnFloor()) {
                    speed=this.forwardMaxSpeed+(10*this.starCount);
                    if (this.burstEndTimestamp!==0) {
                        if (this.burstEndTimestamp<this.getTimestamp()) {
                            this.burstEndTimestamp=0;
                        }
                        else {
                            speed+=75;
                        }
                    }
                    this.movement.moveZWithAcceleration(moveForward,moveReverse,this.forwardAcceleration,this.forwardDeceleration,speed,this.reverseAcceleration,this.reverseDeceleration,this.reverseMaxSpeed);
                }
            }

            this.rotMovement.setFromPoint(this.movement);
            this.rotMovement.rotateY(null,this.angle.y);
        }
                
            // change movement if bouncing or reflecting
            
        if ((this.bounceCount!==0) || (this.reflectCount!==0)) {
            this.rotMovement.addPoint(this.bounceReflectMovement);
        }
        
            // move around the map
        
        this.movement.y=this.moveInMapY(this.rotMovement,1.0,false);
        this.moveInMapXZ(this.rotMovement,true,true);
        
            // animations

        if (this.spinOutCount!==0) {
            this.continueAnimation(this.spinOutAnimation);
        }
        else {
            if (this.movement.z===0) {
                this.continueAnimation(this.idleAnimation);
            }
            else {
                if (this.turnCoolDown===0) {
                    this.turnCoolDown=15;
                    this.turnSmooth=turnAdd;
                }
                
                if (this.turnSmooth>0.1) {
                    this.continueAnimation(this.turnLeftAnimation);
                }
                else {
                    if (this.turnSmooth<-0.1) {
                        this.continueAnimation(this.turnRightAnimation);
                    }
                    else {
                        this.continueAnimation(this.driveAnimation);
                    }
                }
                
                if (this.turnCoolDown!==0) this.turnCoolDown--;
            }
        }
       
            // bounce and reflects
        
        if (this.bounceCount!==0) {
            this.bounceCount--;
        }
        else {
            if ((this.collideWallMeshIdx!==-1) || (this.slideWallMeshIdx!==-1)) this.bounceStart();
        }
        
        if (this.reflectCount!==0) {
            this.reflectCount--;
        }
        else {
            if (this.touchEntity!==null) {
                if (this.touchEntity instanceof KartBaseClass) this.reflectStart(this.touchEntity);
            }   
        }
        
            // smoke if drifting, spinning out, bursting, or turning
            // without moving
            
        if ((this.inDrift) || (this.spinOutCount!==0) || ((turnAdd!==0) && (this.movement.z===0))) {
            if (this.smokeCoolDownCount===0) {
                this.smokeCoolDownCount=2;
                this.createSmoke(135);
                this.createSmoke(225);
            }
            else {
                this.smokeCoolDownCount--;
            }
        }
        
            // burst if bursting
            
        if (this.burstEndTimestamp!==0) {
            if (this.burstCoolDownCount===0) {
                this.burstCoolDownCount=1;
                this.createBurst(135);
                this.createBurst(225);
            }
            else {
                this.burstCoolDownCount--;
            }
        }
        
            // update the sound
        
        rate=0.5+(((Math.abs(this.movement.z)/this.forwardMaxSpeed)*0.8)+this.engineSoundRateAirIncrease);
        if (this.isStandingOnFloor()) {
            if (this.engineSoundRateAirIncrease>=0) {
                this.engineSoundRateAirIncrease-=0.01;
                if (this.engineSoundRateAirIncrease<0) this.engineSoundRateAirIncrease=0;
            }
        }
        else {
            if (this.engineSoundRateAirIncrease<=this.engineSoundRateAirIncrease) {
                this.engineSoundRateAirIncrease+=0.01;
                if (this.engineSoundRateAirIncrease>0.2) this.engineSoundRateAirIncrease=0.2;
            }
        }
        
        this.changeSoundRate(this.engineSoundPlayIdx,rate);
    }
    
        //
        // calculate kart place
        //

    calculatePlaces()
    {
        let n,entity,spliceIdx;
        let entities=this.getEntityList();
        let placeList=[];

            // this is a bit complicated -- the path of travel
            // allows us to create a "pass line" for each node which
            // when then collide with the same path of travel from the
            // center of each kart.  all of that together gives
            // use the kart place
            
        for (entity of entities) {
            if (!(entity instanceof KartBaseClass)) continue;
            
                // get distance to next travelToPoint
                // and node we are traveling to
                // we do a special check for goal node, because that's
                // the loop node and move it to endNodeIdx+1
                
            entity.placeNodeDistance=entity.position.distance(entity.travelToPoint);
            entity.placeNodeIdx=(entity.travelToNodeIdx===this.goalNodeIdx)?(this.endNodeIdx+1):entity.travelToNodeIdx;

                // sort it
                
            spliceIdx=-1;
            
            for (n=0;n!=placeList.length;n++) {
                if (entity.lap<placeList[n].lap) {
                    spliceIdx=n;
                    break;
                }
                if (entity.lap===placeList[n].lap) {
                    if (entity.placeNodeIdx===placeList[n].placeNodeIdx) {
                        if (entity.placeNodeDistance>placeList[n].placeNodeDistance) {
                            spliceIdx=n;
                            break;
                        }
                    }
                    if (entity.placeNodeIdx<placeList[n].placeNodeIdx) {
                        spliceIdx=n;
                        break;
                    }
                }
            }
            
            if (spliceIdx===-1) {
                placeList.push(entity);
            }
            else {
                placeList.splice(spliceIdx,0,entity);
            }
        }
        
            // now set the place
            
        for (n=0;n!=placeList.length;n++) {
            placeList[n].place=((placeList.length-1)-n);
        }
    }
        
        //
        // drawing
        //

    drawSetup()
    {
        let speed;
        let timestamp=this.getTimestamp();
        
            // physics are guarenteed to be run 60fps, but
            // drawing could be slower so only do the rigid body stuff here
        
            // create the rigid body goto angle
            // the regular angle is slowly transformed to reflect this
            
        if (!this.isStandingOnFloor()) {
            this.rigidGotoAngle.x=0;
            this.rigidGotoAngle.z=0;
        }
        else {
            this.getRigidBodyAngle(this.rigidAngle,3000,25);

                // go towards the larger angle of the X/Z
                // and then reduce the other angle in half
            
            if (Math.abs(this.rigidAngle.x)>Math.abs(this.rigidAngle.z)) {
                this.rigidGotoAngle.x=this.rigidAngle.x;
                this.rigidGotoAngle.z*=0.5;
            }
            else {
                this.rigidGotoAngle.x*=0.5;
                this.rigidGotoAngle.z=this.rigidAngle.z;
            }
        }
        
            // transform the rigid body into the
            // actual draw angles, depending on how
            // much time has passed
            
        speed=(timestamp-this.lastDrawTick)*0.025;
        this.lastDrawTick=timestamp;
        
        this.angle.turnXTowards(this.rigidGotoAngle.x,speed);
        this.angle.turnZTowards(this.rigidGotoAngle.z,speed);
        
            // the drawing angle
            
        this.drawAngle.setFromPoint(this.angle);
        if (this.spinOutCount!==0) this.drawAngle.y+=this.spinOutCount;
            
            // and finally just call the regular draw position
            // stuff
            
        this.setModelDrawAttributes(this.position,this.drawAngle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}
