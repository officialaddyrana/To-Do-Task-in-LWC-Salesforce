import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/ToDoListController.getTasks';
import { refreshApex } from '@salesforce/apex';
import insertTask from '@salesforce/apex/ToDoListController.insertTask';
import deleteTask from '@salesforce/apex/ToDoListController.deleteTask';

export default class Todo extends LightningElement {

   
    @track
    todoTasks = [];

    todoTasksResponse;

    
    processing = true;

    
    newTask = '';

    
    updateNewTask(event) {
        this.newTask = event.target.value;
    }

    
    addTaskToList(event) {

        if(this.newTask=='') {
            return;
        }

       
        this.processing =  true;

        insertTask({ subject: this.newTask })
        .then(result => {
            console.log(result);
            this.todoTasks.push({
                id: this.todoTasks[this.todoTasks.length - 1] ? this.todoTasks[this.todoTasks.length - 1].id + 1 : 0,
                name: this.newTask,
                recordId: result.Id
            });
            this.newTask = '';
            console.log(JSON.stringify(this.todoTasks));
        })
        .catch(error => console.log(error))
        .finally(() => this.processing = false);
    }

    
    deleteTaskFromList(event) {

        let idToDelete = event.target.name;
        let todoTasks = this.todoTasks;
        let todoTaskIndex;
        let recordIdToDelete;

       
        this.processing = true;

        
        for(let i=0; i<todoTasks.length; i++) {
            if(idToDelete === todoTasks[i].id) {
                todoTaskIndex = i;
            }
        }

        recordIdToDelete = todoTasks[todoTaskIndex].recordId;

        deleteTask({ recordId: recordIdToDelete })
        .then(result => {
            console.log(result);
            if(result) {
                todoTasks.splice(todoTaskIndex, 1);
            } else {
                console.log('Unable to delete task');
            }
            console.log(JSON.stringify(this.todoTasks));
        })
        .catch(error => console.log(error))
        .finally(() => this.processing = false);
       
    }

   
    @wire(getTasks)
    getTodoTasks(response) {
        this.todoTasksResponse = response;
        let data = response.data;
        let error = response.error;

        
        if(data || error) {
            this.processing = false;
        }

        if(data) {
            console.log('data');
            console.log(data);
            this.todoTasks = [];
            data.forEach(task => {
                this.todoTasks.push({
                    id: this.todoTasks.length + 1,
                    name: task.Subject,
                    recordId: task.Id
                });
            });
        } else if(error) {
            console.log('error');
            console.log(error);
       }
    }


    refreshTodoList() {
        
        this.processing = true;
       
        refreshApex(this.todoTasksResponse)
        .finally(() => this.processing = false);
        
    }

}
