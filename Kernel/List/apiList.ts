export class apiList{

   x: number;
   y: number;
   value: number;
   dates: String;
   day: String;
   times:String;

  constructor(x:number,y:number,value:number,day:String,dates:String,times:String){
    this.x=x;
    this.y=y;
    this.dates=dates;
    this.value=value;
    this.times=times;
    this.day=day;
  }

  public tojson():string {
    return '{"x":"'+this.x+'","y":"'+this.y+'","value":"'+this.value+'","dates":"'+this.dates+'","day":"'+this.day+'","times":"'+this.times+'"}';

  }
}
