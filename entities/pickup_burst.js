import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class PickupBurstClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.passThrough=true;           // can pass through

            // model
        
        this.modelName='rocket';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(1500,1500,1500);
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
        
        this.randomPositionAdd=new PointClass(0,4000,0);
        this.randomPositionOffset=new PointClass(20000,0,20000);
        
        this.pickupSound=new SoundDefClass('pickup',1.0,0.0,50000,0,0,false);
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.setRandomPosition();
        
        this.reappearTick=0;
        this.originalY=this.position.y;
    }
    
    setRandomPosition()
    {
        let node;
        let nodes=this.core.game.map.path.nodes;
        
        node=nodes[Math.trunc(nodes.length*Math.random())];
        
        this.position.setFromPoint(node.position);
        this.position.addPoint(this.randomPositionAdd);
        
        this.position.x+=(((Math.random()*2.0)-1.0)*this.randomPositionOffset.x);
        this.position.y+=(((Math.random()*2.0)-1.0)*this.randomPositionOffset.y);
        this.position.z+=(((Math.random()*2.0)-1.0)*this.randomPositionOffset.z);
    }
    
    run()
    {
        super.run();
        
            // animation

        this.position.y=this.originalY+this.getPeriodicCos(5000,200);
        this.angle.y=this.getPeriodicLinear(5000,360);
        
            // check for collisions from
            // entities that can add burst
            
        if (this.touchEntity===null) return;
        if (this.touchEntity.addBurst===undefined) return;
        
            // pickup and add burst
            
        this.touchEntity.addBurst();
        
        this.touchEntity.playSound(this.pickupSound);
        
        this.touchEntity=null;
        this.setRandomPosition();
        this.originalY=this.position.y;     // need to reset floating position
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

