import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationInstancesComponent } from './integration-instances.component';

describe('IntegrationInstancesComponent', () => {
  let component: IntegrationInstancesComponent;
  let fixture: ComponentFixture<IntegrationInstancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationInstancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
