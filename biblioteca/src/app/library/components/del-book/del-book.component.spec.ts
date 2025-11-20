import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelBookComponent } from './del-book.component';

describe('DelBookComponent', () => {
  let component: DelBookComponent;
  let fixture: ComponentFixture<DelBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
