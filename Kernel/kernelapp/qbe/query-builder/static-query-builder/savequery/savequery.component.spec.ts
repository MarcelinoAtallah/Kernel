import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavequeryComponent } from './savequery.component';

describe('SavequeryComponent', () => {
  let component: SavequeryComponent;
  let fixture: ComponentFixture<SavequeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavequeryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavequeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
