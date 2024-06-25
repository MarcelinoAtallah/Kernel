import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VDynamicRuleBuilderComponent } from './v-dynamic-rule-builder.component';

describe('VDynamicRuleBuilderComponent', () => {
  let component: VDynamicRuleBuilderComponent;
  let fixture: ComponentFixture<VDynamicRuleBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VDynamicRuleBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VDynamicRuleBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
