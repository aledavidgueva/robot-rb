import { TestBed } from '@angular/core/testing';
import { RobotModule } from '../RobotModule';
import { RobotView } from '../Views/RobotView';

describe('RobotModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotModule],
    }).compileComponents();
  });

  it('Debe haberse creado la vista principal', () => {
    const fixture = TestBed.createComponent(RobotView);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
