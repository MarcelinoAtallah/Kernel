import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceInstancesComponent } from './interface-instances.component';

describe('InterfaceInstancesComponent', () => {
  let component: InterfaceInstancesComponent;
  let fixture: ComponentFixture<InterfaceInstancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceInstancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
