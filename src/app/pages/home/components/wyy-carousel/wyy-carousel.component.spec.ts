import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyyCarouselComponent } from './wyy-carousel.component';

describe('WyyCarouselComponent', () => {
  let component: WyyCarouselComponent;
  let fixture: ComponentFixture<WyyCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyyCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyyCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
