 import { Component, ContentChildren,QueryList, AfterContentInit, Input,} from '@angular/core';
import { TabEmitterService } from 'src/app/Kernel/services/tab-emitter.service';
import { TabComponent } from './v-tab.components';

@Component({
  selector: 'v-tabs-container',
  templateUrl: './v-tabs.component.html',
  styleUrls: ['./v-tabs.component.css'],
})
export class TabsComponent implements AfterContentInit {
  
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> | any;

  constructor(private tabEmitterService: TabEmitterService) {}

  public userId : any;
  public showScreen : boolean ;
  public menuVar : any;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab: { active: any; })=>tab.active);

    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first, true);
    }

  }
  
  selectTab(tab: TabComponent, isFirstTab: boolean){
    if(!isFirstTab) {
      if(tab.parentForm.status != "INVALID") {
        // deactivate all tabs
        this.tabs.toArray().forEach((tab: { active: boolean; }) => tab.active = false);
        
        // activate the tab the user has clicked on.
        tab.active = true;
        this.tabEmitterService.onTabClickFn();
      }
    } else {
      // deactivate all tabs
      this.tabs.toArray().forEach((tab: { active: boolean; }) => tab.active = false);
        
      // activate the tab the user has clicked on.
      tab.active = true;
      this.tabEmitterService.onTabClickFn();
    }
  }

  
}
