export class BackgroundTaskQueue {
  private tasks: Array<() => Promise<void>> = [];

  addTask(task: () => Promise<void>) {
    this.tasks.push(task);
    this.processTasks();
  }

  private async processTasks() {
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error('Error processing background task:', error);
        }
      }
    }
  }
}
