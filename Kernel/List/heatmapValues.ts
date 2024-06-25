export class heatmapValues{


  x: number;
   y: number;
   value: number;


 constructor(x:number,y:number,value:number){

  this.x=x;
  this.y=y;
  this.value=value;

 }

 public tojson():string {
  return '{"x":"'+this.x+'","y":"'+this.y+'","value":"'+this.value+'"}';

}
}
