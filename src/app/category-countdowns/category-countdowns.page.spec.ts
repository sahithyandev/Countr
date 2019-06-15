import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCountdownsPage } from './category-countdowns.page';

describe('CategoryCountdownsPage', () => {
  let component: CategoryCountdownsPage;
  let fixture: ComponentFixture<CategoryCountdownsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryCountdownsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCountdownsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
