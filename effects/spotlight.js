import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class SpotlightClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=-1;
        
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_glow.png","mode":"additive",
                    "frames":
                        [
                            {"tick":0,"width":25000,"height":25000,"rotate":0,"color":{"r":1,"g":1,"b":1},"alpha":0.75},
                            {"tick":10000,"width":28000,"height":28000,"rotate":180,"color":{"r":1,"g":1,"b":1},"alpha":0.7},
                            {"tick":20000,"width":25000,"height":25000,"rotate":360,"color":{"r":1,"g":1,"b":1},"alpha":0.75}
                        ]
                }
            ];

    }

}
