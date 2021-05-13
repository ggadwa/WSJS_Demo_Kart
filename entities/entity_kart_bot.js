import PointClass from '../../../code/utility/point.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import KartBaseClass from './entity_kart_base.js';

//
// kart bot module
//

export default class KartBotClass extends KartBaseClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
        
        this.modelName='retro_car_red';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XZY;
        this.scale.setFromValues(5000,5000,5000);
        this.radius=5000;
        this.height=5000;
        this.eyeOffset=3000;
        this.weight=data.weight;
        this.modelHideMeshes=[];

            // variables
            
        this.currentTargetYScan=0;
        this.nextFireTick=0;
        
            // pre-allocates
            
        this.lookPoint=new PointClass(0,0,0);
        this.lookVector=new PointClass(0,0,0);
        this.lookHitPoint=new PointClass(0,0,0);
        
        Object.seal(this);
    }
    
        //
        // ready
        //
        
    ready()
    {
        super.ready();
        
            // setup the path
            
        this.pathSetup();
        
            // start scanning in middle
            
        this.currentTargetYScan=Math.trunc(15);
        
            // can fire at any time
            
        this.nextFireTick=this.getTimestamp();
    }
    
        //
        // find monster to fire at
        //
        
    checkFire()
    {
        let timestamp=this.getTimestamp();
        
            // is it time to fire?
        
        if (timestamp<this.nextFireTick) return(false);
        
            // ray trace for entities
            // we do one look angle per tick
            
        this.lookPoint.setFromPoint(this.position);
        this.lookPoint.y+=this.eyeOffset;
        
        this.lookVector.setFromValues(0,0,60000);
        this.lookVector.rotateY(null,(this.angle.y+(this.currentTargetYScan-15)));
        
        this.currentTargetYScan++;
        if (this.currentTargetYScan>=30) this.currentTargetYScan=0;
        
        if (!this.rayCollision(this.lookPoint,this.lookVector,this.lookHitPoint)) return(false);
        
            // have we hit a kart entity, and right distance to fire?
            
        if (this.hitEntity===null) return(false);
        if (!(this.hitEntity instanceof KartBaseClass)) return(false);
        if (this.hitEntity.position.distance(this.position)<15000) return(false);
        
        this.nextFireTick=timestamp+5000;        // can only fire 5 seconds after previous fire
        return(true);
    }
    
        //
        // run bot kart
        //
        
    run()
    {
        let turnAdd,ang,drifting,brake;
        let entity;
        
            // run the kart base
        
        super.run();

            // skip if AI is frozen
            
        if (this.inFreezeAI()) return;
        
            // run the path
            
        this.pathRun();
        
            // turn towards the position
            // unless we are spinning, don't turn
            // then as it falls off the path
        
        if (this.spinOutCount===0) {
            turnAdd=this.angle.getTurnYTowards(this.position.angleYTo(this.travelToPoint));
        }
        else {
            turnAdd=0;
        }
        
            // if there is a star, or bowling ball,
            // or finally a burst, head towards that
            
        if ((this.bounceCount===0) && (this.reflectCount===0) && (this.spinOutCount===0)) {
            entity=this.findClosestWithMaxAngle(this.position,this.angle,'pickup_star',null,30,80000);
            if (entity!==null) {
                turnAdd=this.angleYToEntity(entity)-this.angle.y;
            }
            else {
                entity=this.findClosestWithMaxAngle(this.position,this.angle,'pickup_bowling',null,30,80000);
                if (entity!==null) {
                    turnAdd=this.angleYToEntity(entity)-this.angle.y;
                }
                else {
                    entity=this.findClosestWithMaxAngle(this.position,this.angle,'pickup_burst',null,30,80000);
                    if (entity!==null) {
                        turnAdd=this.angleYToEntity(entity)-this.angle.y;
                    }
                } 
            }
        }
        
            // and figure out if we need to drift or break
        
        ang=Math.abs(turnAdd);
        brake=(ang>=90.0);
        drifting=brake?false:(ang>60.0);
        
            // run the kart
            
        this.moveKart(turnAdd,true,false,drifting,brake,this.checkFire(),false);
    }
}

