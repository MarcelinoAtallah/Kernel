import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VHighchartsStocksComponent } from './v-highcharts-stocks.component';


describe('VHighchartsStocksComponent', () => {
  let component: VHighchartsStocksComponent;
  let fixture: ComponentFixture<VHighchartsStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHighchartsStocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHighchartsStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
