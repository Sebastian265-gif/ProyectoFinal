import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchIdBookComponent } from './search-id-book.component';

describe('SearchIdBookComponent', () => {
  let component: SearchIdBookComponent;
  let fixture: ComponentFixture<SearchIdBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchIdBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchIdBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
