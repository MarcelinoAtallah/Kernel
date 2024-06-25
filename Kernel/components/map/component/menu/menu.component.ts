import {Renderer2, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewChildren, QueryList, NgZone, ChangeDetectorRef } from '@angular/core';
import { DatacrowdService } from '../../Services/datacrowd.service';

interface Node {
  orgHierarchy: string[];
  Name: string;
  id: number;
  children?: Node[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class NavbarComponent  implements OnInit{
  isHovered: boolean = false;

  // hierarchyData: Node[] = [this.generateComplexJSON(10)
    // Your JSON data here
  // ];
  @Input() SimulID:any;
  @Output() displayclusters2   = new EventEmitter();
  @ViewChild('navigationBar') navigationBar: ElementRef;
  jsonData: any[] = [/* Your JSON data goes here */];
  newItem: any;
  simulproperties: any;
  hierarchyobj:any;

  ngAfterViewInit() {
    const parentElement = this.elementRef.nativeElement.querySelector('.navigation-bar');
    this.renderer.listen(parentElement, 'click', (event: Event) => {
      const clickedElement = event.target as HTMLElement;
      console.log('clickedElement',clickedElement)
      if (clickedElement && (clickedElement.classList.contains('menu') || clickedElement.closest('.menu'))) {
        this.menuClickHandler(event);
      }
    });
  }

  menuClickHandler(event: Event) {
    // Your click event handler logic here
    console.log('Menu clicked!');
  }
  isContextMenuOpen: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  SimulationID :any;
  SimulName: any;
  lastInHierarchy:any;
  parentSimulID:any;

  handleRightClick(event: any,item:any) {
    event.preventDefault();
    let sid = item.id;
    this.SimulName = item.Name
    console.log('asd',sid);
    this.SimulationID=sid

    // Calculate position based on mouse click
    this.contextMenuPosition = {
      x: event.clientX - 10,
      y: event.clientY - 10
    };
    console.log('this.contextMenuPosition >>> ',this.contextMenuPosition)
    // Open the context menu
    this.isContextMenuOpen = true;

    // Close the context menu if clicked outside
    const outsideClickListener = (event: MouseEvent) => {
      // if (!this.navigationBar.nativeElement.contains(event.target)) {
      //   this.isContextMenuOpen = false;
        
      //   document.removeEventListener('click', outsideClickListener);
      // }
    };

    document.addEventListener('click', outsideClickListener);
    this.simulproperties=this.currentHierarchy.find((e:any)=>e.id==this.SimulationID);
    console.log("simulproperties",this.simulproperties);
  }

  // Method to close the context menu
  closeContextMenu() {
    this.isContextMenuOpen = false;
  }

  ngOnInit(): void{
// //178564
this.parentSimulID=181663;

     this.datacrowdservice.displaysequence2(181663).then(((res:any)=>{
console.log("resss",res);
console.log("resss parsed",JSON.parse(res[0]));
let arr:any[]=[];
arr.push(JSON.parse(res[0]));

 this.hierarchyData=arr;
//  this.hierarchyData=this.convertData(this.jsonData);


    }))


}

ngOnChanges(changes: any) {
  let data:any=changes.SimulID.currentValue;

  console.log("changes222-------------",changes);
  // alert("simualtion id changeddddddd"+changes.SimulID.currentValue);



  if(typeof data== "undefined"){
  console.log("is undefined-------------",changes);
   this.currentHierarchy=[];

  }else{
    this.reportType=data.reportType;

    console.log("not  undefined-------------",changes);

   if(data.Action=="CloseSenario"){
this.reset();
   }else  if(data.Action=="DisplayFromSenario"){
    let parentID:any;
    if(typeof data.senarioParentName!= "undefined"){
      parentID= data.senarioParentName;
    }else{
      parentID= data;

    }
    this.parentSimulID=parentID;
    this.SimulationID=data.simulationid;

         this.datacrowdservice.displaysequence2(parentID).then(((res:any)=>{
console.log("resss",res);
console.log("resss parsed",JSON.parse(res[0]));
let arr:any[]=[];
arr.push(JSON.parse(res[0]));

 this.hierarchyData=arr;
//  this.hierarchyData=this.convertData(this.jsonData);
this.hierarchyobj=JSON.parse(res[0]);


    }))

       }
   else{

    if(data.senarioFlag==false){
      this.reset();
          }
      
          let parentID:any;
          if(typeof data.senarioParentName!= "undefined"){
            parentID= data.senarioParentName;
          }else{
            parentID= data;
      
          }
          this.parentSimulID=parentID;
          this.datacrowdservice.displaysequence2(parentID).then(((res:any)=>{
            console.log("resss",res);
            console.log("resss parsed",JSON.parse(res[0]));
            let arr:any[]=[];
            arr.push(JSON.parse(res[0]));
            
            this.hierarchyData=arr;
            //  this.hierarchyData=this.convertData(this.jsonData);
            
            console.log("hierarchyData",this.hierarchyData);
            this.hierarchyobj=JSON.parse(res[0]);

            
              }))
      
        // if(data.Action=="addnewMenu"){
          // console.log("data>>>>>>>>",data);
           this.addnewMenu(data.simulationid,data.senarioParentName,data.senariocount);
           if(data.senarioParentName != data.simulationid)
            {
             console.log("ttttttttttt>>>>",this.searchById(data.senarioParentName,this.newItem));
            }
      
        // }
      
          
      
   }

  }

}

// ngOnChanges(changes: any) {
//   let data:any=changes.SimulID.currentValue;

//   console.log("changes222-------------",changes);
//   // alert("simualtion id changeddddddd"+changes.SimulID.currentValue);



//   if(typeof data== "undefined"){
//   console.log("is undefined-------------",changes);
//    this.currentHierarchy=[];

//   }else{
//     this.reportType=data.reportType;

//     console.log("not  undefined-------------",changes);

//    if(data.Action=="CloseSenario"){
// this.reset();
//    }else  if(data.Action=="DisplayFromSenario"){
//     let parentID:any;
//     if(typeof data.senarioParentName!= "undefined"){
//       parentID= data.senarioParentName;
//     }else{
//       parentID= data;

//     }
//     this.parentSimulID=parentID;

//          this.datacrowdservice.displaysequence2(parentID).then(((res:any)=>{
// console.log("resss",res);
// console.log("resss parsed",JSON.parse(res[0]));
// let arr:any[]=[];
// arr.push(JSON.parse(res[0]));

//  this.hierarchyData=arr;
// //  this.hierarchyData=this.convertData(this.jsonData);


//     }))

//        }
//    else{


//     if(data.senarioFlag==false){
//       this.reset();
//           }
      
//           let parentID:any;
//           if(typeof data.senarioParentName!= "undefined"){
//             parentID= data.senarioParentName;
//           }else{
//             parentID= data;
      
//           }
//           this.parentSimulID=parentID;
//           this.datacrowdservice.displaysequence2(parentID).then(((res:any)=>{
//             console.log("resss",res);
//             console.log("resss parsed",JSON.parse(res[0]));
//             let arr:any[]=[];
//             arr.push(JSON.parse(res[0]));
            
//             this.hierarchyData=arr;
//             //  this.hierarchyData=this.convertData(this.jsonData);
            
//             console.log("hierarchyData",this.hierarchyData);
            
//               }))
      
//         // if(data.Action=="addnewMenu"){
//           // console.log("data>>>>>>>>",data);
//            this.addnewMenu(data.simulationid,data.senarioParentName,data.senariocount);
//            if(data.senarioParentName != data.simulationid)
//             {
//               this.searchById(data.senarioParentName,this.newItem)
//             }
      
//         // }
      
          
      
//    }

//   }

// }

  @HostListener('document:click', ['$event'])
  outsideClick(event: MouseEvent) {
    this.isContextMenuOpen = false;
  }
  hierarchyData: any[] =[
    {
        "orgHierarchy": [
            "root"
        ],
        "Name": "Scenarios",
        "id": 0,
        "SimulName": "Scenarios",
        "children": []
    }
  ]  
  currentHierarchy: Node[] = [];
  currentTab: Node;
  lastClickedTab: Node; // Add this property
reportType:any;
  constructor(public datacrowdservice:DatacrowdService, private renderer: Renderer2,private elementRef: ElementRef) {
    const complexJSON: Node = this.generateComplexJSON(5);
    console.log(JSON.stringify(complexJSON, null, 2));
  }

  showSubMenu(item: Node) {
    console.log('item >> ',item)
    this.currentTab = item;
    this.lastClickedTab = item; // Update last clicked tab
    this.displaySenario(item);
 

  }

  addMenu(item: Node) {
    
    console.log('item >> ',item)
    this.lastInHierarchy = item.Name;
    this.removeSubMenus(item.Name); // Remove irrelevant submenus
    this.currentHierarchy.push(item);
    console.log("currentHierarchy>>>",this.currentHierarchy[this.currentHierarchy.length-1].Name);
    this.displaySenario(item);


  }

  displaySenario(item: Node)
  {
    let obj:any={
      action:"displaysenario",
      simulID:item.id,
      reportType:this.reportType
    }
    this.displayclusters2.emit(obj);
    this.addNewActiveTab(item.id)

  }

  removeSubMenus(currentId: any) {
    console.log("rrrr",currentId)
    this.currentHierarchy = this.currentHierarchy.filter(
      item =>
        (item.Name < currentId && item.Name.split('.').length - 1 < currentId.split('.').length - 1) ||
        item.Name.split('.').length == 1
    );
    console.log(this.currentHierarchy);
  }
  generateComplexJSON(depth: number, prefix: string = '1'): Node {
    if (depth <= 0) {
      return null;
    }

    const node: Node = {
      orgHierarchy: [prefix],
      Name: prefix,
      id: this.generateRandomId(),
    };

    const childrenCount = Math.floor(Math.random() * 10) + 1; // Random number of children

    if (childrenCount > 0) {
      node.children = [];
      for (let i = 1; i <= childrenCount; i++) {
        const childPrefix = `${prefix}.${i}`;
        const child = this.generateComplexJSON(depth - 1, childPrefix);
        if (child) {
          node.children.push(child);
        }
      }
    }

    return node;
  }

  generateRandomId(): number {
    return Math.floor(Math.random() * 100000);
  }
 
  convertToHierarchy(data: any[]): Node[] {
    const hierarchyMap: { [key: string]: Node } = {};
  
    // Build hierarchy map
    data.forEach(item => {
      const orgKey = item.orgHierarchy.join('/');
      const orgItem: Node = {
        orgHierarchy: item.orgHierarchy,
        Name: item.Name,
        id: item.id
      };
  
      hierarchyMap[orgKey] = orgItem;
    });
  
    // Link children
    Object.values(hierarchyMap).forEach(item => {
      const parentKey = item.orgHierarchy.slice(0, -1).join('/');
      const parent = hierarchyMap[parentKey];
  
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }
    });
  
    // Find root items
    const rootItems: Node[] = [];
    Object.values(hierarchyMap).forEach(item => {
      if (item.orgHierarchy.length === 1) {
        rootItems.push(item);
      }
    });
  
    return rootItems;
  }

  // currentHierarchy: any[] = [];
  // currentTab: any;
  // showSubMenu(item: any) {
  //   this.currentTab = item;
  //   console.log(this.currentTab)
  // }

  // addMenu(item: any) {
  //   this.removeSubMenus(item.Name); // Remove irrelevant submenus
  //   this.currentHierarchy.push(item);
  // }

  // removeSubMenus(currentId: any) {
  //   this.currentHierarchy = this.currentHierarchy.filter(item => (item.Name < currentId && item.Name.split('.').length - 1 < currentId.split('.').length - 1) || item.Name.split('.').length == 1);
  //   console.log(this.currentHierarchy)
  // }


   convertData(inputData: any): TreeNode[] {
    function traverse(node: any, orgHierarchy: string[]): TreeNode {
      const treeNode: TreeNode = {
        orgHierarchy: orgHierarchy,
        Name: node.Name,
        id: node.id,
      };
  
      if (node.children && node.children.length > 0) {
        treeNode.children = node.children.map((child: any, index: number) => {
          const childOrgHierarchy = [...orgHierarchy, `${node.orgHierarchy[node.orgHierarchy.length - 1]}.${index + 1}`];
          return traverse(child, childOrgHierarchy);
        });
      }
  
      return treeNode;
    }
  
    return inputData.map((item: any) => traverse(item, [item.orgHierarchy[0]]));
  }


  addnewSenario(){
   console.log('newSimulationID',this.SimulationID);
   let obj:any={
    action:"addnewSenario",
    simulID:this.SimulationID,
    simulname:this.SimulationID

  }
   this.displayclusters2.emit(obj);

//    console.log('newSimulationID',this.lastInHierarchy)
//    console.log('newSimulationID1',this.incrementLastDigitAfterDot(this.lastInHierarchy))
//    let newItem = {
//     "orgHierarchy": [
//         ""
//     ],
//     "Name": this.lastInHierarchy+'.1',
//     "id": this.SimulationID + 1,
//     "SimulName": "report 11"
// }
// console.log('newItem',newItem)
//    this.addMenu(newItem)
  }



addnewMenu(newSimulationID:any,parentsimulID:any,senarioCount:any){
  //    console.log('newSimulationID',this.lastInHierarchy)
//    console.log('newSimulationID1',this.incrementLastDigitAfterDot(this.lastInHierarchy))
//  let newItem:any; 

 if(senarioCount>0){
  senarioCount--;
 }
 if(senarioCount==0){
  senarioCount = '';
  this.SimulName=parentsimulID;
}else{
  senarioCount = '.'+senarioCount;

}

if(typeof this.SimulName=="undefined"){
  this.newItem = {
  "orgHierarchy": [
      ""
  ],
  "Name": newSimulationID+senarioCount,
  "id": newSimulationID,
  "SimulName": "No Name"
}
}else{
  this.newItem = {
  "orgHierarchy": [
      ""
  ],
  "Name": this.SimulName+senarioCount,
  "id": newSimulationID,
  "SimulName": "No Name"

}}

//  console.log('newItem',this.searchById(parentsimulID,this.newItem))
 this.addMenu(this.newItem)
 this.getParentIds(newSimulationID);
}
// addnewMenu(newSimulationID:any,parentsimulID:any,senarioCount:any){
//   //    console.log('newSimulationID',this.lastInHierarchy)
// //    console.log('newSimulationID1',this.incrementLastDigitAfterDot(this.lastInHierarchy))
//  let newItem = {
//   "orgHierarchy": [
//       ""
//   ],
//   "Name": this.SimulName+'.'+senarioCount,
//   "id": newSimulationID,
//   "SimulName": "report 11"
// }
// console.log('newItem',newItem)

// console.log('newItem',this.searchById(this.SimulationID,newItem))
//  this.addMenu(newItem)
// }
  incrementLastDigitAfterDot(input: string): string {
    const parts: string[] = input.split('.');
    for (let i = parts.length - 1; i >= 0; i--) {
        if (!isNaN(Number(parts[i]))) {
            parts[i] = String(Number(parts[i]) + 1);
            break;
        }
    }
    return parts.join('.');
}

  reset(){
    
     this.hierarchyData=[
      {
          "orgHierarchy": [
              "root"
          ],
          "Name": "Scenarios",
          "id": 0,
          "SimulName": "Scenarios",
          "children": []
      }
    ]  ;
    this.currentHierarchy=[];
    let obj:any={
      action:"reset",
  
    }
  this.displayclusters2.emit(obj);
  }

  editName()
  {
    let inputElement:any= $('#' + this.SimulationID);
  
  
    console.log(" the elementtt",$('#'+ this.SimulationID+' .smartinput'))
  
  
    inputElement.find('input').removeAttr('readonly')
    inputElement.find('input').trigger('focus');
  
  
  
    let firstValue:any=$('#'+ this.SimulationID+' .smartinput').val();

    
    let newName:any= $('#'+ this.SimulationID+' .smartinput');
    console.log('newName',newName)
  
  
    $(newName).on('focusout', async (e:any)=> {
      console.log('dsasasd',$('#'+ this.SimulationID+' .smartinput').val())
  let finalvalue:any=$('#'+ this.SimulationID+' .smartinput').val();
  $('#'+ this.SimulationID+' .smartinput').attr('readonly', 'readonly');
   await this.datacrowdservice.updateLocReportNameById(finalvalue,this.SimulationID);
  

   var button = $('.submenu-item').filter(function() {
    return $(this).find('span:contains('+firstValue+')').length > 0;
});
console.log('firstValue',firstValue)
console.log('SimulationID',this.SimulationID)

console.log("buttonzzz",button);
if(button.length > 0) {
  button.find('span:contains('+firstValue+')').text(finalvalue); // Change 'new text value' to your desired text
  console.log('updateSimulNameById>>>>>',this.updateSimulNameById(this.hierarchyData[0],this.SimulationID,finalvalue));
  this.hierarchyData=this.updateSimulNameById(this.hierarchyData[0],this.SimulationID,finalvalue);
} else {
  console.log('Button not found.');
}

  });

   console.log("this.currentHierarchy",this.currentHierarchy)
   console.log("this.hierarchyData",this.hierarchyData)

  
  }



searchById(id: number,newitem:Node): any | null {
  console.log('id',id)
  console.log('newitem>>',newitem)
  console.log('newitem&*(<*<',this.hierarchyData)

  function searchInHierarchy(hierarchy: any[]): any | null {
    for (const item of hierarchy) {
      if (item.id === id) {
        if(item.children == undefined)
          {
            item['children'] = [newitem]
          }
          else
          {
            item.children.push(newitem);
          }
        console.log('item',item.children)
        // newItem
        return item;
      }
      if (item.children && item.children.length > 0) {
        const result = searchInHierarchy(item.children);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  return searchInHierarchy(this.currentHierarchy);
}
  
removeById(id: number): boolean {
  console.log('id to remove', id);
  console.log('currentHierarchy before removal', this.currentHierarchy);

  function removeFromHierarchy(hierarchy: any[]): boolean {
    for (let i = 0; i < hierarchy.length; i++) {
      const item = hierarchy[i];
      if (item.id === id) {
        hierarchy.splice(i, 1);  // Remove the item from the array
        return true;  // Return true indicating the item was found and removed
      }
      if (item.children && item.children.length > 0) {
        const result = removeFromHierarchy(item.children);
        if (result) {
          return true;  // Return true if the item was found and removed in a nested array
        }
      }
    }
    return false;  // Return false if the item was not found in the hierarchy
  }

  const isRemoved = removeFromHierarchy(this.currentHierarchy);
  console.log('currentHierarchy after removal', this.currentHierarchy);
  return isRemoved;
}

getParentIds(childId: number): number[] {
  const parentIds: number[] = [];
  this.getParentsRecursive(this.hierarchyData, childId, parentIds);
  console.log("parentIds.reverse()>>>>>>>>>",parentIds.reverse());
  return parentIds.reverse(); // Reverse the array to start from the root parent
}

// Recursive function to find all parent IDs of a child ID
private getParentsRecursive(data: any[], childId: number, parentIds: number[]) {
  for (const item of data) {
    if (item.id === childId) {
      // Found the child, add its ID to the array and return
      parentIds.push(item.id);
      return;
    }
    if (item.children && item.children.length > 0) {
      // Recursively search in the children
      this.getParentsRecursive(item.children, childId, parentIds);
      if (parentIds.length > 0) {
        // Found the child in children, add the parent's ID to the array
        parentIds.push(item.id);
        return;
      }
    }
  }
}

removeActiveTabs() {

  $('.active-tab').each(function() {
    $(this).removeClass('active-tab');
  });
}

addNewActiveTab(id:any)
{
  this.removeActiveTabs();
  setTimeout(() => {

    $('#'+id).addClass('active-tab');

  }, (100));

}

async deleteSimul(){
  console.log(" this.SimulationID", this.SimulationID);
  console.log(" this.SimulName", this.SimulName);

  await this.datacrowdservice.deleteSimualtion(this.SimulationID);
 this.removeSubMenus(this.SimulName);
 this.removeById(this.SimulationID)
  
  
}
onIconHover(state: boolean): void {
  this.isHovered = state;
}

getDisplayValue(simulType: number): string {
  switch (simulType) {
    case 1:
      return 'AS';
    case 2:
      return 'DH';
    case 6:
      return 'DHP';
      case 3:
      return 'DTP';
      case 11:
       return 'TCD';
    default:
      return ''; // Or any default value or behavior you want
  }
}


findElementById(obj: any, id: number): any {

  if (obj.id === Number(id)) {

    console.log('obj returned',obj);

    return obj;
  }
  
  if (obj.children && obj.children.length > 0) {
    for (let child of obj.children) {
      const result = this.findElementById(child, id);
      if (result) {

        return result;

      }
    }
  }
  
  return null;  // Return null if the element with the specified id is not found
}

updateSimulNameById(root:any, id:any, newName:any) {


  if (root.id === Number(id)) {
    root.SimulName = newName;
    return root;  // Found and updated the name
  }

  if (root.children && root.children.length > 0) {
    for (let child of root.children) {
      if (this.updateSimulNameById(child, id, newName)) {
        return root;  // Stop further recursion if the name is updated
      }
    }
  }

  return false;  // Did not find the id
}


}
interface TreeNode {
  orgHierarchy: string[];
  Name: string;
  id: number;
  children?: TreeNode[] | string[];
}


