import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSideNavOption2Component } from './v-side-nav-option2.component';

describe('VSideNavOption2Component', () => {
  let component: VSideNavOption2Component;
  let fixture: ComponentFixture<VSideNavOption2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSideNavOption2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSideNavOption2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
