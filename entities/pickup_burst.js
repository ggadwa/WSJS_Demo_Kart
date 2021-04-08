import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class PickupBurstClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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
        
        this.pickupSound={"name":"pickup","rate":1.0,"randomRateAdd":0.0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        
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
        
            // if hidden, count down to show
            
        if (!this.show) {
            if (this.core.game.timestamp<this.reappearTick) return;

            this.touchEntity=null;          // clear any touches
            this.show=true;
            
            this.setRandomPosition();
            this.originalY=this.position.y;     // need to reset floating position
        }
        
            // animation

        this.position.y=this.originalY+this.core.game.getPeriodicCos(5000,200);
        this.angle.y=this.core.game.getPeriodicLinear(5000,360);
        
            // check for collisions from
            // entities that can add burst
            
        if (this.touchEntity===null) return;
        if (this.touchEntity.addBurst===undefined) return;
        
            // pickup and add burst
            
        this.touchEntity.addBurst();
        
        //this.show=false;
        //this.reappearTick=this.core.game.timestamp+500;
        
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

