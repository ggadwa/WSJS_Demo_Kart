import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class PickupBowlingBallClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.passThrough=true;           // can pass through
        
            // model
        
        this.modelName='bowling_ball';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(2000,2000,2000);
        this.radius=2000;
        this.height=2000;
        this.eyeOffset=0;
        this.weight=100;
        this.modelHideMeshes=[];
        
            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=8;
        this.collisionHeightSegmentCount=2;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

            // variables
        
        this.originalY=0;
        this.reappearTick=0;
        
        this.pickupSound=new SoundDefClass('pickup',1.0,0.0,50000,0,0,false);
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.reappearTick=0;
        this.originalY=this.position.y;
    }
    
    run()
    {
        let timestamp=this.getTimestamp();
        
        super.run();
        
            // if hidden, count down to show
            
        if (!this.show) {
            if (timestamp<this.reappearTick) return;

            this.touchEntity=null;          // clear any touches
            this.show=true;
        }
        
            // animation

        this.position.y=this.originalY+this.getPeriodicCos(5000,200);
        this.angle.y=this.getPeriodicLinear(5000,360);
        
            // check for collisions from
            // entities that have the bowling ball weapon
            
        if (this.touchEntity===null) return;
        if (this.touchEntity.bowlingBallWeapon===undefined) return;
        
            // pickup and add ammo
            
        this.touchEntity.bowlingBallWeapon.addAmmo(1);
            
        this.show=false;
        this.reappearTick=timestamp+2000;
        
        this.touchEntity.playSound(this.pickupSound);
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

