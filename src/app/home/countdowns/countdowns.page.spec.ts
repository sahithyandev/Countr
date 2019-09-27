import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownsPage } from './countdowns.page';

describe('CountdownsPage', () => {
  let component: CountdownsPage;
  let fixture: ComponentFixture<CountdownsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountdownsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
