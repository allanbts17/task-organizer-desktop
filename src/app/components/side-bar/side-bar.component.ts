import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { ApiService } from 'src/app/services/api.service';
import { ObservablesService } from 'src/app/services/observables.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  @Output() taskSelected = new EventEmitter<Task>()
  colorList = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose'
  ]
  constructor(public apiService: ApiService, public obs: ObservablesService) { }

  ngOnInit() {
    this.colorList = this.getShuffledArr(this.colorList)
    this.subscribeToTasks()
  }

  getShuffledArr (arr: Array<any>){
    return [...arr].map( (_, i, arrCopy) => {
        var rand = i + ( Math.floor( Math.random() * (arrCopy.length - i) ) );
        [arrCopy[rand], arrCopy[i]] = [arrCopy[i], arrCopy[rand]]
        return arrCopy[i]
    })
}

  async fillColors(){
    let colors = <any>Object.assign([],this.colorList)
    // First remove used colors
    for(const ind in this.apiService.allTasks){
      if(this.apiService.allTasks[ind].color !== undefined){
        colors = this.removeItemOnce(colors,this.apiService.allTasks[ind].color)
      }
    }
    let clearedColors = Object.assign([],colors)

    for(const ind in this.apiService.allTasks){
      let color = colors.pop()
      if(color === undefined){
        colors = Object.assign({},clearedColors)
        color = colors.pop()
      }
      if(this.apiService.allTasks[ind].color === undefined){
        let id =  this.apiService.allTasks[ind].id
        this.apiService.updateTask({ color: `bg-${color}-500`},<string>id)
      }
    }
  }

  removeItemOnce(arr: Array<any>, value: any) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  subscribeToTasks() {
    const incomingTasks = (data: any) => {
      if(data === undefined) return;
      this.fillColors()
    }
    incomingTasks(this.apiService.initTasks())
    this.apiService.tasksObs.subscribe(data => {
      incomingTasks(data)
    })
  }

}