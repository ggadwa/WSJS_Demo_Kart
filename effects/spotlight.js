import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class SpotlightClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=-1;
        
        this.addBillboard('textures/particle_glow.png',this.DRAW_MODE_ADDITIVE)
                .addBillboardFrame(0,25000,25000,0,new ColorClass(1.0,1.0,1.0),0.75)
                .addBillboardFrame(10000,28000,28000,180,new ColorClass(1.0,1.0,1.0),0.7)
                .addBillboardFrame(20000,25000,25000,360,new ColorClass(1.0,1.0,1.0),0.75);
    }

}
