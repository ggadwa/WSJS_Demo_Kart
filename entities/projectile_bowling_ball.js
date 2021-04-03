import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class ProjectileBowlingBallClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
            
        this.modelName='bowling_ball';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(2000,2000,2000);
        this.radius=1000;
        this.height=1000;
        this.eyeOffset=0;
        this.weight=100;
        this.modelHideMeshes=[];

            // physics
            
        this.maxBumpCount=0;
        this.floorRiseHeight=8000;
        this.collisionSpokeCount=24;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

            // variables
            
        this.lifeTimestamp=0;
        this.stopped=false;
        
        this.nextTrailTick=0;
        
        this.reflectSound={"name":"crash","rate":1.5,"randomRateAdd":0.3,"distance":100000,"loopStart":0,"loopEnd":0,"loop":false};
        
            // pre-allocations

        this.motion=new PointClass(0,0,0);
        this.trackMotion=new PointClass(0,0,0);
        this.combinedMotion=new PointClass(0,0,0);
        this.savePoint=new PointClass(0,0,0);
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.lifeTimestamp=this.core.game.timestamp+4000;
        this.stopped=false;
        
        this.motion.setFromValues(0,0,2200);
        this.motion.rotate(this.angle);
        
        this.trackMotion.setFromValues(0,0,0);
        
        this.nextTrailTick=this.core.game.timestamp;
    }
    
    finish()
    {
            // remove it
            
        this.markDelete=true;
        
            // the blue ball effect
            
        this.addEffect(this.spawnedBy,'blue_ball',this.position,null,true);
    }
        
    run()
    {
        let trackEntity;
        
        super.run();
        
            // are we over our life time
 
        if (this.core.game.timestamp>this.lifeTimestamp) {
            this.finish();
            return;
        }
        
            // trails

        if (this.core.game.timestamp>=this.nextTrailTick) {
            this.nextTrailTick+=20;
            this.addEffect(this,'exhaust',this.position,null,true);
        }
        
            // tracking
            
        this.trackMotion.setFromValues(0,0,0);

        trackEntity=this.findClosestWithMaxAngle(this.position,this.angle,'kart_',this.spawnedBy,60);
        if (trackEntity!==null) {
            this.trackMotion.x=Math.sign(trackEntity.position.x-this.position.x)*50;
            this.trackMotion.y=0;       // follows the floor
            this.trackMotion.z=Math.sign(trackEntity.position.z-this.position.z)*50;
        }
        
            // move projectile
            
        this.savePoint.setFromPoint(this.position);
        
        this.combinedMotion.setFromAddPoint(this.motion,this.trackMotion);
        
        if (!this.stopped) this.moveInMapXZ(this.combinedMotion,false,false);
        this.motion.y=this.moveInMapY(this.combinedMotion,1.0,false);

            // don't track hitting floor, it can follow the floor
        
            // hitting ceiling, explode
            
        if (this.collideCeilingMeshIdx!==-1) {
            this.finish();
            return;
        }

            // hitting wall, reflect off

        if (this.collideWallMeshIdx!==-1) {
            this.playSound(this.reflectSound);
            
            this.position.setFromPoint(this.savePoint);
            
            this.wallReflect(this.motion);
            this.motion.scaleXZ(0.95);
            this.motion.trunc();

            if ((Math.abs(this.motion.x)+Math.abs(this.motion.z))<1) {
                this.motion.x=0;
                this.motion.z=0;
                this.finish();
            }
            
            return;
        }
        
            // touching object, explode
            
        if (this.touchEntity!==null) {
            if (this.touchEntity.passThrough) return;
            
            this.finish();
            return;
        }
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

