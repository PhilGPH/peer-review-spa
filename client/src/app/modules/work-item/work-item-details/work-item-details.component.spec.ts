import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkItemDetailsComponent } from './work-item-details.component';

describe('WorkItemDetailsComponent', () => {
  let component: WorkItemDetailsComponent;
  let fixture: ComponentFixture<WorkItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
