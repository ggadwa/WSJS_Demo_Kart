import PointClass from '../../../code/utility/point.js';
import KartBaseClass from './entity_kart_base.js';

//
// kart player module
//

export default class KartPlayerClass extends KartBaseClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
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

        this.runningPath=false;
        
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
        
        this.runningPath=false;     // this triggers kart to start running a path after win/loss
        this.trackOffsetSetup();    // setup for running the track when ai takes over
        
        this.cameraGotoThirdPerson(30000,new PointClass(-20,180,0));
    }
        
        //
        // run kart player
        //
    
    run()
    {
        let x,speed,turnAdd,ang,fire;
        let forward,reverse,drifting,brake,jump;
        let textLap;
        let setup=this.core.setup;
        
        super.run();
        
            // player freeze
            
        if (this.core.game.freezePlayer) return;
        
            // are we running a path (we already won/lost)
            
        if (this.runningPath)
        {
            this.pathRun();
        
            turnAdd=this.angle.getTurnYTowards(this.position.angleYTo(this.gotoPosition));
            ang=Math.abs(turnAdd);
            
            this.moveKart(turnAdd,true,false,(ang>=60),(ang>=90),false,false);
            return;
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
            
        if (textLap===4) {
            
                // trigger the win/loss
                
            if (this.place===0) {
                this.core.game.won(this);
            }
            else {
                this.core.game.lost(this);
            }
            
                // start pathing like a bot
            
            this.runningPath=true;    
            this.pathSetup(2);
        }
    }
}
