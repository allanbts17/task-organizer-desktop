import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Task } from 'src/app/interfaces/task';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-new-task-form',
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.scss'],
})
export class NewTaskFormComponent implements OnInit {
  newTask: Task = {
    tarea: '',
    domingo: 0,
    lunes: 0,
    martes: 0,
    miercoles: 0,
    jueves: 0,
    viernes: 0,
    sabado: 0,
    total: 0
  }

  auxTask: any = {
    tarea: '',
    domingo: undefined,
    lunes: undefined,
    martes: undefined,
    miercoles: undefined,
    jueves: undefined,
    viernes: undefined,
    sabado: undefined,
    total: undefined
  }
  showError = false
  //nsewTask: Task
  constructor(private apiService: ApiService,
    public dialogRef: MatDialogRef<NewTaskFormComponent>,
   ) { }

  ngOnInit() {}

  saveNewTask(){
    if(this.auxTask.tarea === undefined || this.auxTask.tarea === ''){
      this.showError = true
      console.log('de veras ando aqui?');
      return
    }
    this.completeTask()
    console.log(this.newTask)
    this.apiService.createTask(this.newTask)
    .then((newTask) => {
      this.dialogRef.close({newTask: true});
      console.log(newTask);
    });
  }

  taskInput(){
    this.showError = false
  }

  closeModal(){
    this.dialogRef.close();
  }

  completeTask(){
    console.log('hola');
    for(let data in this.auxTask)
      this.newTask[data] = this.auxTask[data] || 0
    let values = Object.values(this.newTask)
    let sum = 0;
    values.forEach(value => {
      if(typeof value == 'number')
        sum += value
    })
    this.newTask.total = sum;
  }

}
