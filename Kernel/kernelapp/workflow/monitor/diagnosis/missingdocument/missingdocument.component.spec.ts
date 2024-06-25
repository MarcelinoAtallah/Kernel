import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingdocumentComponent } from './missingdocument.component';

describe('MissingdocumentComponent', () => {
  let component: MissingdocumentComponent;
  let fixture: ComponentFixture<MissingdocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingdocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
