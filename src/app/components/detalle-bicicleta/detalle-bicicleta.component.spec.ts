import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBicicletaComponent } from './detalle-bicicleta.component';

describe('DetalleBicicletaComponent', () => {
  let component: DetalleBicicletaComponent;
  let fixture: ComponentFixture<DetalleBicicletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleBicicletaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleBicicletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
