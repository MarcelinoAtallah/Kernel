import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkProcedureComponent } from './link-procedure.component';

describe('LinkProcedureComponent', () => {
  let component: LinkProcedureComponent;
  let fixture: ComponentFixture<LinkProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkProcedureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
