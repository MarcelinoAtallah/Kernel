import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticQueryBuilderComponent } from './static-query-builder.component';

describe('StaticQueryBuilderComponent', () => {
  let component: StaticQueryBuilderComponent;
  let fixture: ComponentFixture<StaticQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
