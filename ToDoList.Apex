public with sharing class ToDoListController {
        @AuraEnabled(cacheable=true)
        public static List<Task> getTasks(){
            List<Task> TaskList =[SELECT Subject from Task where OwnerId =: Userinfo.getUserId()];
            return TaskList;
        }
        @AuraEnabled
        public static Boolean deleteTask(Id recordId) {
            try {
                Database.delete(recordId);
                return true;
            } catch(Exception e) {
                System.debug(e.getMessage());
            }
            return false;
        }
        @AuraEnabled
        public static Task insertTask(String subject) {
            try {
                Task task = new Task(
                    Subject = subject,
                    OwnerId = UserInfo.getUserId(),
                    Status = 'Not Started',
                    Priority = 'Normal'
                );
                insert task;
                return task;
            } catch(Exception e) {
                System.debug(e.getMessage());
            }
            return null;
        }
}
