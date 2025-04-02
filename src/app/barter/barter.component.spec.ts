import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarterComponent } from './barter.component';

describe('BarterComponent', () => {
  let component: BarterComponent;
  let fixture: ComponentFixture<BarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
