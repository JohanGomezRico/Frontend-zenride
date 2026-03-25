import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioMovimientoComponent } from './inventario-movimiento.component';

describe('InventarioMovimientoComponent', () => {
  let component: InventarioMovimientoComponent;
  let fixture: ComponentFixture<InventarioMovimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioMovimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
