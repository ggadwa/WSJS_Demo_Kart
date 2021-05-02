import ProjectClass from '../../../code/main/project.js';
import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
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
    initialize()
    {
        super.initialize();
        
            // project effects
            
        this.addEffectClass('blue_ball',BlueBallClass);
        this.addEffectClass('exhaust',ExhaustClass);
        this.addEffectClass('spotlight',SpotlightClass);
        this.addEffectClass('tire_smoke',TireSmokeClass);
        
            // project entities
    
        this.addEntityClass('kart_player',KartPlayerClass);
        this.addEntityClass('kart_bot',KartBotClass);
        this.addEntityClass('pickup_bowling_ball',PickupBowlingBallClass);
        this.addEntityClass('pickup_star',PickupStarClass);
        this.addEntityClass('pickup_burst',PickupBurstClass);
        this.addEntityClass('weapon_bowling_ball',WeaponBowlingBallClass);
        this.addEntityClass('projectile_bowling_ball',ProjectileBowlingBallClass);
        
            // models
            
        this.addCommonModel('retro_car_blue');
        this.addCommonModel('retro_car_red');
        this.addCommonModel('bowling_ball');
        this.addCommonModel('rocket');
        this.addCommonModel('star');
        
            // bitmaps
            
        this.addCommonBitmap('textures/particle_smoke.png');
        this.addCommonBitmap('textures/particle_blob.png');
        this.addCommonBitmap('textures/paint_stroke.png');
        this.addCommonBitmap('textures/particle_glow.png');
        
           // sounds
           
        this.addCommonSound('bowling_ball_fire');
        this.addCommonSound('burst');
        this.addCommonSound('crash');
        this.addCommonSound('engine');
        this.addCommonSound('explosion');
        this.addCommonSound('pickup');
        this.addCommonSound('skid');
        this.addCommonSound('start_tone');
        
            // sequences
            
        this.addSequence('ready_set_go');
        this.addSequence('won');
        this.addSequence('lost');
        
            // interface
            
        this.addInterfaceText('place','',this.POSITION_TOP_LEFT,new PointClass(70,100,0),80,this.TEXT_ALIGN_CENTER,new ColorClass(1.0,1.0,0.0),1.0,true);
        this.addInterfaceText('lap','',this.POSITION_TOP_LEFT,new PointClass(70,120,0),30,this.TEXT_ALIGN_CENTER,new ColorClass(1.0,1.0,0.0),1.0,true);
        
        this.addInterfaceElement('lap_background','textures/lap_background.png',128,128,this.POSITION_TOP_LEFT,new PointClass(5,5,0),new ColorClass(1.0,1.0,1.0),0.5,true);
        
        this.addInterfaceCount('stars','textures/star.png',10,32,32,this.POSITION_TOP_LEFT,new PointClass(130,5,0),new PointClass(32,0,0),new ColorClass(1.0,1.0,1.0),1.0,new ColorClass(0.8,0.8,0.8),0.7,true);
        this.addInterfaceCount('bowling_balls','textures/bowling_ball.png',3,32,32,this.POSITION_TOP_LEFT,new PointClass(130,40,0),new PointClass(32,0,0),new ColorClass(1.0,1.0,1.0),1.0,new ColorClass(1.0,1.0,1.0),0.0,true);
        
        this.addInterfaceDial('speed','textures/speed_background.png','textures/speed_foreground.png','textures/speed_needle.png',256,256,this.POSITION_BOTTOM_RIGHT,new PointClass(-256,-256,0),true);
        
            // title setup
            
        this.setTitleConfig('Arial','click','select');
        this.setTitleMenu(80,82,new ColorClass(0.0,1.0,0.0),new ColorClass(1.0,1.0,0.0),this.MENU_X_ALIGN_CENTER,this.MENU_Y_ALIGN_CENTER);
        this.setTitlePlayButton('Race',true);
        this.setTitleMultiplayerButton('',false);
        this.setTitleSetupButton('Setup',true);
        this.setTitleQuitButton('Quit',true);
    }

        //
        // overrides
        //
    
    mapStartup(mapName)
    {
        this.buildPerpendicularLineForLoop('goal','end',100000);     // enough to reach edge of road/area
        this.startSequence('ready_set_go');
    }
}
