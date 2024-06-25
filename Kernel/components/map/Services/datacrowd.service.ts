import { HttpBackend, HttpClient  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';


@Injectable({
  providedIn: 'root'
})
export class DatacrowdService {

  constructor(private httpClient: HttpClient) {

   }

  ipAddress:any = GlobalConstants.ipAddress;
  ipAddressKYG:any = GlobalConstants.ipAddressKYG;
  urlCassandraServer:string=this.ipAddress;
  ipAddressDataCrowd :any =GlobalConstants.ipAddressDataCrowd;
  ip:any = GlobalConstants.ip;


 async  getdatabaseType(){
  let response =this.httpClient.get(this.ipAddress+"/api/getdatabaseType", {responseType: 'text'}).toPromise();
  return response; 
}

async inserJsonParam(obj:any){
 let response= this.httpClient.post<any>(this.ipAddress+"/api/inserJsonParam/",obj).toPromise();
 
  console.log('inserjsonparam>>>>>>',response);
 return response; 
  
}

async getproviderType(obj:any){
  let response= this.httpClient.post<any>(this.ipAddress+"/api/getproviderType",obj).toPromise();
  console.log('getproviderType>>>>>>',response);
  return response; 

}

async getallproviderType(){

  let response=  this.httpClient.post<any>(this.ipAddress+"/api/getallproviderType", {headers: GlobalConstants.headers}).toPromise();
  console.log('getallproviderType>>>>>>',response);

  return response; 
}
  


async getShapeResult(reportJsonParamId:any){

  let response=  this.httpClient.post<any>(this.ipAddress+"/api/getShapeType?reportJsonParamId="+reportJsonParamId, {headers: GlobalConstants.headers}).toPromise();
  console.log('getShapeResult>>>>>>',response);
  return response; 
}

async getTypeName(reportType:any){

  let response=  this.httpClient.post<any>(this.ipAddress+"/api/getTypeName?reportType="+reportType, {headers: GlobalConstants.headers}).toPromise();
  console.log('getShapeResult>>>>>>',response);
  return response; 
}


async fill_data_Filtering(ReportJsonParamId:any,userId:any){
  let response=  this.httpClient.get(this.ipAddress+"/api/PFILLDATAFILTERING/"+ReportJsonParamId+"/"+userId, {headers: GlobalConstants.headers}).toPromise();
  console.log('getShapeResult>>>>>>',response);
  return response; 
}

async executemapexplore2(ReportJsonParamId:any,userId:any){
  let response=  this.httpClient.get(this.ipAddress+"/api/executemapexplore2/ReportJsonParamId="+ReportJsonParamId+"/userId="+userId, {headers: GlobalConstants.headers}).toPromise();
  console.log('executemapexplore2>>>>>>',response);
  return response; 
}

async getfixedelementsObject2BTS(objectID:any,userCode:any){
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let response= this.httpClient.post(this.ipAddressDataCrowd+"/api/getfixedelementsObject2Bts/"+userCode,objectID,options).toPromise();
  
   console.log('getfixedelementsObject2Bts>>>>>>',response);
  return response; 
   
 }


 executeAOIActivity(obj:any){
  console.log(' innn  executeAOIActivity >>>>>>');

  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/executeAOIActivity',obj, {headers}).toPromise();
   console.log('executeAOIActivity >>>>>>',response);
  return response; 
   
 }
 
async getfixedelementsObject2(objectID:any){
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let response= this.httpClient.post(this.ipAddress+"/api/getfixedelementsObject2",objectID,options).toPromise();
  
   console.log('getfixedelementsObject2>>>>>>',response);
  return response; 
   
 }


async getSimulationParam(Id:any){
  let response=  this.httpClient.get<any>(this.ipAddress+"/api/getSimulationParam/"+Id, {headers: GlobalConstants.headers}).toPromise();
  console.log('getSimulationParam>>>>>>',response);
  return response; 



}


async insertSimulation(obj:any){
  let response= this.httpClient.post<any>(this.ipAddress+"/api/insertSimulation",obj).toPromise();
  console.log('insertSimulation >>>>>>',response);
  return response; 

}


async callCassandraApi(obj:any) {
     console.log("cassandrta object >>>>>",JSON.stringify(obj))
     console.log("cassandrta object  coordinate>>>>>",obj.Coordinates)
 alert("cassandra in>>>")
 let result =await this.httpClient.post<any>(this.urlCassandraServer+"/api/getAllData",JSON.stringify(obj), {headers: GlobalConstants.headers}).toPromise();
  console.log(" cassandra result >>>>>>>>>>>>>>>>>>>>>",result)
   alert("cassandra out>>>>");
 
   return result;

}


async loadFile( typeId:any, queryId:any, cnt:any) {
 // alert(typeId)
  try {
  //  alert(1)
    if (typeId != 3) {
   //   (alert(2))
      console.log("AS / DH load file >>>>>>>>>>>>>>");
   let response =await   this.httpClient.get(this.ipAddress+"/api/DHloadfile/"+queryId+"/simulation", {responseType: 'text'}).toPromise();
  return response; 
  } else {
   // alert(3)
      console.log("DTP load file >>>>>>>>>>>>>>");
 let response=await this.httpClient.get(this.ipAddress+"/api/DTPloadfile/"+queryId+"/"+cnt+"}", {responseType: 'text'}).toPromise();
      return response; 

    }
  } catch (error) {
    console.log(" failure exception ");
    console.log("Fail - Please contact valoores team");
  }
 // return null;

}


async getcoord(){
  let response= this.httpClient.get("../assets/coords/coords.json").toPromise();
  
   console.log('inserjsonparam>>>>>>',response);
  return response; 
   
 }


//  async getSimulationData(obj:any){
//   console.log('obj>>>>>>',obj);
//   // let response= this.httpClient.post<any>(this.ipAddressDataCrowd+"/api/getSimulationData/",obj).toPromise();
//   let response= this.httpClient.post<any>(`${this.ipAddressDataCrowd}/api/getSimulationData/`, obj).toPromise();

//    console.log('getSimulationData>>>>>> 4440',response);
//   return response; 
   
//  }



// async getSimulationData(obj: any) {
//   let response= await this.httpClient.post<any>(`${this.ipAddressDataCrowd}/api/getSimulationData/`, obj).toPromise();
//   console.log(" response   idddddddddd   ",response);
//      return response;
//   }
getSimulationNextAction(obj:any){
  let response= this.httpClient.post(this.ipAddressDataCrowd+"/api/getSimulationNextAction/",obj,{observe: 'response', responseType: 'arraybuffer'}).toPromise();
  
   console.log('getSimulationNextAction====1',response);
  return response; 
   
 }

  getSimulationData(obj:any){
  let response= this.httpClient.post(this.ipAddressDataCrowd+"/api/getSimulationData/",obj,{observe: 'response', responseType: 'arraybuffer'}).toPromise();
  
   console.log('getSimulationData>>>>>> 1',response);
  return response; 
   
 }

//  async getSimulationData(obj:any){
//   let response= this.httpClient.post(this.ipAddressDataCrowd+"/api/getSimulationData/",obj).toPromise();
  
//    console.log('getSimulationData>>>>>> 1',response);
//   return response; 
   
//  }



 async getsimualtion(queryId:any,usercode:any){
  let response= this.httpClient.get(this.ipAddress+"/api/getSimulation/"+queryId+"/"+usercode).toPromise();
  
   console.log('getSimulation>>>>>>',response);
  return response; 
   
 }

 async getLastSimualtionID(usercode:any){
  let response= this.httpClient.get(this.ipAddress+"/api/getLastSimualtionID/"+usercode).toPromise();
  
   console.log('LastSimualtionID>>>>>>',response);
  return response; 
   
 }

 
 async deleteLastSimualtionID(usercode:any){
  let response= this.httpClient.get(this.ipAddress+"/api/deleteLastSimualtionID/"+usercode).toPromise();
  
   console.log('deleteLastSimualtionID>>>>>>',response);
  return response; 
   
 }
 

 async getfixedelementsObject(objectID:any){
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let response= this.httpClient.post(this.ipAddress+"/api/getfixedelementsObject",objectID,options).toPromise();
  
   console.log('getfixedelementsObject>>>>>>',response);
  return response; 
   
 }


 
 async getExecutionParam(queryId:any){
  let response= this.httpClient.get(this.ipAddress+"/api/getExecutionParam/"+queryId).toPromise();
  
   console.log('getExecutionParam>>>>>>',response);
  return response; 
   
 }


 async getSelectedShape(queryId:any){
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'responseType': 'arraybuffer'
    }
  };
  let response= this.httpClient.post(this.ipAddress+"/api/getSelectedShape/"+queryId,{ responseType: "arraybuffer" }).toPromise();
  
   console.log('getSelectedShape>>>>>>',response);
   
  return response; 
   
 }


async getgraphtools(){
  const options = {
    headers: {
      'rejectUnauthorized': 'false'
    }
  };
  let response= this.httpClient.get(this.ipAddress+"/api/getgraphtools",options).toPromise();
  
  console.log('getgraphtools>>>>>>',response);
 return response; 
  
}


async getmoretools(){
  let response= this.httpClient.get(this.ipAddress+"/api/getmoretools").toPromise();
  
  console.log('getgraphtools>>>>>>',response);
 return response; 
  
}
async getmaptypes(){
  let response= await this.httpClient.get(this.ipAddress+"/api/getmaptypes").toPromise();
  
   console.log('map types>>>>>>',response);
  return response; 
   
 }

async distanceAPI(obj:any){
  let response= await this.httpClient.post<any>(this.ipAddress+"/api/distanceAPI",obj).toPromise();
  
   console.log('distanceAPI >>>>>>',response);
  return response; 
   
 }

 async executeImportDataEngine(ReportJsonParamId:any,userId:any){
  let response=  this.httpClient.get(this.ipAddress+"/api/executeImportDataEngine/"+ReportJsonParamId+"/"+userId, {headers: GlobalConstants.headers}).toPromise();
  console.log('executemapexplore2>>>>>>',response);
  return response; 
}

async SaveShape(obj:any){
  let response= this.httpClient.post<any>(this.ipAddress+"/api/SaveShape",obj).toPromise();
  console.log('SaveShape >>>>>>',response);
  return response; 

}

 options = {
  headers: {
    'Content-Type': 'application/json',
  },

};




async getShapelimit(){

  let response= this.httpClient.get(this.ipAddress+"/api/getShapelimit").toPromise();
  
  console.log('getShapelimit>>>>>>',response);
 return response; 
  
}


async getdirection(v_method_log:any,devices:any){
  console.log("devices>>>",devices)
  let response=  this.httpClient.get(this.ipAddress+"/api/getdirection/"+v_method_log+"/"+devices, {headers: GlobalConstants.headers}).toPromise();
  console.log('getdirection>>>>>>',response);
  return response; 
}

async getdirectionByTime(v_method_log:any,devices:any){
  console.log("devices>>>",devices)
  let response=  this.httpClient.get(this.ipAddress+"/api/getdirectionByTime/"+v_method_log+"/"+devices, {headers: GlobalConstants.headers}).toPromise();
  console.log('getdirectionByTime>>>>>>',response);
  return response; 
}

getData() {

//   let response= this.httpClient.get("../assets/coords/coords.json").toPromise();
  
//   console.log('inserjsonparam>>>>>>',response);
//  return response; 
  
   let jsonUrl = '../assets/datajson.JSON'; // Path to your JSON file

  return this.httpClient.get(jsonUrl).toPromise();
}

getData2() {

  //   let response= this.httpClient.get("../assets/coords/coords.json").toPromise();
    
  //   console.log('inserjsonparam>>>>>>',response);
  //  return response; 
    
     let jsonUrl = '../assets/DATA2.JSON'; // Path to your JSON file
  
    return this.httpClient.get(jsonUrl).toPromise();
  }
  
  getData4() {

    //   let response= this.httpClient.get("../assets/coords/coords.json").toPromise();
      
    //   console.log('inserjsonparam>>>>>>',response);
    //  return response; 
      
       let jsonUrl = '../assets/DATA3.JSON'; // Path to your JSON file
    
      return this.httpClient.get(jsonUrl).toPromise();
    }
    
    getData5() {

      //   let response= this.httpClient.get("../assets/coords/coords.json").toPromise();
        
      //   console.log('inserjsonparam>>>>>>',response);
      //  return response; 
        
         let jsonUrl = '../assets/DATA4.JSON'; // Path to your JSON file
      
        return this.httpClient.get(jsonUrl).toPromise();
      }

async ScanfixedElements(obj:any){
  console.log("obj>>>",obj)
  let response=  this.httpClient.post<any>(this.ipAddress+"/api/scanfixedelements/",obj, {headers: GlobalConstants.headers}).toPromise();
  console.log('scanfixedelements>>>>>>',response);
  return response; 
}

async getVcisfixedelementsID(simulationId:any){
  let response=  this.httpClient.get(this.ipAddress+"/api/getVcisfixedelementsID/"+simulationId, {headers: GlobalConstants.headers}).toPromise();
  console.log('getVcisfixedelementsID>>>>>>',response);
  return response; 
} 

async reverseGeocode(lat: number, lng: number) {
  const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
  let response=  this.httpClient.get(apiUrl).toPromise();
  return response; 

}

async getcountry(obj:any) {
  console.log("getcountry obj>>>",obj)
  let response= await this.httpClient.post<any>(this.ipAddress+"/api/getcountry/",obj).toPromise();
  console.log('getcountry>>>>>>',response);
  return response; 

}

async getcountry2(obj:any) {
  console.log("getcountry obj>>>",obj)
  let response= await this.httpClient.post<any>(this.ipAddress+"/api/getcountry2/",obj).toPromise();
  console.log('getcountry2>>>>>>',response);
  return response; 

}


async getALLcountryIDS() {
  let response= await this.httpClient.get(this.ipAddress+"/api/getALLcountryIDS/").toPromise();
  console.log('getALLcountryIDS>>>>>>',response);
  return response; 

}

async executeCoTraveler(obj:any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/findCoTraveler',obj,{ headers }).toPromise();
   console.log('executeCoTraveler>>>>>>',response);
  return response; 
   
  
 }
checkTableCoTravelers(simulationId:any,count:number){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/checkTableCoTravelers/'+simulationId+"/"+count,{ headers });
   console.log('checkTableCoTravelers>>>>>>',response);
  return response; 
   
  
}


 async executeCoRelation(obj:any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/findCoRelation',obj,{ headers }).toPromise();
   console.log('findCoRelation>>>>>>',response);
  return response; 
   
  
 }

 checkTableCoRelations(simulationId:any,count:number){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/checkTableCoRelations/'+simulationId+"/"+count,{ headers });
   console.log('checkTableCoRelations>>>>>>',response);
  return response; 
   
  
}


getCoRelationCommonLocationHits(simulationId:any,deviceId:any){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/getCoRelationCommonLocationHits/'+simulationId+"/"+deviceId,{ headers }).toPromise();
   console.log('getCoTravelerCommonLocationHits>>>>>>',response);
  return response; 
}


getAllCoRelationCommonLocationHits(simulationId:any){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/getAllCoRelationCommonLocationHits/'+simulationId,{ headers }).toPromise();
   console.log('getAllCoRelationCommonLocationHits>>>>>>',response);
  return response; 
}
getAoiCoord(simulationId:any,deviceId:any){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/getAoiCoord/'+simulationId+"/"+deviceId,{ headers }).toPromise();
   console.log('getAoiCoord>>>>>>',response);
  return response; 
}
checkTableAoiActivity(simulationId:any,count:number){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/checkTableAoiActivity/'+simulationId+"/"+count,{ headers });
   console.log('checkTableAoiActivity>>>>>>',response);
  return response; 
   
  
}

inQueueId(usercode:any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/inQueueId/'+usercode,{ headers }).toPromise();
   console.log('inQueueId>>>>>>',response);
  return response; 
}

getSimulationStatus(inQueueArray:any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/getSimulationStatus/'+inQueueArray,{ headers }).toPromise();
   console.log('getSimulationStatus>>>>>>',response);
  return response; 
}

async addFixedelements(obj:any){
  let response= this.httpClient.post<any>(this.ipAddressDataCrowd+"/api/addFixedelements/",obj).toPromise();
  
   console.log('addFixedelements>>>>>>',response);
  return response; 
   
 }

 async getTypeFixedelements() {
  let response= await this.httpClient.get(this.ipAddress+"/api/typefixedelementsID/").toPromise();
  console.log('typefixedelementsID>>>>>>',response);
  return response; 

}

async getinternalcode(parentSenario:any) {
  let response= await this.httpClient.get(this.ipAddress+"/api/getinternalcode/"+parentSenario).toPromise();
  console.log('getinternalcode>>>>>>',response);
  return response; 

}


async displaysequence(p_loc_report_config_id:any) {
  let response= await this.httpClient.get(this.ipAddress+"/api/DisplaySequence/"+p_loc_report_config_id).toPromise();
  console.log('displaysequence22>>>>>>',response);
  return response; 

}

async displaysequence2(p_loc_report_config_id:any) {
  let response= await this.httpClient.get(this.ipAddress+"/api/DisplaySequence2/"+p_loc_report_config_id).toPromise();
  console.log('displaysequence>>>>>>',response);
  return response; 

}

async checkSimulationifSaved(simulid:any){
  let response= this.httpClient.get<any>(this.ipAddress+"/api/checkSimulationifSaved/"+simulid).toPromise();
  console.log('checkSimulationifSaved >>>>>>',response);
  return response; 

}

async updateLocReportNameById(simulname:any,simulid:any){
  let response= this.httpClient.get<any>(this.ipAddress+"/api/updateLocReportNameById/"+simulname+"/"+simulid).toPromise();
  console.log('updateLocReportNameById >>>>>>',response);
  return response; 

}


// async getdataChatbot(obj:any){
//   let response= this.httpClient.get<any>("http://10.1.2.106:3005/chat",obj).toPromise();
//   console.log('getdataChatbot >>>>>>',response);
//   return response; 

// }

async getchatbotrecords(){
  let response:any= this.httpClient.get(this.ipAddress+"/api/getchatbotrecords/").toPromise();
  
   console.log('getchatbotrecords>>>>>>',response);
  return response; 
   
 }

 async getchatbotMessage(obj:any){
  let response:any= this.httpClient.post<any>(this.ipAddress+"/api/getchatbotMessage/",obj).toPromise();
  
   console.log('getchatbotrecords>>>>>>',response);
  return response; 
   
 }

 async displayTimeline(startDate:any,endDate:any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/DisplayTimeline/'+startDate+'/'+endDate+'/',{ headers }).toPromise();
   console.log('displayTimeline>>>>>>',response);
  return response; 
}


async displayTimelineDay(id:any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>('https://10.1.8.37:8111/kwg/api/DisplayTimelineDay/'+id+'/',{ headers }).toPromise();
   console.log('displayTimeline>>>>>>',response);
  return response; 
}
async DisplayTimelineYear(){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>('https://10.1.8.37:8111/kwg/api/DisplayTimelineYear/',{ headers }).toPromise();
   console.log('DisplayTimelineYear>>>>>>',response);
  return response; 
}

async finalDisplayTimeline(process :any , date:any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/finalDisplayTimeline/'+process+'/'+date+'/',{ headers }).toPromise();
   console.log('finalDisplayTimeline>>>>>>',response);
  return response; 
}

async getDrillDownTimeline(simulationName :any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.get<any>(this.ipAddressKYG+'/api/getDrillDownTimeline/'+simulationName+'/',{ headers }).toPromise();
   console.log('getDrillDownTimeline>>>>>>',response);
  return response; 
}

async getFilteredData(object :any){
  let response= this.httpClient.post<any>(this.ipAddressKYG+"/api/getFilteredData/",object, {headers: GlobalConstants.headers}).toPromise();
   console.log('getFilteredData>>>>>>',response);
  return response; 
}

async getDailySimulationId(date :any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/getDailySimulationId/'+date+'/',{ headers }).toPromise();
   console.log('getDailySimulationId>>>>>>',response);
  return response; 
}
//  async getSimulationData(obj:any){
//   let response= this.httpClient.post(this.ipAddressDataCrowd+"/api/getSimulationData/",obj,{observe: 'response', responseType: 'blob'}).toPromise();
  
//    console.log('getSimulationData>>>>>>3',response);
//   return response; 
   
async getMonthlySimulationId(date :any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/getMonthlySimulationId/'+date+'/',{ headers }).toPromise();
   console.log('getMonthlySimulationId>>>>>>',response);
  return response; 
}

async displayTimelineFromMap(simulationId :any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/displayTimelineFromMap/'+simulationId,{ headers }).toPromise();
  return response; 
}


async getObjectId(userCode :any){
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/getObjectId/'+userCode,{ headers }).toPromise();
  return response; 
}
//  async getSimulationData(obj:any){
//   let response= this.httpClient.post(this.ipAddressDataCrowd+"/api/getSimulationData/",obj,{observe: 'response', responseType: 'blob'}).toPromise();
  
//    console.log('getSimulationData>>>>>>4',response);
//   return response; 
async getRoutes(object :any){
  let response= await this.httpClient.post<any>(this.ipAddressDataCrowd+"/api/findroute/",object, {headers: GlobalConstants.headers}).toPromise();
   console.log('getRouteeeee>>>>>>',response);
  return response; 
}
getCoTravelerCommonLocationHits(simulationId:any,deviceId:any){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/getCoTravelerCommonLocationHits/'+simulationId+"/"+deviceId,{ headers }).toPromise();
   //console.log('getCoTravelerCommonLocationHits>>>>>>',response);
  return response; 
}




getAllCoTravelerCommonLocationHits(simulationId:any){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.post<any>(this.ipAddress+'/api/getAllCoTravelerCommonLocationHits/'+simulationId,{ headers }).toPromise();
   //console.log('getAllCoTravelerCommonLocationHits>>>>>>',response);
  return response; 
}


deleteSimualtion(simulationId:any){
  
  const headers = { 'Content-Type': 'application/json' };
  let response= this.httpClient.get(this.ipAddress+'/api/deleteSimulation/'+simulationId,{ headers }).toPromise();
   //console.log('getAllCoTravelerCommonLocationHits>>>>>>',response);
  return response; 
}

async getDeviceCommonLocationHIts(simulationId :any){
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/getDeviceCommonLocationHIts/'+simulationId, {headers: GlobalConstants.headers}).toPromise();
  return response; 
}
//  async getSimulationData(obj:any){
//   let response= this.httpClient.post(this.ipAddressDataCrowd+"/api/getSimulationData/",obj,{observe: 'response', responseType: 'blob'}).toPromise();
  
//    console.log('getSimulationData>>>>>>',response);
//   return response; 
   
async getSimulationTypes(){
  let response= this.httpClient.get(this.ipAddress+"/api/getSimulationTypes/").toPromise();
  
   console.log('getSimulationTypes>>>>>>',response);
  return response; 
   
 }

 async getCommonLocationHits(simulationId :any,deviceId :any){
  let response= this.httpClient.post<any>(this.ipAddressKYG+'/api/getCommonLocationHits/'+simulationId+'/',deviceId, {headers: GlobalConstants.headers}).toPromise();
  return response; 
}


async getfilterDataTimeline(object :any){
  let response = this.httpClient.post<any>(this.ipAddressKYG+"/api/getfilterDataTimeline/",object, {headers: GlobalConstants.headers}).toPromise();
  return response; 
}

async getCommonDevicesTimeline(object :any){
  let response=await this.httpClient.post<any>(this.ipAddressKYG+"/api/getCommonDevicesTimeline/",object, {headers: GlobalConstants.headers}).toPromise();
  return response; 
}

}
