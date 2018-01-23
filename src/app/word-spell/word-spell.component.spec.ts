import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSpellComponent } from './word-spell.component';

describe('WordSpellComponent', () => {
  let component: WordSpellComponent;
  let fixture: ComponentFixture<WordSpellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordSpellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
