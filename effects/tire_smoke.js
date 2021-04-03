import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class TireSmokeClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=500;
        
        this.addBillboard('textures/particle_smoke.png',this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,100,0)
                .addBillboardFrame(0,2000,2000,0,new ColorClass(1.0,1.0,1.0),0.6)
                .addBillboardFrame(400,8000,8000,180,new ColorClass(1.0,1.0,1.0),0.4)
                .addBillboardFrame(500,100,100,100,new ColorClass(1.0,1.0,1.0),0.1);
    }

}
