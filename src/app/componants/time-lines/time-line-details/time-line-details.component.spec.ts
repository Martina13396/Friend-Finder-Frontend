import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineDetailsComponent } from './time-line-details.component';

describe('TimeLineDetailsComponent', () => {
  let component: TimeLineDetailsComponent;
  let fixture: ComponentFixture<TimeLineDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeLineDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
