import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryCountDownPage } from './temporary-count-down.page';

describe('TemporaryCountDownPage', () => {
  let component: TemporaryCountDownPage;
  let fixture: ComponentFixture<TemporaryCountDownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporaryCountDownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryCountDownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
