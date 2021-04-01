import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class TireSmokeClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=500;
        
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

    }

}
