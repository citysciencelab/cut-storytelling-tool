/**
 * @description Handles the batch processing in parallel tasks and returns the results.
 * @class RoutingTaskHandler
 */
export class RoutingTaskHandler {
    /**
     * creates new RoutingTaskHandler
     * @param {Function[]} tasks array of functions which returns a new promise with a task as body.
     * @param {Number} concurrentCount of tasks which are allowed to run in parallel.
     * @param {Function} addNewResult function to execute after completion of one task to save the result.
     * @param {Function} executeAfterCompletion function to execute after completion of all tasks.
     */
    constructor (tasks, concurrentCount, addNewResult, executeAfterCompletion) {
        this.total = tasks.length;
        this.todo = tasks;
        this.running = [];
        this.complete = [];
        this.promiseResults = [];
        this.count = concurrentCount;
        this.cancel = false;
        this.canceled = false;
        this.progress = 0;
        this.addNewResult = addNewResult;
        this.executeAfterCompletion = executeAfterCompletion;
        this.run();
    }

    /**
     * Checks if all tasks are complete.
     * @returns {Boolean} true if all tasks are complete.
     */
    isDone () {
        return this.total === this.complete.length;
    }

    /**
     * Cancels the remaining tasks on the next iteration.
     * @returns {void}
     */
    cancelRun () {
        this.cancel = true;
    }

    /**
     * Checks if tasks are remaining.
     * @returns {Boolean} true if tasks are remaining.
     */
    runNext () {
        return (this.running.length < this.count) && this.todo.length;
    }

    /**
     * Starts tasks for the remaining open parallel spots.
     * @returns {void} Tasks Results
     */
    run () {
        if (this.canceled) {
            return;
        }
        if (this.cancel) {
            this.canceled = true;
            this.executeAfterCompletion(null);
            return;
        }
        while (this.runNext()) {
            const promise = this.todo.shift()();

            promise.then((promiseResult) => {
                this.progress = Number((((this.complete.length + 1) / this.total) * 100).toFixed(2));
                this.complete.push(this.running.shift());
                this.addNewResult(this.promiseResults, promiseResult);
                this.run();
            });
            this.running.push(promise);
        }
        if (this.isDone()) {
            this.executeAfterCompletion(this.promiseResults);
        }
    }
}
