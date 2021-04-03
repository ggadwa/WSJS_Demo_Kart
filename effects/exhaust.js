import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class ExhaustClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1000;
        
        this.addBillboard('textures/particle_blob.png',this.DRAW_MODE_ADDITIVE)
                .setGrid(4,500,0)
                .addBillboardFrame(0,8000,8000,0,new ColorClass(1.0,0.0,0.0),0.3)
                .addBillboardFrame(250,6500,6500,90,new ColorClass(1.0,0.3,0.0),0.6)
                .addBillboardFrame(500,3500,3500,180,new ColorClass(1.0,0.2,0.0),0.7)
                .addBillboardFrame(750,1500,1500,270,new ColorClass(1.0,0.3,0.0),0.6)
                .addBillboardFrame(1000,100,100,360,new ColorClass(1.0,0.0,0.0),0.3);
    }

}
