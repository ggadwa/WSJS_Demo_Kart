import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class PickupBurstClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.passThrough=true;           // can pass through
        
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
            
        this.touchEntity.addBurst(75,2500);
        
        this.show=false;
        this.reappearTick=this.core.game.timestamp+2000;
        
        this.touchEntity.playSound(this.pickupSound);
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

