import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class TireSmokeClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=500;
        
        this.addBillboard("textures/particle_smoke.png",this.DRAW_MODE_TRANSPARENT)
                .setGrid(4,100,0)
                .addBillboardFrame(0,2000,2000,0,new ColorClass(1.0,1.0,1.0),0.6)
                .addBillboardFrame(400,8000,8000,180,new ColorClass(1.0,1.0,1.0),0.4)
                .addBillboardFrame(500,100,100,100,new ColorClass(1.0,1.0,1.0),0.1);
        /*
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_smoke.png","mode":"transparent","grid":"4","gridPeriod":100,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"width":2000,"height":2000,"rotate":0,"color":{"r":1,"g":1,"b":1},"alpha":0.6},
                            {"tick":400,"width":8000,"height":8000,"rotate":180,"color":{"r":1,"g":1,"b":1},"alpha":0.4},
                            {"tick":500,"width":100,"height":100,"rotate":100,"color":{"r":1,"g":1,"b":1},"alpha":0.1}
                        ]
                }
            ];
*/
    }

}
