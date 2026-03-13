import { EventEmitter } from "events";

class QueueBus extends EventEmitter {
  dispatch(job: string, data: any) {
    this.emit(job, data);
  }
}

export const queueBus = new QueueBus();
