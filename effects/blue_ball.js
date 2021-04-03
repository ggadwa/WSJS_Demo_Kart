import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class BlueBallClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1500;
        
        this.addLight()
                .addLightFrame(0,new ColorClass(0.0,0.0,1.0),1,1)
                .addLightFrame(400,new ColorClass(0.0,0.0,0.9),75000,5)
                .addLightFrame(1100,new ColorClass(0.0,0.0,0.7),75000,5)
                .addLightFrame(1200,new ColorClass(0.0,0.0,0.3),1,10)
                .addLightFrame(1500,new ColorClass(0.0,0.0,0.0),1,1);
            
        this.addParticle('textures/particle_smoke.png',this.DRAW_MODE_TRANSPARENT,60,new PointClass(100000,300,100000))
                .setGrid(4,600,0)
                .addParticleFrame(0,0.1,500,500,0,new ColorClass(1.0,1.0,1.0),0.1)
                .addParticleFrame(250,1.0,15000,15000,180,new ColorClass(1.0,1.0,1.0),1.0)
                .addParticleFrame(1500,1.0,25000,25000,220,new ColorClass(0.7,0.7,0.7),0.1);
        
        this.addParticle('textures/particle_blob.png',this.DRAW_MODE_TRANSPARENT,100,new PointClass(85000,80000,85000))
                .setGrid(4,100,0)
                .addParticleFrame(0,0.1,10,10,0,new ColorClass(0.0,0.0,1.0),0.1)
                .addParticleFrame(300,1.0,6000,6000,180,new ColorClass(0.2,0.0,1.0),0.4)
                .addParticleFrame(1300,0.7,5000,5000,270,new ColorClass(0.4,0.0,1.0),0.5)
                .addParticleFrame(1500,0.1,100,100,360,new ColorClass(3.0,0.0,1.0),0.1);
        
        this.addGlobe('textures/paint_stroke.png',this.DRAW_MODE_TRANSPARENT)
                .addGlobeFrame(0,10,0.0,0,new ColorClass(0.3,0.3,1.0),0.1)
                .addGlobeFrame(250,100000,1.0,0,new ColorClass(0.0,0.0,1.0),0.4)
                .addGlobeFrame(1300,1000,1.0,0,new ColorClass(0.1,0.1,1.0),0.3)
                .addGlobeFrame(1500,10,1.5,0,new ColorClass(0.3,0.3,1.0),0.0);

        this.startSound={"name":"explosion","rate":1.0,"randomRateAdd":-0.4,"distance":100000,"loopStart":0,"loopEnd":0,"loop":false};
    }
    
    initialize()
    {
        if (!super.initialize()) return(false);
        
        this.playSound(this.startSound);
        this.shakeCamera(100000,40,2000);
        this.damageForRadius(60000,1);
        
        return(true);
    }

}
