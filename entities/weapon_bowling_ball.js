import PointClass from '../../../code/utility/point.js';
import BoundClass from '../../../code/utility/bound.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class WeaponBowlingBallClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.ammoCount=0;
        
        this.fireSound=new SoundDefClass('bowling_ball_fire',1.0,0,10000,0,0,false);
        
        this.lastFireTimestamp=0;
            
            // pre-allocates
        
        this.firePoint=new PointClass(0,0,0);
        this.fireAng=new PointClass(0,0,0);
    }

    ready()
    {
        super.ready();
        
        this.ammoCount=0;
        this.lastFireTimestamp=0;
    }
    
        //
        // ammo
        //
        
    addAmmo(count)
    {
        this.ammoCount+=count;
        if (this.ammoCount>3) this.ammoCount=3;
    }

    
        //
        // firing
        //
        
    fire(firePosition,fireAngle)
    {
        let projEntity;
        let parentEntity=this.heldBy;
        let timestamp=this.getTimestamp();
        
        if (this.ammoCount===0) return(false);
            
        if ((this.lastFireTimestamp+1000)>timestamp) return(false);
        this.lastFireTimestamp=timestamp;
        
            // ammo
            
        this.ammoCount--;
       
            // fire position
            
        this.firePoint.setFromValues(0,1000,6000);
        
        this.fireAng.setFromPoint(fireAngle);
        this.firePoint.rotateY(null,this.fireAng.y);
        
        this.firePoint.addPoint(firePosition);
        
            // spawn from whatever is holding this weapon

        projEntity=this.addEntity('projectile_bowling_ball','projectile_bowling_ball',this.firePoint,this.fireAng,null,parentEntity,null,true);
        if (projEntity!==null) projEntity.ready();
        
            // fire sound
            
        this.playSoundAtPosition(firePosition,this.fireSound);

        return(true);
    }
    
        //
        // main run
        //
        
    run()
    {
        super.run();
        
            // update any UI if player
            
        if (this.heldBy===this.getPlayer()) {
            this.setCount('bowling_balls',this.ammoCount);
        }
    }
        
    drawSetup()
    {
        return(false);
    }

}
