import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() content: string;

  constructor() { }

  ngOnInit(): void {
    this.closePopup()
  }
  closePopup(){
    $('#moreInfo').addClass('hide');
    $('.popup-overlay').addClass('hide');

  }

  openPopup(){
    $('#moreInfo').removeClass('hide');
    $('.popup-overlay').removeClass('hide');

  }
}
