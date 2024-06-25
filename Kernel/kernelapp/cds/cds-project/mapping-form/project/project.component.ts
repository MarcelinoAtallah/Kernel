import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { Route, Router } from '@angular/router';

declare let alertify: any;
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  public agColumn: AgColumns[] = [];
  public agColumnsJson: any;

  public getProjectApi = GlobalConstants.fetchProjectApi;

  public agGridSelectedNodes: any = '';

  @ViewChild('addContent') addContent: any;
  @ViewChild('updateContent') updateContent: any;
  subsVar: Subscription;

  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Project Id',
        field: 'id',
        filter: 'agTextColumnFilter',
        sortable: true,
      },

      {
        headerName: 'Project Name',
        field: 'projectName',
        filter: 'agTextColumnFilter',
        sortable: true,
        isLink: true,
        link: '/cds/mainProject/form/update/',
        linkParameters: 'id',
      },
    ];
    this.agColumn.push(this.agColumnsJson);

    this.eventEmitterService.onAddClick.subscribe(() => {
      this.commonFunctions.navigateToPage('/cds/mainProject/form/create/-1');
    });
    this.subsVar = this.eventEmitterService.onUpdateClick.subscribe(() => {
      this.agGridSelectedNodes = localStorage.getItem('agGidSelectedNode');
      if (this.agGridSelectedNodes == '') {
        this.commonFunctions.alert("alert", 'Please select a row');
      } else {
        this.commonFunctions.navigateToPage('/cds/mainProject/form/update/' + localStorage.getItem('agGidSelectedNode'));
      }
    });
    this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {
      this.onDeleteClick();
    });
  }

  ngOnDestroy() {
    if (this.subsVar) {
      this.subsVar.unsubscribe();
    }
  }
  onDeleteClick() {
    this.agGridSelectedNodes = localStorage.getItem('agGidSelectedNode');
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", 'Please select a row to delete');
    } else {
      if (selectedNodes.indexOf(',') != -1) {
        selectedNodes = selectedNodes.split(',');
        for (let i = 0; i < selectedNodes.length; i++) {
          this.http
            .delete<any>(GlobalConstants.deletProjectApi + selectedNodes[i], {
              headers: GlobalConstants.headers,
            })
            .subscribe(
              (res) => {
                //console.log(res);
                this.commonFunctions.reloadPage('/cds/mainProject');
              },
              (error) => {
                //console.log(error);
              }
            );
        }
      } else {
        this.http
          .delete<any>(GlobalConstants.deletProjectApi + selectedNodes, {
            headers: GlobalConstants.headers,
          })
          .subscribe(
            (res) => {
              //console.log(res);
              this.commonFunctions.reloadPage('/cds/mainProject');
            },
            (error) => {
              //console.log(error);
            }
          );
      }
    }
  }
  }

