import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class BlueBallClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1500;
        
        this.light=
            {
                "frames":
                    [
                        {"tick":0,"color":{"r":0,"g":0,"b":1},"intensity":1,"exponent":1},
                        {"tick":400,"color":{"r":0,"g":0,"b":0.9},"intensity":75000,"exponent":5},
                        {"tick":1100,"color":{"r":0,"g":0,"b":0.7},"intensity":75000,"exponent":5},
                        {"tick":1200,"color":{"r":0,"g":0,"b":0.3},"intensity":1,"exponent":10},
                        {"tick":3000,"color":{"r":0,"g":0,"b":0},"intensity":1,"exponent":1}
                    ]
            };
        
        this.particles=
            [
                {
                    "bitmap":"textures/particle_smoke.png","mode":"transparent","count":60,"motion":{"x":100000,"y":300,"z":100000},"grid":"4","gridPeriod":600,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"spread":0.1,"width":500,"height":500,"rotate":0,"color":{"r":1,"g":1,"b":1},"alpha":0.1},
                            {"tick":250,"spread":1.0,"width":15000,"height":15000,"rotate":180,"color":{"r":1,"g":1,"b":1},"alpha":1.0},
                            {"tick":1500,"spread":1.0,"width":25000,"height":25000,"rotate":220,"color":{"r":0.7,"g":0.7,"b":0.7},"alpha":0.1}
                        ]
                },
                {
                    "bitmap":"textures/particle_blob.png","mode":"transparent","count":100,"motion":{"x":90000,"y":90000,"z":90000},"grid":"4","gridPeriod":300,"gridOffset":0,
                    "frames":
                        [
                            {"tick":0,"spread":0.1,"width":10,"height":10,"rotate":0,"color":{"r":0.1,"g":0,"b":1},"alpha":0.1},
                            {"tick":300,"spread":1.0,"width":8000,"height":8000,"rotate":180,"color":{"r":0.3,"g":0,"b":1},"alpha":0.4},
                            {"tick":1500,"spread":0.1,"width":1000,"height":1000,"rotate":270,"color":{"r":0.5,"g":0,"b":1},"alpha":0.0}
                        ]
                }
            ];
            
        this.globes=
            [
                {
                    "bitmap":"textures/paint_stroke.png","mode":"transparent",
                    "frames":
                        [
                            {"tick":0,"radius":10,"uAdd":0,"zAdd":0,"color":{"r":0.3,"g":0.3,"b":1},"alpha":0.1},
                            {"tick":250,"radius":100000,"uAdd":1,"zAdd":0,"color":{"r":0,"g":0,"b":1},"alpha":0.4},
                            {"tick":1500,"radius":10,"uAdd":1.5,"zAdd":0,"color":{"r":0.3,"g":0.3,"b":1},"alpha":0.0}
                        ]
                }
            ];
        
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
