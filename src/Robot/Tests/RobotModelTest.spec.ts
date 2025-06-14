import { TestBed as NgTestBed } from '@angular/core/testing';
import { ROBOT_MODEL, RobotModel, RobotScreen } from '../Models/RobotModel';
import { config } from '../config';
import { Config } from '../Utils/Config';
import { TestBed } from '../Utils/TestBed';
import { SolverResult } from '../Utils/SolverResult';
import * as TestUtils from '../Utils/Test';
import { Node } from '../Utils/Node';

describe('RobotModel', () => {
  let model: RobotModel | null = null;

  beforeEach(() => {
    NgTestBed.configureTestingModule({
      providers: [
        {
          provide: ROBOT_MODEL,
          useValue: new RobotModel(config),
        },
      ],
    });

    model = NgTestBed.inject(ROBOT_MODEL);
  });

  it('debería haberse instanciado el modelo', () => {
    expect(model).toBeTruthy();
  });

  /**
   * Screens
   */

  it('la vista inicial debe ser <MENU>', () => {
    expect(model?.getCurrentScreen()).toBe(RobotScreen.MENU);
  });

  it('debería cambiar la vista a <SETTINGS>', () => {
    model?.goToSettingsScreen();
    expect(model?.getCurrentScreen()).toBe(RobotScreen.SETTINGS);
  });

  it('debería cambiar la vista a <RUNNING>', () => {
    const board = TestUtils.TestBedBoard;
    model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    expect(model?.getCurrentScreen()).toBe(RobotScreen.RUNNING);
  });

  it('debería cambiar la vista a <MENU>', () => {
    model?.goToMenuScreen();
    expect(model?.getCurrentScreen()).toBe(RobotScreen.MENU);
  });

  /**
   * Config
   */

  it('debería obtener la config', () => {
    const config = model?.getConfig();
    expect(config).toBeInstanceOf(Config);
  });

  /**
   * Banco de prueba
   */

  it('debe crearse un banco de pruebas', () => {
    model?.runNewTestBed(config.getMinColumns(), config.getMinRows());
    expect(model?.getTestBed()).toBeInstanceOf(TestBed);
  });

  it('debe crearse un banco de pruebas basado en un tablero pre-configurado', () => {
    const board = TestUtils.TestBedBoard;
    model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    expect(model?.getTestBed().getBoard()).toBe(board);
  });

  it('debe lanzar excepción si ya hay un banco de pruebas', () => {
    const board = TestUtils.TestBedBoard;
    model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    expect(() => {
      model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    }).toThrowError('Ya hay un banco de pruebas en ejecución.');
  });

  it('debe lanzar excepción si la columna es menor al mínimo válido', () => {
    expect(() => {
      model?.runNewTestBed(config.getMinColumns() - 1, config.getMinRows());
    }).toThrowError('Fila o columna fuera de rango');
  });

  it('debe lanzar excepción si la columna es mayor al máximo válido', () => {
    expect(() => {
      model?.runNewTestBed(config.getMaxColumns() + 1, config.getMinRows());
    }).toThrowError('Fila o columna fuera de rango');
  });

  it('debe lanzar excepción si la fila es menor al mínimo válido', () => {
    expect(() => {
      model?.runNewTestBed(config.getMinColumns(), config.getMinRows() - 1);
    }).toThrowError('Fila o columna fuera de rango');
  });

  it('debe lanzar excepción si la fila es mayor al máximo válido', () => {
    expect(() => {
      model?.runNewTestBed(config.getMinColumns(), config.getMaxRows() + 1);
    }).toThrowError('Fila o columna fuera de rango');
  });

  it('debe lanzar excepción si se solicita banco de prueba en curso pero no hay', () => {
    expect(() => {
      model?.getTestBed();
    }).toThrowError('No hay banco de prueba en curso.');
  });

  it('debe obtener un nodo del tablero', () => {
    const board = TestUtils.TestBedBoard;
    model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    expect(
      model?.getNode(board.getColumns() - 1, board.getRows() - 1),
    ).toBeInstanceOf(Node);
  });

  it('debe lanzar excepción si el nodo no existe', () => {
    const board = TestUtils.TestBedBoard;
    model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    expect(() => {
      model?.getNode(board.getColumns(), board.getRows());
    }).toThrowError('Se solicitó un nodo fuera de rango.');
  });

  /**
   * Test de algorítmo BF
   */

  it('debe lanzar excepción si se intenta usar algorítmo BF pero no hay banco de prueba', () => {
    expect(() => {
      model?.resolveWithBruteForce();
    }).toThrowError('No hay banco de prueba en curso.');
  });

  it('debe ejecutar algorítmo de BF y no encontrar solución', () => {
    model?.runNewTestBed(config.getMinColumns(), config.getMinRows());
    model?.resolveWithBruteForce();
    const res = model?.getCurrentSolverResult();
    expect(res?.getSolution()).toBe(null);
  });

  it('debe ejecutar algorítmo de BF y encontrar solución válida', () => {
    const board = TestUtils.TestBedBoard;
    model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    model?.resolveWithBruteForce();
    const res = model?.getCurrentSolverResult();
    expect(res?.getSolution()).toEqual(TestUtils.TestSolution);
  });

  it('debe ser nulo si no se ejecutó el algorítmo de BF', () => {
    expect(model?.getCurrentSolverResult()).toBe(null);
  });

  it('debe tener el resultado de la ultima ejecución de BF', () => {
    const size = TestUtils.getValidRandomColRow();
    model?.runNewTestBed(size[0], size[1]);
    model?.resolveWithBruteForce();
    const res = model?.getCurrentSolverResult();
    expect(res).toBeInstanceOf(SolverResult);
    expect(res?.getName()).toBe('BruteForceAlg');
  });

  /**
   * Test de algorítmo Backtracking
   */

  it('debe lanzar excepción si se intenta usar algorítmo Backtracking pero no hay banco de prueba', () => {
    expect(() => {
      model?.resolveWithBacktracking();
    }).toThrowError('No hay banco de prueba en curso.');
  });

  it('debe ejecutar algorítmo de Backtracking y no encontrar solución', () => {
    model?.runNewTestBed(config.getMinColumns(), config.getMinRows());
    model?.resolveWithBacktracking();
    const res = model?.getCurrentSolverResult();
    expect(res?.getSolution()).toBe(null);
  });

  it('debe ejecutar algorítmo de Backtracking y encontrar solución válida', () => {
    const board = TestUtils.TestBedBoard;
    model?.runNewTestBed(board.getColumns(), board.getRows(), board);
    model?.resolveWithBacktracking();
    const res = model?.getCurrentSolverResult();
    expect(res?.getSolution()).toEqual(TestUtils.TestSolution);
  });

  it('debe ser nulo si no se ejecutó el algorítmo de Backtracking', () => {
    expect(model?.getCurrentSolverResult()).toBe(null);
  });

  it('debe tener el resultado de la ultima ejecución de Backtracking', () => {
    const size = TestUtils.getValidRandomColRow();
    model?.runNewTestBed(size[0], size[1]);
    model?.resolveWithBacktracking();
    const res = model?.getCurrentSolverResult();
    expect(res).toBeInstanceOf(SolverResult);
    expect(res?.getName()).toBe('BacktrackingAlg');
  });
});
