// worker.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private worker: Worker;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    this.worker = new Worker('./app.worker.ts', { type: 'module' });
    //console.log("worker",this.worker)
  }

  performHttpTask(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = ({ data }) => {
        if (data.result) {
          resolve(data.result);
        } else {
          reject(data.error);
        }
      };

      this.worker.postMessage({ action: 'performHttpTask', obj });
    });
  }
}
