import PointClass from '../../../code/utility/point.js';
import LineClass from '../../../code/utility/line.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';
import KartBaseClass from './entity_kart_base.js';

//
// kart player module
//

export default class KartPlayerClass extends KartBaseClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.isPlayer=true;
        
            // model
        
        this.modelName='retro_car_blue';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XZY;
        this.scale.setFromValues(5000,5000,5000);
        this.radius=5000;
        this.height=5000;
        this.eyeOffset=3000;
        this.weight=data.weight;
        this.modelHideMeshes=[];

            // variables

        this.raceFinished=false;
        this.fasterMusic=false;
        
        Object.seal(this);
    }
    
    release()
    {
        super.release();
    }
    
        //
        // ready
        //
        
    ready()
    {
        super.ready();
        
        this.cameraGotoThirdPerson(30000,new PointClass(-20,180,0));
        
        this.raceFinished=false;     // this triggers kart to start running automatically after win/loss
        this.pathSetup();           // player karts run path in background to check place, lap, etc
    }
        
        //
        // run kart player
        //
    
    run()
    {
        let x,speed,turnAdd,ang,fire;
        let forward,reverse,drifting,brake,jump;
        let textLap;
        let setup=this.getSetup();
        
        super.run();
        
            // player freeze
            
        if (this.inFreezePlayer()) return;
        
            // we run the path for the player, just
            // let the player control the turns, this
            // allows us to check laps and crossings
            
        this.pathRun();
        
            // are we running automatically (we already won/lost)
            
        if (this.raceFinished) {
            turnAdd=this.angle.getTurnYTowards(this.position.angleYTo(this.travelToPoint));
            ang=Math.abs(turnAdd);
            
            this.moveKart(turnAdd,true,false,(ang>=60),(ang>=90),false,false);
            return;
        }
        
            // if we've gone into the final lap, then
            // raise the music rate
            
        if ((this.lap===2) && (!this.fasterMusic)) {
            this.fasterMusic=true;
            this.musicSetRate(1.05);
        }
        
            // keys
            
        forward=this.isKeyDown('w');
        reverse=this.isKeyDown('s');
        drifting=(this.isKeyDown('a')||this.isKeyDown('d'));
        brake=this.isKeyDown('q');
        jump=this.isKeyDown(' ')||this.isTouchStickLeftClick();
        
            // turning
            
        turnAdd=0;

        x=this.getMouseMoveX();
        if (x!==0) {
            turnAdd=-(x*setup.mouseXSensitivity);
            turnAdd+=(turnAdd*setup.mouseXAcceleration);
            if (setup.mouseXInvert) turnAdd=-turnAdd;
        }
        
        if (this.hasTouch()) {
            if (!this.isTouchStickRightOn()) {
                brake=true;
                forward=false;
            }
            else {
                forward=true;
                turnAdd-=this.getTouchStickRightX();
            }
        }
        
            // run the kart
        
        fire=this.isMouseButtonDown(0)||this.isTouchStickRightDown();  
        this.moveKart(turnAdd,forward,reverse,drifting,brake,fire,jump);
        
            // calculate place
            
        this.calculatePlaces();
        
            // update the place/lap
            
        textLap=(this.lap===-1)?1:(this.lap+1);
            
        this.updateText('place',(this.place+1));
        this.updateText('lap',(textLap+'/3'));
        
        if ((this.place!==this.previousPlace) || (this.lap!==this.previousLap)) {
            if ((this.previousPlace!==-1) && (this.previousLap!==-1)) this.pulseElement('lap_background',500,10);
            this.previousPlace=this.place;
            this.previousLap=this.lap;
        }
            
        this.setCount('stars',this.starCount);
        
        speed=this.rotMovement.lengthXZ()/2000;
        if (speed<0) speed=0;
        if (speed>2000) speed=2000;
        this.setDial('speed',speed);
        
            // win or lose
            
        if (this.lap===3) {
            
                // trigger the win/loss
                
            if (this.place===0) {
                this.startSequence('won');
            }
            else {
                this.startSequence('lost');
            }
            
                // start running automatically
            
            this.raceFinished=true;
        }
    }
}
