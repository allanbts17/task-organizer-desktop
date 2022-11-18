export interface Task {
  id?: string;
  tarea: string;
  domingo: number;
  lunes: number;
  martes: number;
  miercoles: number;
  jueves: number;
  viernes: number;
  sabado: number;
  total?: number;
  selected?: boolean;
  color?: string;
}