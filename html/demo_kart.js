import ProjectClass from '../../../code/main/project.js';
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
        return(null);
    }

    mapEntity(mapName,entityName)
    {
        switch (entityName) {
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
