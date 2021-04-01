import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class ExhaustClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1000;
        
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_blob.png","mode":"additive","grid":"4","gridPeriod":500,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"width":8000,"height":8000,"rotate":0,"color":{"r":1,"g":0,"b":0},"alpha":0.3},
                            {"tick":250,"width":6500,"height":6500,"rotate":90,"color":{"r":1,"g":0.3,"b":0},"alpha":0.6},
                            {"tick":500,"width":3500,"height":3500,"rotate":180,"color":{"r":1,"g":0.2,"b":0},"alpha":0.7},
                            {"tick":750,"width":1500,"height":1500,"rotate":270,"color":{"r":1,"g":0.3,"b":0},"alpha":0.6},
                            {"tick":1000,"width":100,"height":100,"rotate":360,"color":{"r":1,"g":0.0,"b":0},"alpha":0.3}
                        ]
                }
            ];

    }

}
