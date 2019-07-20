import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCountdownPage } from './share-countdown.page';

describe('ShareCountdownPage', () => {
  let component: ShareCountdownPage;
  let fixture: ComponentFixture<ShareCountdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareCountdownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCountdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
