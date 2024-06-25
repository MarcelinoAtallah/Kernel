import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalqueriesComponent } from './historicalqueries.component';

describe('HistoricalqueriesComponent', () => {
  let component: HistoricalqueriesComponent;
  let fixture: ComponentFixture<HistoricalqueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalqueriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalqueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
