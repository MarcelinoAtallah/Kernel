export class BugNameList{
  
    id: number;
    bugName:string;
    url:string;
    property : any;

    constructor(id: number,bugName:string,url : string,property :any){
       this.id=id;
       this.bugName=bugName;
       this.url=url;
       this.property=property;

    }
}