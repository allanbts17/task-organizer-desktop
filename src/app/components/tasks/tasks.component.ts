import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';
import { ApiService } from 'src/app/services/api.service';
//import  map   from 'underscore/modules/map.js'
import { map, omit } from 'underscore';
import { NewTaskFormComponent } from '../new-task-form/new-task-form.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks = []
  auxTasks = []
  toogleEdit = false
  canErase = false
  activeHours = 16
  hoursLeft = {
    domingo: this.activeHours,
    lunes: this.activeHours,
    martes: this.activeHours,
    miercoles: this.activeHours,
    jueves: this.activeHours,
    viernes: this.activeHours,
    sabado: this.activeHours,
  }
  taskCount = 0
  displayedColumns: string[] = ['Tarea', 'Domingo', 'Lunes', 'Martes','Miercoles','Jueves','Viernes','Sabado','Total'];
  constructor(private apiService: ApiService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.subscribeToTasks()
  }

  subscribeToTasks() {
    const incomingTasks = (data) => {
      if(data === undefined) return;
      this.auxTasks = data
      this.auxTasks.forEach((task) => {
        task.selected = false
      })
      this.tasks = this.deepCopy(this.auxTasks)
      this.updateHoursLeft()
      console.log(this.tasks);
    }
    incomingTasks(this.apiService.initTasks())
    this.apiService.tasksObs.subscribe(data => {
      incomingTasks(data)
    })
  }

  completeTasksData(){
    return [...this.tasks,{
      tarea: 'Restante',
      ...this.hoursLeft,
      total: `Max ${this.activeHours}`
    }]
  }
  filterProperty(data: Task[]){
    let arr = []
    const filter = (data: Task) => {
      let newObj = Object.assign({},data)
      delete newObj.selected
      delete newObj.color
      delete newObj.id
      return newObj
    }

    for(let tsk of data){
      arr.push(filter(tsk))
    }
    console.log(arr);
    return arr
    
  }

  async presentModal() {

    let dialogRef = this.dialog.open(NewTaskFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result?.newTask == true) {
        // this.getAllTasks()
      }
    });
  }

  async deleteTaskAlert(id) {
    /*const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar tarea',
      message: '¿Seguro que quieres eliminar esta tarea?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.deleteTask(id)
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();*/
  }

  eraseTask() {

  }

  enableErase() {
    this.toogleEdit = false
    this.canErase = !this.canErase
    if (!this.canErase)
      this.tasks.forEach(task => task.selected = false)
  }

  updateTotal(id) {
    //console.log('called')
    let ind = this.tasks.findIndex((tsk)=> tsk.id === id)
    this.tasks[ind].total = 0
    let sum = 0
    const values = Object.values(this.tasks[ind]);
    values.forEach(value => {
      if (typeof value == 'number')
        sum += value
    })
    //console.log(sum)
    //console.log(values)
    this.tasks[id].total = sum
    setTimeout(() => this.updateHoursLeft(), 200)
  }

  private setHoursSum(day) {
    let sum = 0
    this.tasks.forEach(task => {
      sum += task[day]
    })
    return sum
  }

  updateHoursLeft() {
    for (let day in this.hoursLeft) {
      this.hoursLeft[day] = this.activeHours - this.setHoursSum(day)
    }
  }

  selectTask(i) {
    let selected = this.tasks[i].selected
    this.tasks.forEach(task => task.selected = false)
    this.tasks[i].selected = true
    if (selected)
      this.deleteTaskAlert(this.tasks[i].id)
  }

  unselectAll() {
    this.tasks.forEach(task => task.selected = false)
  }

  unselectTask(i) {
    console.log('blured')
    this.tasks[i].selected = false
  }

  cancelEdit() {
    this.tasks = this.deepCopy(this.auxTasks)
    this.updateHoursLeft()
    this.toogleEdit = false
  }

  deepCopy(array) {
    return JSON.parse(JSON.stringify(array))
  }

  async updateTask(task) {
    let newTask = omit(task, ['selected'])
    //console.log('new',newTask)
    await this.apiService.updateTask(task, task.id)
  }

  async updateAllTasks() {
    for (let task of this.tasks) {
      await this.updateTask(task)
    }
    this.toogleEdit = false
    //this.tasks.forEach(task => this.updateTask(task))
  }

  deleteTask(id: string) {
    console.log(id, typeof id)
    this.tasks = this.deepCopy(this.tasks.filter(task => task.id != id))
    this.apiService.deleteTask(id)
      .then((data) => {
        // this.getAllTasks();
        console.log(data);
      });
  }

}