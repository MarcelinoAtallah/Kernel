import { Component, ContentChildren, QueryList, AfterContentInit, Input, EventEmitter, Output, ViewChild, ElementRef, OnInit, } from '@angular/core';
import { TabComponent } from './v-tab.components';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { DataService } from 'src/app/Kernel/services/data.service';
import { runInThisContext } from 'vm';
import { InformationService } from 'src/app/Kernel/services/information.service';

// import { ModifyTabComponent } from 'src/app/Kernel/in-display/modify-tab/modify-tab.component';


@Component({
  selector: 'v-tabs-container',
  templateUrl: './v-tabs.component.html',
  styleUrls: ['./v-tabs.component.css'],
})
export class TabsComponent implements AfterContentInit,OnInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> | any;
  @Output() tabActionClick: EventEmitter<any> = new EventEmitter;
  @ViewChild('contextMenu') contextMenu: ElementRef;

  constructor(public commonFunctions: CommonFunctions,
              private eventEmitterService: EventEmitterService,
              public dataservice: DataService,
              public informationservice: InformationService
            )  {}
  ngOnInit(): void {
    console.log("loading --> TabsComponent")
  }

    public userId: any;
    public showScreen: boolean;
    public menuVar: any;
    public showContextMenu: boolean = false;
    public containerAdded: any
    public tabselected: any;
    public navId: string = "navId_"+Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

  // contentChildren are set
  ngAfterContentInit() {
    setTimeout(() => {
      // get all active tabs
      let activeTabs = this.tabs.filter((tab: { active: any; }) => tab.active);

      if (this.informationservice.getChoosenTab() != "" && this.informationservice.getChoosenTab() != null && this.informationservice.getChoosenTab() != undefined) {
        let tabArray = this.tabs._results;
        let data = tabArray.filter((el: any) => {

          return el.tabId === "tabId_" + this.informationservice.getChoosenTab();
        });
        let tab: any = data;
        this.selectTab(tab, 1);
        // localStorage.removeItem("choosenTab");
        this.informationservice.removeChoosenTab();

      } else {
        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
          this.selectTab(this.tabs.first, 0);
        }
      }
    }, 700);

    setTimeout(() => {
      for (let i = 0; i < this.tabs._results.length; i++) {
        if (this.tabs._results[i].isForIndisplayModify != 0 || this.tabs._results[i].isForIndisplayDelete != 0) {
          let contextMenuHeight = "30px";
          let tab = this.tabs._results[i];

          // Create a container element and add the necessary attributes
          this.containerAdded = document.createElement('div');
          this.containerAdded.classList.add('context-menu');
          this.containerAdded.classList.add('hidden');
          this.containerAdded.id = "context_" + tab.tabId;
          this.tabselected = document.querySelector("#" + tab.tabId);

          // Create a <ul> element
          const ul = document.createElement('ul');
          ul.classList.add("context-menu-body");
          // Create the 'Modify' button and add a click event listener
          if (tab.isForIndisplayModify == 1) {
            const modifyButton = document.createElement('span');
            modifyButton.id = "modify_" + tab.tabId;
            modifyButton.append('Modify');
            modifyButton.addEventListener('click', () => {
              this.onTabSettingBtnClick(tab.title);
            });
            ul.appendChild(modifyButton);
          }

          if (tab.isForIndisplayModify == 1 && tab.isForIndisplayDelete == 1) {
            const br = document.createElement('br');
            ul.appendChild(br);
            contextMenuHeight = "55px";
          }

          // Create the 'Delete' button and add a click event listener
          if (tab.isForIndisplayDelete == 1) {
            const deleteButton = document.createElement('span');
            deleteButton.id = "delete_" + tab.tabId;
            deleteButton.append('Delete');
            deleteButton.addEventListener('click', () => {
              this.onTabDeleteBtnClick(tab.title);
            });
            ul.appendChild(deleteButton);
          }

          // Append the <ul> to the container
          this.containerAdded.appendChild(ul);

          // Append the container to the DOM
          $("#" + tab.tabId).append(this.containerAdded);

          if ($("#modify_" + tab.tabId)) {
            $("#modify_" + tab.tabId).css({ "cursor": "pointer", "font-size": "12px" });
          }

          if ($("#delete_" + tab.tabId)) {
            $("#delete_" + tab.tabId).css({ "cursor": "pointer", "font-size": "12px" });
          }

          $("#context_" + tab.tabId).css({
            "background-color": "var(--white-color",
            "color": "var(--black-color)",
            "position": "absolute",
            "width": "100%",
            "top": "30px",
            "left": "0px",
            "z-index": "9999999999999999",
            "border-radius": "1px",
            "border": "1px solid white",
            "height": "" + contextMenuHeight + ""
          });
        }
      }
    }, 400)

    setTimeout(()=>{
      $("#"+this.navId+" .nav-tab .tab").addClass("animate__animated");
      $("#"+this.navId+" .nav-tab .tab").addClass("animate__fadeIn");

      let tabLength = this.tabs._results.length;
      if (tabLength > 6) {
        $("#"+this.navId).css({ "display": "flex", "flex-direction": "column", "overflow-x": "auto", "height": "100px", "border": "0" });
      } else {
        $("#"+this.navId).css({ "display": "flex", "flex-direction": "row", "overflow-x": "auto","overflow-y": "hidden", "height": "50px", "border": "0" });
      }

      $("#"+this.navId).show();
    }, 1100)
  }

  selectTab(tab: TabComponent, isFromClosedScreen: number) {
    if (!tab.disabled) {
      if (isFromClosedScreen == 0) {
        // deactivate all tabs
        this.tabs.toArray().forEach((tab: { active: boolean; }) => tab.active = false);

        if (tab.isForIndisplayModify == 1 || tab.isForIndisplayDelete == 1) {
          $(".context-menu").addClass("hidden");
          $("#context_" + tab.tabId).removeClass("hidden");
        }
        

        if(this.informationservice.getClickedTab()==null){
        this.informationservice.setClickedTab(tab.title);
        }
        this.informationservice.setPreviousTabIdSelected(this.informationservice.getSelectedTabId())
        // activate the tab the user has clicked on.
        tab.active = true;
        this.informationservice.setSelectedTabName(tab.title);
        this.informationservice.setSelectedTabId(tab.tabId);

        if(this.informationservice.getTabpath() && this.informationservice.getTabpath().trim() !== ''){

          let tabJson=JSON.parse(this.informationservice.getTabpath());

           let tabObject = {
            "tabTitle": tab.title,
            "tabData": '',
            "tabIndex": ''
          };
          tabJson.push(tabObject);

          this.informationservice.setTabpath(JSON.stringify(tabJson));

        }else{
          let tabJson:any[]=[];
           let tabObject = {
            "tabTitle": tab.title,
            "tabData": ' ',
            "tabIndex": ' '
          };
          tabJson.push(tabObject);

          this.informationservice.setTabpath(JSON.stringify(tabJson));
        }
        
      } else {
        let selectedTab: any = tab;
        if (tab.isForIndisplayModify == 1 || tab.isForIndisplayDelete == 1) {
          $(".context-menu").addClass("hidden");
          $("#context_" + selectedTab[0].tabId).removeClass("hidden");
        }

        // activate the tab the user has clicked on.
        selectedTab[0].active = true;
        this.informationservice.setSelectedTabName(selectedTab[0].title);
        
        this.informationservice.setSelectedTabId(selectedTab[0].tabId);
      }
      this.eventEmitterService.onTabActionClickFn();
      // this.tabActionClick.emit();
    }else{
      return
    }

  }

  onTabSettingBtnClick(value: any) {
    this.informationservice.setSelectedTabName(value);
    this.eventEmitterService.onTabSettingBtnClickFn();
  }

  onTabDeleteBtnClick(value: any) {
    let text = "Are you sure you want to delete ?";
    if (confirm(text) == true) {
      this.informationservice.setSelectedTabName(value);

      this.eventEmitterService.onTabDeleteBtnClickFn();
    } else {
      return;
    }
  }

  disableContextMenu(event: MouseEvent, tab: TabComponent) {
    event.preventDefault(); // Prevent the default right-click context menu
    this.showContextMenu = true;
    $(".context-menu").addClass("hidden");
    $("#context_" + tab.tabId).toggleClass("hidden");
  }

}
