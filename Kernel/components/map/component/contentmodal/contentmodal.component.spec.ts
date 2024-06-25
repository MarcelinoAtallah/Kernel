import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentmodalComponent } from './contentmodal.component';

describe('ContentmodalComponent', () => {
  let component: ContentmodalComponent;
  let fixture: ComponentFixture<ContentmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
