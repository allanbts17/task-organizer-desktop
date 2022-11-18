import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { Hour } from '../interfaces/hour';
import { Observable, Subject } from 'rxjs';
import { collection, doc, getDocs, setDoc, getFirestore, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

const TASKS = 'Tasks';
const SCHEDULE = 'Schedule';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private tasksCollection!: AngularFirestoreCollection<Task>;
  private scheduleCollection!: AngularFirestoreCollection<Hour>;
  tasks!: Observable<Task[]>;
  hours!: Observable<Hour[]>;

  allTasks!: Task[];
  allHours!: Hour[];
  tasksObs: Subject<any> = new Subject<any>();
  hoursObs: Subject<any> = new Subject<any>();;

  constructor(private afs: AngularFirestore) {
  }

  public initSchedule(){
    this.scheduleCollection = this.afs.collection<Hour>(SCHEDULE);
    this.hours = this.scheduleCollection.valueChanges();
    this.hours.subscribe(res => {
      this.hoursObs.next(res);
      console.log('change detected', res)
    })
  }

  public initTasks(){
    if(this.allTasks !== undefined) return this.allTasks;
    this.tasksCollection = this.afs.collection<Task>(TASKS);
    this.tasks = this.tasksCollection.valueChanges();
    this.tasks.subscribe(res => {
      this.allTasks = res;
      this.tasksObs.next(res);
      console.log('change datected', res)
    });
  }

  public generateID(length: number = 21) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /*async getAllTasks() {
    let taskArr = [];
    const querySnapshot = await this.afs.collection(TASKS).get().toPromise()
    querySnapshot.forEach((doc: any) => {
      taskArr.push(doc.data())
    });
    this.allTasks = taskArr;
    this.tasksObs.next(taskArr);
    return taskArr;
  }*/

  async getTask(id: string) {
    const querySnapshot = await this.afs.collection(TASKS).doc(id).get().toPromise()
    return querySnapshot?.data();
  }

  async createTask(task: Task) {
    const ID = this.generateID()
    const docRef = this.tasksCollection.doc(ID)
    return await docRef.set({id: ID, ...task})
  }

  async updateTask(data: any, id: string) {
    const docRef = await this.tasksCollection.doc(id).update(data)// doc(collection(getFirestore(), TASKS));
    return docRef//updateDoc(docRef,data);
  }

  async deleteTask(id: string) {
    const docRef = await this.tasksCollection.doc(id).delete()
    return docRef
  }

  async getHour(id: string) {
    const querySnapshot = await this.afs.collection(SCHEDULE).doc(id).get().toPromise()
    return querySnapshot?.data();
  }

  async createHour(hour: Hour) {
    const ID = this.generateID()
    const docRef = this.scheduleCollection.doc(ID)
    return await docRef.set({id: ID, ...hour})
  }

  async updateHour(data: any, id: string) {
    const docRef = await this.scheduleCollection.doc(id).update(data)
    return docRef//await updateDoc(docRef,data);
  }

  async deleteHour(id: string) {
    const docRef = await this.scheduleCollection.doc(id).delete()
    return docRef//await deleteDoc(doc(getFirestore(), SCHEDULE, id));
  }


}