import Router from 'koa-router'
import {
  ADD_TASK,
  CHANGE_TASKS_STATUSES,
  CLEAR_COMPLETED_TASKS,
  DELETE_TASK,
  EDIT_TASK,
  GET_COUNTERS,
  GET_TASKS
} from '../constants/endpoints'
import { addTask } from './todos_controllers/addTask'
import { clearCompletedTasks } from './todos_controllers/clearCompletedTasks'
import { editTask } from './todos_controllers/editTask'
import { getAllTodos } from './todos_controllers/getAllTodos'
import { getTodosCounters } from './todos_controllers/getTodosCounters'
import { removeTask } from './todos_controllers/removeTask'
import { toggleTodosStatuses } from './todos_controllers/toggleTodosStatuses'

const todosRouter = new Router().prefix('/')

todosRouter.get(GET_TASKS, getAllTodos)

todosRouter.get(GET_COUNTERS, getTodosCounters)

todosRouter.post(ADD_TASK, addTask)

todosRouter.delete(DELETE_TASK, removeTask)

todosRouter.delete(CLEAR_COMPLETED_TASKS, clearCompletedTasks)

todosRouter.put(EDIT_TASK, editTask)

todosRouter.put(CHANGE_TASKS_STATUSES, toggleTodosStatuses)

export default todosRouter.routes()
