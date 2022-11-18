import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { ApiService } from 'src/app/services/api.service';
import { ObservablesService } from 'src/app/services/observables.service';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/interfaces/task';
import { Hour } from 'src/app/interfaces/hour';

interface selArray {
  domingo: boolean,
    lunes: boolean,
    martes: boolean,
    miercoles: boolean,
    jueves: boolean,
    viernes: boolean,
    sabado: boolean
}
@Component({
  selector: 'app-schedule-row',
  templateUrl: './schedule-row.component.html',
  styleUrls: ['./schedule-row.component.scss'],
})

export class ScheduleRowComponent implements OnInit {
  @Input() hour!: Hour
  oldHour!: Hour
  selectArray = {
    domingo: false,
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false
  }
  allSelect = false
  hasChanged = false

  constructor(private obs: ObservablesService,
    private apiService: ApiService) {
    obs.newTask.subscribe((task) => {
      console.log('hellooou')
      this.recivedATask(task)
    })

    obs.clearScheduleSelection.subscribe(() => {
      this.unSelectAll()
    })

    obs.saveScheduleChanges.subscribe(async () => {
      if (this.hasChanged) {
        await apiService.updateHour(this.hour, <string>this.hour.id)
        this.oldHour = Object.assign({}, this.hour)
      }
    })

    obs.clearScheduleSelection.subscribe(() => {
      this.cancelChanges()
    })
  }

  ngOnInit() {
    this.oldHour = Object.assign({}, this.hour)
  }

  cancelChanges() {
    this.unSelectAll()
    if (this.hasChanged) {
      this.hour = Object.assign({}, this.oldHour)
      this.hasChanged = false
    }

  }

  recivedATask(task: any) {
    if (task !== undefined) {
      // entry => [key,value] => [day,selected]
      let entries = Object.entries(this.selectArray)
      entries.forEach((entry) => {
        if (entry[1]) {
          this.hasChanged = true
          this.hour[<keyof Hour>entry[0]] = task.tarea
        }
      })
    } else {
      let entries = Object.entries(this.selectArray)
      entries.forEach(entry => {
        if (entry[1]) {
          this.hasChanged = true
          this.hour[<keyof Hour>entry[0]] = ''
        }
      })
    }
    this.unSelectAll();
  }

  getTaskColor(taskName: string): string {
    return this.apiService.allTasks?.find(tsk => tsk.tarea === taskName)?.color || ''
  }

  format(date: any, pattern: any) {
    return format(new Date(date), pattern)
  }

  // TODO: On production, change mousedown for touchstart
  changeSel(day: string,) {
    this.selectArray[<keyof selArray>day] = !this.selectArray[<keyof selArray>day]
    this.allSelect = false
    // console.log(this.selectArray[day])
  }

  changeAllSel() {
    this.allSelect = !this.allSelect
    for (let day in this.selectArray)
      this.selectArray[<keyof selArray>day] = this.allSelect
  }

  unSelectAll() {
    this.allSelect = false
    for (let day in this.selectArray)
      this.selectArray[<keyof selArray>day] = this.allSelect
  }



}