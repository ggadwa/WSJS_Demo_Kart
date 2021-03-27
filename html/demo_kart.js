import ProjectClass from '../../../code/main/project.js';
import PickupBowlingBallClass from '../entities/pickup_bowling_ball.js';
import WeaponBowlingBallClass from '../entities/weapon_bowling_ball.js';
import ProjectileBowlingBallClass from '../entities/projectile_bowling_ball.js';

export default class DemoClass extends ProjectClass
{
    mapCube(name)
    {
        return(null);
    }

    mapEffect(name)
    {
        return(null);
    }

    mapEntity(name)
    {
        switch (name) {
            case 'pickup_bowling_ball':
                return(PickupBowlingBallClass);
            case 'weapon_bowling_ball':
                return(WeaponBowlingBallClass);
            case 'projectile_bowling_ball':
                return(ProjectileBowlingBallClass);
        }

        return(null);
    }
}
