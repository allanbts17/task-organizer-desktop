import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {
  newTask: Subject<Task|undefined> = new Subject<Task|undefined>();
  clearScheduleSelection: Subject<undefined> = new Subject<undefined>();
  saveScheduleChanges: Subject<undefined> = new Subject<undefined>();
  toogleScheduleCancel = false;
  toogleSave = false
  constructor() { }

  selectNewTask(task?: Task){
    console.log('new task selected',task)
    this.newTask.next(task);
  }

  doClearScheduleSelection(){
    this.clearScheduleSelection.next(undefined)
  }

  doSaveScheduleChanges(){
    this.saveScheduleChanges.next(undefined)
  }

}