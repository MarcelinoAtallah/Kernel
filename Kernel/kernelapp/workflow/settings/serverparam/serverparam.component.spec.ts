import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerparamComponent } from './serverparam.component';

describe('ServerparamComponent', () => {
  let component: ServerparamComponent;
  let fixture: ComponentFixture<ServerparamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerparamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerparamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
