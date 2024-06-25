import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Component,  Inject, HostListener, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/Kernel/services/data.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropertiesDialogComponent } from './properties-dialog/properties-dialog.component';


@Component({
  selector: 'app-wfbuilder',
  templateUrl: './wfbuilder.component.html',
  styleUrls: ['./wfbuilder.component.css'],
})



export class WfbuilderComponent implements OnInit {
  @ViewChild('myDiv') myDiv: ElementRef;

  events = [
    {
      icon: '../../../../assets/img/icons/apptrig.png',
      name: 'Application Event',
      category: 'events',
      type: 'application'
    },
    {
      icon: '../../../../assets/img/icons/external.png',
      name: 'External Event',
      category: 'events',
      type: 'external'

    },
    {
      icon: '../../../../assets/img/icons/schedule.png',
      name: 'Schedule Event',
      category: 'events',
      type: 'schedule'
    },
  ];
  conditions = [
    {
      icon: '../../../../assets/img/icons/buscond.png',
      name: 'Business Condition',
      category: 'conditions'
    },
    {
      icon: '../../../../assets/img/icons/valcond.png',
      name: 'Validation Condition',
      category: 'conditions'
    },
    {
      icon: '../../../../assets/img/icons/delaycond.png',
      name: 'Delay Condition',
      category: 'conditions'
    },
  ];
  actions = [
    { icon: '../../../../assets/img/icons/validation.png', name: 'Validation', category: 'actions' },
    { icon: '../../../../assets/img/icons/todo.png', name: 'To Do', category: 'actions' },
    { icon: '../../../../assets/img/icons/email.png', name: 'Mail', category: 'actions' },
    { icon: '../../../../assets/img/icons/alert.png', name: 'Alert', category: 'actions' },
    { icon: '../../../../assets/img/icons/repository.png', name: 'Repository', category: 'actions' },
    { icon: '../../../../assets/img/icons/sms.png', name: 'SMS', category: 'actions' },
    {
      icon: '../../../../assets/img/icons/extmeth.png',
      name: 'External Method',
      category: 'actions'
    },
    {
      icon: '../../../../assets/img/icons/procedure.png',
      name: 'Stored Procedure',
      category: 'actions'
    },
    {
      icon: '../../../../assets/img/icons/webservice.png',
      name: 'Web Service', 
      category: 'actions'
    },
    {
      icon: '../../../../assets/img/icons/recursive.png',
      name: 'Recursive Call', 
      category: 'actions'
    },
  ];

  public eventAreaCoords: any;
  public eventAreaSizeTopLeft: any;
  public eventAreaSizeTopRight: any;
  public eventAreaSizeBottomLeft: any;
  public eventAreaSizeBottomRight: any;
  //variable to change the x coordinate of the dropped item
  public resizedX = -60;
  public resizedY = 0;
  //resize measures
  public xOffset = 128;
  public yOffset = 80;

  //Width of the event area
  public areaWidth: number;
  //Height of the event area
  public areaHeight: number;

  
  // Track clicked elements
  clickedElements: any[] = [];
  
  // Track arrows
  arrows: any[] = [];
  
  draggedElement: any | null = null;
  
  //the three arrays of the three different categories
  eventsElements: any[] = [];
  conditionsElements: any[] = [];
  actionsElements: any[] = [];
  
  //All elements on the screen
  public elements: any[] = [];
  renderer: any;
  
  // Track actions for undo
  undoHistory: { type: 'element' | 'arrow'; data: any }[] = [];
  
  // Boolean variable for turning click on and off
  isFunctionActive: boolean = false;
  
  //current screen width and height
  screenWidth: number;
  screenHeight: number;
  
  //The transform translated values of the elements dragged 
  translateX: number;
  translateY: number;

  //saving the information of the element right clicked for property use
  onRightClickInformation: any ;

  //saving the information of the element to copy
  onCopyInformation: any ;
  
  ngOnInit(): void {
    
    window.addEventListener('resize', () => {
      
    });
  }
  constructor(private dataservice:DataService, 
    private elementRef: ElementRef,
    private dialog: MatDialog,
    public informationservice: InformationService
  ) {}
  
  ngAfterViewInit(): void {
    
    // Accessing the width of the div element
    this.areaWidth = this.myDiv.nativeElement.offsetWidth;
    this.areaHeight = this.myDiv.nativeElement.offsetHeight;
    
    // Generating the original corners of the area
    this.updateAreaSizeAndCorners();
    
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    
    // Updating every time there is a window resize
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;

      // Accessing the width of the div element
      this.areaWidth = this.myDiv.nativeElement.offsetWidth;
      this.areaHeight = this.myDiv.nativeElement.offsetHeight;
      

      //update corners
      this.xOffset = 70;
      this.yOffset = 0;
      this.resizedY = -80;
      this.updateAreaSizeAndCorners();

    });

  }
  
  




  rightClickedElement(event: MouseEvent, element: any): void {
    //to prevent both context menus to pop on top of one another
    event.stopPropagation();
    //to prevent the default right click context menu that pops out from the stop propagation to come out
    event.preventDefault();
    //to turn off the second menu if the first is called while it was open
    let contextMenuDiv2 = document.getElementById('contextMenuDiv2');
    contextMenuDiv2.style.display = 'none';

    //to reveal the context menu
    let contextMenuDiv = document.getElementById('contextMenuDiv');
    contextMenuDiv.style.display = 'block';

    //take the mouse's coordinates
    let x = event.clientX;
    let y = event.clientY;
    
    //apply them to the style of the div after settimeout is done for it to be loaded beforehand
    setTimeout(() => {
      if (contextMenuDiv) {
        contextMenuDiv.style.left = `${x}px`;
        contextMenuDiv.style.top = `${y}px`;
      }
    }, 0);

    //saving the information of the element selected to be used in properties
    // making sure activityName is only added when we're working with events
    if (element.id !== undefined && element.category === 'events'){
      this.onRightClickInformation = {
        id: element.id,
        icon: element.icon,
        name: element.name,
        category: element.category,
        posX: element.posX,
        posY: element.posY,
        activityName: element.activityName,
        type: element.type
      };
    }else if(element.id !== undefined){
      this.onRightClickInformation = {
        id: element.id,
        icon: element.icon,
        name: element.name,
        category: element.category,
        posX: element.posX,
        posY: element.posY
      };
    }
    
  }

  rightClickedElementOutside(event: MouseEvent): void {
    //to turn off the first menu if the second is called while it was open
    let contextMenuDiv = document.getElementById('contextMenuDiv');
    contextMenuDiv.style.display = 'none';

    //checks if there's anything to undo, if yes, it shows the contextmenu2
    // Or if there's a copied item which needs pasting
    if(this.undoHistory && this.undoHistory.length > 0 || this.onCopyInformation){
      let contextMenuDiv2 = document.getElementById('contextMenuDiv2');
      contextMenuDiv2.style.display = 'block';
      let x = event.clientX;
      let y = event.clientY;
      
      setTimeout(() => {
        if (contextMenuDiv2) {
          contextMenuDiv2.style.left = `${x}px`;
          contextMenuDiv2.style.top = `${y}px`;
        }
      }, 0);
    }
  }

  menuDisappear(){
    let contextMenuDiv = document.getElementById('contextMenuDiv');
    let contextMenuDiv2 = document.getElementById('contextMenuDiv2');
    contextMenuDiv.style.display = 'none';
    contextMenuDiv2.style.display = 'none';
  }

  saveClickedItem(item: any): void {
    let itemDetails = {
      icon: item.icon,
      name: item.name,
      category: item.category,
      type: item.type
    };
    this.informationservice.setClickedItemDetails(JSON.stringify(itemDetails))

  }
  
  elementClicked(element: any): void {

    if (this.isFunctionActive == false) {
      return;
    }

    // Check if the element is already in the clickedElements array
    const existingIndex = this.clickedElements.findIndex(
      (el) => el.id === element.id
    );

    if (existingIndex !== -1) {
      // Element is already in the array, remove it to prevent drawing arrows
      this.clickedElements.splice(existingIndex, 1);
    } else {
      // Element is not in the array, add it
      this.clickedElements.push(element);

      // If two elements are clicked, create an arrow between them
      if (this.clickedElements.length === 2) {
        const arrow = {
          from: this.clickedElements[0].id,
          to: this.clickedElements[1].id,
          x2: this.getArrowX(this.clickedElements[1].id),
          y2: this.getArrowY(this.clickedElements[1].id),
        };
        this.arrows.push(arrow);

        // Clear the clicked elements array for the next click
        this.clickedElements = [];

        // Save the action to undo history
        this.addActionToHistory('arrow', arrow);
      }
    }
  }

  // Place the coords of the arrow corresponding to the posX and posY of the element
  getArrowX(elementId: string): number {
    const element = this.elements.find((e) => e.id === elementId);
    return element ? element.posX : 0;
  }
  getArrowY(elementId: string): number {
    const element = this.elements.find((e) => e.id === elementId);
    return element ? element.posY : 0;
  }
  
  

  //Function to handle newly dropped elements 
  drop(event: CdkDragDrop<any[]>, container: string) {
    //to fix the unwanted click effect for arrows
    this.clickedElements = [];

    const x = event.dropPoint.x;
    const y = event.dropPoint.y;
    const xx = x - this.eventAreaSizeTopLeft.x + this.resizedX;
    let yy = 0;
    
    //when dropped outside the area
    if(x > this.eventAreaSizeTopLeft.x &&
      x < this.eventAreaSizeTopRight.x &&
      y > this.eventAreaSizeTopLeft.y &&
      y < this.eventAreaSizeTopLeft.y+ this.areaHeight){
        //Random serial number given to the element
        let elementId = this.generateSerial();
        //save it using the service
        let savedItemDetails = JSON.parse(
          this.informationservice.getClickedItemDetails()
        );
        
      if (savedItemDetails) {
        //Create the element
        let newElement = {
          id: elementId,
          icon: savedItemDetails.icon,
          name: savedItemDetails.name,
          category: savedItemDetails.category,
          posX: x - this.eventAreaSizeTopLeft.x,
          posY: y - this.eventAreaSizeTopLeft.y,
          type: savedItemDetails.type
        };

    
        if (container === 'events') {
          yy = y - this.eventAreaSizeTopLeft.y - 30 + this.resizedY;
          
          if(y < this.eventAreaSizeTopLeft.y + this.areaHeight/3){
            //Call the properties pop up when a new event is dropped
            this.openProperties(newElement);
            // Push the new element into the `elements` array
            console.log("events down")
            this.eventsElements.push(newElement);
            this.elements.push(newElement);

            setTimeout(() => {
              // Places the new created element where the mouse is hovering over
              let element = document.getElementById(elementId);
              if (element) {
                element.style.left = `${xx}px`;
                element.style.top = `${yy}px`;
                element.style.display = 'block';
              }
            }, 0);        
            // Save the action to undo history
            this.addActionToHistory('element', { id: elementId });
            
          }else{
            //if they are not placed in events
          }
          
        } else if (container === 'conditions') {
          yy = y - this.eventAreaSizeTopLeft.y - 30 + this.resizedY - this.areaHeight/3;

          if(y < this.eventAreaSizeTopLeft.y + ((this.areaHeight/3)*2) && y > this.eventAreaSizeTopLeft.y + this.areaHeight/3){
            // Push the new element into the `elements` array
            console.log("conditions down")
            this.conditionsElements.push(newElement);
            this.elements.push(newElement);
            
            setTimeout(() => {
              // Places the new created element where the mouse is hovering over
              let element = document.getElementById(elementId);
              if (element) {
                element.style.left = `${xx}px`;
                element.style.top = `${yy}px`;
                element.style.display = 'block';
              }
            }, 0);
            // Save the action to undo history
            this.addActionToHistory('element', { id: elementId });

          }else{
            //if they are not placed in conditions
          }


        } else if (container === 'actions') {
          yy = y - this.eventAreaSizeTopLeft.y - 30 + this.resizedY - ((this.areaHeight/3)*2);

          if(y > this.eventAreaSizeTopLeft.y + ((this.areaHeight/3)*2)){
            // Push the new element into the `elements` array
            console.log("action down")
            this.actionsElements.push(newElement);
            this.elements.push(newElement);

            setTimeout(() => {
              // Places the new created element where the mouse is hovering over
              let element = document.getElementById(elementId);
              if (element) {
                element.style.left = `${xx}px`;
                element.style.top = `${yy}px`;
                element.style.display = 'block';
              }
            }, 0);
            // Save the action to undo history
            this.addActionToHistory('element', { id: elementId });

          }else{
            //if they are not placed in actions
          }
        }
      }
    }
    console.log("elements :", this.elements)
    console.log('drop')
  }

  // Function to handle start of the drag
  dragStarted(event: any, elementId: string): void {
    // Retrieve the dragged element
    const draggedElementId = elementId;
    // Find the corresponding element in the elements array
    this.draggedElement = this.elements.find(
        (e) => e.id === draggedElementId
    );

    console.log("Start")
  }


  //While moving the element
  elementMoved(event: CdkDragMove, elementId: string, container: string): void {
  }



  // Function to handle drag end
  dragEnded(event: any, elementId: string, container: string): void {
    const x = event.dropPoint.x;
    const y = event.dropPoint.y;
    const xx = x - this.eventAreaSizeTopLeft.x;
    let yy = event.dropPoint.y - this.eventAreaSizeTopLeft.y;
  
    // Check if the element was dropped inside the area
    const draggedInsideArea =
      x >= this.eventAreaSizeTopLeft.x &&
      x <= this.eventAreaSizeTopRight.x &&
      y >= this.eventAreaSizeTopLeft.y &&
      y <= this.eventAreaSizeBottomRight.y;
  
    if (draggedInsideArea) {
      // Update the coordinates of the dragged item
      const draggedElement = this.elements.find((e) => e.id === elementId);
        if( container === 'events' && y < this.eventAreaSizeTopLeft.y + this.areaHeight/3){
          //The new coordinates of the events element
          draggedElement.posX = xx;
          draggedElement.posY = yy;

        }else if(container === 'conditions' && y < this.eventAreaSizeTopLeft.y + ((this.areaHeight/3)*2) && y > this.eventAreaSizeTopLeft.y + this.areaHeight/3){
          //The new coordinates of conditions element
          draggedElement.posX = xx;
          draggedElement.posY = yy;

        }else if(container === 'actions' && y > this.eventAreaSizeTopLeft.y + ((this.areaHeight/3)*2)){
          //The new coordinates of actions element
          draggedElement.posX = xx;
          draggedElement.posY = yy;

        }else {
          //if the mouse dragging the element goes outside the corresponding area
          // Retrieve the dragged element to save translate values
          const draggedElementTranslate = this.elementRef.nativeElement.querySelector('#' + elementId);
                
          // Retrieve the computed style of the dragged element
          const computedStyle = window.getComputedStyle(draggedElementTranslate);

          // Retrieve the value of the transform property
          const transformValue = computedStyle.getPropertyValue('transform');

          // Parse the matrix value to extract the translate values
          const matrixRegex = /matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)/;
          const matches = transformValue.match(matrixRegex);

          if (matches && matches.length === 7) {
              // Extract the last two values for translation saving them in translateX and translateY
              this.translateX = parseFloat(matches[5].trim());
              this.translateY = parseFloat(matches[6].trim());
          }
        
          //get the element from its id
          let element = document.getElementById(elementId);
          //which of the three the element dragged is a part of, applying the coords to move the arrows back accordingly
          if(container === 'events'){
            draggedElement.posX = parseInt(element.style.left) + this.translateX + 60 ;
            draggedElement.posY = parseInt(element.style.top) + this.translateY + 30;

          }else if(container === 'conditions'){
            draggedElement.posX = parseInt(element.style.left) + this.translateX +60 ;
            draggedElement.posY = parseInt(element.style.top) + this.translateY + this.areaHeight/3 + 30;

          }else if(container === 'actions'){
            draggedElement.posX = parseInt(element.style.left) + this.translateX + 60 ;
            draggedElement.posY = parseInt(element.style.top) + this.translateY + (this.areaHeight/3)*2 + 30;

          }
      }

    } else {
       //if the mouse dragging the element goes outside the corresponding area
      // Retrieve the dragged element to save translate values
      const draggedElementTranslate = this.elementRef.nativeElement.querySelector('#' + elementId);
                
      // Retrieve the computed style of the dragged element
      const computedStyle = window.getComputedStyle(draggedElementTranslate);

      // Retrieve the value of the transform property
      const transformValue = computedStyle.getPropertyValue('transform');

      // Parse the matrix value to extract the translate values
      const matrixRegex = /matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)/;
      const matches = transformValue.match(matrixRegex);

      if (matches && matches.length === 7) {
          // Extract the last two values for translation saving them in translateX and translateY
          this.translateX = parseFloat(matches[5].trim());
          this.translateY = parseFloat(matches[6].trim());
      }
      //get the element from its id
      let element = document.getElementById(elementId);
      //which of the three the element dragged is a part of, applying the coords to move the arrows back accordingly
      const draggedElement = this.elements.find((e) => e.id === elementId);
      if(container === 'events'){
        draggedElement.posX = parseInt(element.style.left) + this.translateX + 60 ;
        draggedElement.posY = parseInt(element.style.top) + this.translateY + 30;

      }else if(container === 'conditions'){
        draggedElement.posX = parseInt(element.style.left) + this.translateX +60 ;
        draggedElement.posY = parseInt(element.style.top) + this.translateY + this.areaHeight/3 + 30;

      }else if(container === 'actions'){
        draggedElement.posX = parseInt(element.style.left) + this.translateX + 60 ;
        draggedElement.posY = parseInt(element.style.top) + this.translateY + (this.areaHeight/3)*2 + 30;
      }
    }


    // Update arrows connected to the dragged element
    this.updateArrowCoordinatesForElement(elementId);
    //to fix the unwanted click effect for arrows
    setTimeout(() => {
      this.clickedElements=[];
      console.log("Elements :", this.elements)
      console.log("End")
    }, 1);
  }
  
  // Update arrows connected to the dragged element
  updateArrowCoordinatesForElement(elementId: string): void {
    this.arrows.forEach((arrow) => {
        if (arrow.from === elementId) {
            arrow.x1 = this.getArrowX(elementId);
            arrow.y1 = this.getArrowY(elementId);
        } else if (arrow.to === elementId) {
            arrow.x2 = this.getArrowX(elementId);
            arrow.y2 = this.getArrowY(elementId);
        }
    });
  }

  // Function to generate a Serial number (id) for each element added to the area
  generateSerial() {
    'use strict';

    var chars =
        '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        serialLength = 10,
        randomSerial = '',
      i,
      randomNumber;
      
      for (i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length);
        
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
      }
      
      return randomSerial;
  }
    


  //coords values applied to each corner of the eventArea
  updateAreaSizeAndCorners(): void {
    const eventAreaElement = document.getElementById('stackedDivs');
  
    if (eventAreaElement) {
  
      this.eventAreaSizeTopLeft = {
        x: eventAreaElement.offsetLeft + this.xOffset,
        y: eventAreaElement.offsetTop + this.yOffset,
      };
  
      this.eventAreaSizeTopRight = {
        x: this.eventAreaSizeTopLeft.x + this.areaWidth +155,
        y: eventAreaElement.offsetTop + this.yOffset,
      };
  
      this.eventAreaSizeBottomLeft = {
        x: eventAreaElement.offsetLeft + this.xOffset,
        y: eventAreaElement.offsetTop + eventAreaElement.clientHeight + this.yOffset,
      };
  
      this.eventAreaSizeBottomRight = {
        x: eventAreaElement.offsetLeft + eventAreaElement.clientWidth + this.xOffset,
        y: eventAreaElement.offsetTop + eventAreaElement.clientHeight + this.yOffset,
      };
    }
  }

  // Function to clear everything inside the area 
  clearElementsAndArrows(): void {
    this.eventsElements = [];
    this.conditionsElements = [];
    this.actionsElements = [];
    this.elements = [];
    this.arrows = [];
    this.undoHistory = [];

  }

  //function to fill the history for each action done, adding element or arrow
  addActionToHistory(type: 'element' | 'arrow', data: any): void {
    this.undoHistory.push({ type, data });
  }

  // Function to undo the last element or arrow
  undoElementOrArrow(): void {
    // Pop the last action from the history
    const lastAction = this.undoHistory.pop();

    if (lastAction?.type === 'element') {
      // Remove the last added element
      const removedElement = lastAction.data;
      const elementId = removedElement.id;

      // Remove the element from the main elements array
      const elementIndex = this.elements.findIndex(el => el.id === elementId);
      if (elementIndex !== -1) {
          this.elements.splice(elementIndex, 1);
      }

      // Remove the element from eventsElements array
      const eventIndex = this.eventsElements.findIndex(el => el.id === elementId);
      if (eventIndex !== -1) {
          this.eventsElements.splice(eventIndex, 1);
      }

      // Remove the element from conditionsElements array
      const conditionIndex = this.conditionsElements.findIndex(el => el.id === elementId);
      if (conditionIndex !== -1) {
          this.conditionsElements.splice(conditionIndex, 1);
      }

      // Remove the element from actionsElements array
      const actionIndex = this.actionsElements.findIndex(el => el.id === elementId);
      if (actionIndex !== -1) {
          this.actionsElements.splice(actionIndex, 1);
      }
    } else if (lastAction?.type === 'arrow') {
      // Remove the last added arrow
      const removedArrow = lastAction.data;
      const index = this.arrows.findIndex(arrow => arrow === removedArrow);
      if (index !== -1) {
        this.arrows.splice(index, 1);
      }
    }

    console.log("undoHistory = ", this.undoHistory)
  }

  // Function to toggle the arrow activation state
  toggleFunctionActivation() {
    const testButton = document.getElementById('test');
  
    if (this.isFunctionActive === false) {
      this.isFunctionActive = true;
      testButton.style.backgroundColor = 'blue';
      this.clickedElements = [];
    } else {
      this.isFunctionActive = false;
      testButton.style.backgroundColor = 'red';
    }
  }

  //cut function in the context menu
  cutElement(element: any): void{
    //cut is basically copy and delete the element 
    this.copyElement(element);
    this.deleteElement(element);
  }

  //copy function in the context menu
  copyElement(element: any): void{
    // taking the right clicked item's information and saving them in onCopyInformation array
    if(element.category === 'events'){
      this.onCopyInformation = {
        id: element.id,
        icon: element.icon,
        name: element.name,
        category: element.category,
        posX: element.posX,
        posY: element.posY,
        activityName: element.activityName,
        type: element.type
      }
    }else{
      this.onCopyInformation = {
        id: element.id,
        icon: element.icon,
        name: element.name,
        category: element.category,
        posX: element.posX,
        posY: element.posY
      }
    }
  }

  // paste funstion for context menu
  pasteElement(event: MouseEvent, element: any): void{
      const x = event.clientX;
      const y = event.clientY;
      const xx = x - this.eventAreaSizeTopLeft.x + this.resizedX;
      let yy = 0;
      
      //Random serial number given to the element so that it doesn't have the same id as its
      //original 
      let elementId = this.generateSerial();
        
      if (element) {
        //Create the elementDetails
        let elementDetails: any;

        if(element.category === 'events'){
          elementDetails = {
            id: elementId,
            icon: element.icon,
            name: element.name,
            category: element.category,
            posX: x - this.eventAreaSizeTopLeft.x,
            posY: y - this.eventAreaSizeTopLeft.y,
            activityName: element.activityName,
            type: element.type
          };
        }else{
          elementDetails = {
            id: elementId,
            icon: element.icon,
            name: element.name,
            category: element.category,
            posX: x - this.eventAreaSizeTopLeft.x,
            posY: y - this.eventAreaSizeTopLeft.y
          };
        }
    
        //conditions so that the copies are placed in the proper container
        if (element.category === 'events') {
          yy = y - this.eventAreaSizeTopLeft.y - 30 + this.resizedY;

          if(y < this.eventAreaSizeTopLeft.y + this.areaHeight/3){
            // Push the new element into the `elements` array
            console.log("event down paste")
            this.eventsElements.push(elementDetails);
            this.elements.push(elementDetails);

            setTimeout(() => {
              // Places the new created element where the mouse is hovering over
              let elementAdd = document.getElementById(elementId);
              if (elementAdd) {
                elementAdd.style.left = `${xx}px`;
                elementAdd.style.top = `${yy}px`;
                elementAdd.style.display = 'block';
              }
            }, 0);        
            // Save the action to undo history
            this.addActionToHistory('element', { id: elementId });
            
          }else{
            //if they are not placed in events
          }
          
        } else if (element.category === 'conditions') {
          yy = y - this.eventAreaSizeTopLeft.y - 30 + this.resizedY - this.areaHeight/3;

          if(y < this.eventAreaSizeTopLeft.y + ((this.areaHeight/3)*2) && y > this.eventAreaSizeTopLeft.y + this.areaHeight/3){
            // Push the new element into the `elements` array
            console.log("condition down paste")
            this.conditionsElements.push(elementDetails);
            this.elements.push(elementDetails);
            
            setTimeout(() => {
              // Places the new created element where the mouse is hovering over
              let elementAdd = document.getElementById(elementId);
              if (elementAdd) {
                elementAdd.style.left = `${xx}px`;
                elementAdd.style.top = `${yy}px`;
                elementAdd.style.display = 'block';
              }
            }, 0);
            // Save the action to undo history
            this.addActionToHistory('element', { id: elementId });

          }else{
            //if they are not placed in conditions
          }


        } else if (element.category === 'actions') {
          yy = y - this.eventAreaSizeTopLeft.y - 30 + this.resizedY - ((this.areaHeight/3)*2);

          if(y > this.eventAreaSizeTopLeft.y + ((this.areaHeight/3)*2)){
            // Push the new element into the `elements` array
            console.log("action down paste")
            this.actionsElements.push(elementDetails);
            this.elements.push(elementDetails);

            setTimeout(() => {
              // Places the new created element where the mouse is hovering over
              let elementAdd = document.getElementById(elementId);
              if (elementAdd) {
                elementAdd.style.left = `${xx}px`;
                elementAdd.style.top = `${yy}px`;
                elementAdd.style.display = 'block';
              }
            }, 0);
            // Save the action to undo history
            this.addActionToHistory('element', { id: elementId });

          }else{
            //if they are not placed in actions
          }
        }
      }
  }

  //delete function for context menu
  deleteElement(element: any): void{
    // get the right clicked element's information
    let elementDetails = {
      id: element.id,
      icon: element.icon,
      name: element.name,
      category: element.category,
      posX: element.posX,
      posY: element.posY,
    };

    // grab it by its id
    let elementToDelete = document.getElementById(elementDetails.id);
    // delete its shape inside the area
    if (elementToDelete) {
      elementToDelete.style.display = 'none';
    }
    
    //clearing the undoHistory of arrows and elements related to the deleting action
    this.undoHistory = this.undoHistory.filter(item => {
      const itemType = item.type as 'element' | 'arrow';
      //if it's an arrow
      if (itemType === 'arrow') {
        // Keep the arrows that do not have the ID of the deleted element 
        //in their 'from' or 'to'.
        return item.data.from !== elementDetails.id && item.data.to !== elementDetails.id;
      }
      // if the type is arrow, and is not filtered before, it goes through 
      // if an element does not have the id of the element deleted, it goes through
      if (itemType !== 'element' || item.data.id !== elementDetails.id) {
        //if the types are cleared of all conditions, they stay
        return true;
      }
      //types that were out said conditions, get removed
      return false;
    });

    // Remove the element from the elements array using its id
    this.elements = this.elements.filter(e => e.id !== elementDetails.id);
    
    // Remove any arrows associated with the deleted element from the arrows array
    this.arrows = this.arrows.filter(arrow => arrow.from !== elementDetails.id && arrow.to !== elementDetails.id);
  }

  openProperties(element: any): void {
    // save the information of the element event or other
    let elementDetails : any;

    if(element.category === 'events'){
      elementDetails = {
        id: element.id,
        icon: element.icon,
        name: element.name,
        category: element.category,
        posX: element.posX,
        posY: element.posY,
        activityName:element.activityName,
        type: element.type
      };
      console.log("elementDetails openproperties: ", elementDetails)
    }else{
      elementDetails = {
        id: element.id,
        icon: element.icon,
        name: element.name,
        category: element.category,
        posX: element.posX,
        posY: element.posY
      };
    }

    // Open dialog pop up which is the properties component
    const dialogRef = this.dialog.open(PropertiesDialogComponent, {
      //dimension of the dialog pop up
      height: '430px',
      width: '520px',
      //element information sent to the dialog through data
      data: elementDetails,
      //this prevents clicks out of the dialog
      disableClose: true
    });

    // Add event listener to prevent right-clicks while dialog is open
    document.addEventListener('contextmenu', handleContextMenu);
    function handleContextMenu(event: MouseEvent) {
      // Check if the dialog is open
      if (dialogRef && dialogRef.componentInstance) {
        // Prevent the default right-click behavior
        event.preventDefault();
      }
    }
  
    //What happens after closing the dialog
    dialogRef.afterClosed().subscribe(updatedElement => {
      // if an updatedElement is provided
      if (updatedElement) {
        // Update elementDetails with the new information
        elementDetails.id = updatedElement.id;
        elementDetails.icon = updatedElement.icon;
        elementDetails.name = updatedElement.name;
        elementDetails.category = updatedElement.category;
        elementDetails.posX = updatedElement.posX;
        elementDetails.posY = updatedElement.posY;
        elementDetails.activityName = updatedElement.activityName;
        elementDetails.type = updatedElement.type;

        //if activityName is undefined and it's an event, we delete the element upon creation
        if(elementDetails.activityName === undefined && elementDetails.category === 'events'){
          this.deleteElement(elementDetails);
        }

        // Go through the elements array, find the id of the element we need to update
        for (var i = 0; i < this.elements.length; i++) {
          //when found , assign the new name to the respective element 
          if (this.elements[i].id === elementDetails.id) {
            this.elements[i].name = elementDetails.name;
            //and if it is an event, assign its activityName in the elements array
            if( this.elements[i].category === 'events'){
              this.elements[i].activityName = elementDetails.activityName;
              //updating the onRightClickInformation if the user right clicked on 
              //the same element again after finishing its edit
              this.onRightClickInformation = {
                id: elementDetails.id,
                icon: elementDetails.icon,
                name: elementDetails.name,
                category: elementDetails.category,
                posX: elementDetails.posX,
                posY: elementDetails.posY,
                activityName: elementDetails.activityName,
                type: elementDetails.type
              };
            }
            //when the element is found and changes are made, we break out the for loop
            break;
          }
        }
      }
    });
  }
}

//for properties pop up using a component inside a component
// @Component({
//   selector: 'app-element-dialog',
//   template: `
//     <div class="dialog-header">
//       <p class="dialog-title">Properties</p>
//       <p (click)="closeDialog()" class="dialog-close">X</p>
//     </div>

//     <div mat-dialog-content>
//       <div class="input-container">
//         <p class="input-label">BP Activity <br> Name </p>
//         <input [value]="data.name" class="input-custom" #nameInput>
//       </div>
//     </div>

//     <div class="dialog-footer">
//       <button class="save-button" (click)="saveChanges(nameInput.value)">Save</button>
//     </div>
//   `,
//   styles: [`
//     .dialog-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-top : -10px;
//       border-bottom: 1px solid #000;
//       overflow: hidden;
//     }
//     .dialog-title {
//       color: blue;
//       margin-left: 40%;
//       font-size:17px;
//     }
//     .dialog-close {
//       color:blue; 
//       font-size:15px; 
//       cursor: pointer;
//     }

//     .input-container {
//       display: flex;
//       align-items: center;
//       margin-top: 5%;
//       overflow: hidden;
//     }
//     .input-label {
//       margin: 1% 5% 1% 10%;
//       font-weight:500;
//       font-size: 13px
//     }
//     .input-custom {
//       border: none;
//       border-bottom: 1px solid black;
//       outline: none;
//     }
    
//     .dialog-footer {
//       margin-top: 38%;
//       display: flex;
//       justify-content: center;
//       width: 100%;
//       text-align: center;
//       overflow: hidden;
//     }
//     .save-button {
//       font-size: 13px;
//       background-color: white;
//       color: blue;
//       border: 1px solid blue;
//       border-radius: 5px;
//       padding: 5px 15px;
//       cursor: pointer;
//       transition: background-color 0.3s, color 0.3s;
//     }
//     .save-button:hover {
//       background-color: blue;
//       color: white;
//     }

//   `]
// })
// export class ElementDialogComponent {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ElementDialogComponent>) {}
 
//   //for the X close button of the pop up
//   closeDialog(): void {
//     // closes the pop up
//     this.dialogRef.close();
//   }

//   //for the save button
//   saveChanges(newName: string): void {
//     //saving the updated name to the data name
//     this.data.name = newName;
//     //sending it to the after closed pop up section 
//     this.dialogRef.close(this.data);
//   }

// }
//////////////////////////////////////////////////////////////////////////////////
