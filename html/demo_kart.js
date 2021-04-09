import ProjectClass from '../../../code/main/project.js';
import BlueBallClass from '../effects/blue_ball.js';
import ExhaustClass from '../effects/exhaust.js';
import SpotlightClass from '../effects/spotlight.js';
import TireSmokeClass from '../effects/tire_smoke.js';
import KartPlayerClass from '../entities/entity_kart_player.js';
import KartBotClass from '../entities/entity_kart_bot.js';
import PickupBowlingBallClass from '../entities/pickup_bowling_ball.js';
import PickupStarClass from '../entities/pickup_star.js';
import PickupBurstClass from '../entities/pickup_burst.js';
import WeaponBowlingBallClass from '../entities/weapon_bowling_ball.js';
import ProjectileBowlingBallClass from '../entities/projectile_bowling_ball.js';

export default class DemoClass extends ProjectClass
{
    mapModels(mapName,singlePlayer)
    {
        return(['bowling_ball','retro_car_blue','retro_car_red','rocket','star']);
    }
    
    mapBitmaps(mapName,singlePlayer)
    {
        return(['textures/particle_smoke.png','textures/particle_blob.png','textures/paint_stroke.png','textures/particle_glow.png']);
    }
    
    mapSounds(mapName,singlePlayer)
    {
        return(['bowling_ball_fire','burst','crash','engine','explosion','pickup','skid','start_tone']);
    }
    
    mapCube(mapName,cubeName)
    {
        return(null);
    }

    mapEffect(mapName,effectName)
    {
        switch (effectName) {
            case 'blue_ball':
                return(BlueBallClass);
            case 'exhaust':
                return(ExhaustClass);
            case 'spotlight':
                return(SpotlightClass);
            case 'tire_smoke':
                return(TireSmokeClass);
        }
        
        return(null);
    }

    mapEntity(mapName,entityName)
    {
        switch (entityName) {
            case 'kart_player':
                return(KartPlayerClass);
            case 'kart_bot':
                return(KartBotClass);
            case 'pickup_bowling_ball':
                return(PickupBowlingBallClass);
            case 'pickup_star':
                return(PickupStarClass);
            case 'pickup_burst':
                return(PickupBurstClass);
            case 'weapon_bowling_ball':
                return(WeaponBowlingBallClass);
            case 'projectile_bowling_ball':
                return(ProjectileBowlingBallClass);
        }

        return(null);
    }
}
