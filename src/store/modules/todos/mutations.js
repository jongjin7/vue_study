import Vue from "vue";
import * as todos from "./types";
import { filterType } from "../../../common/Constant";

export default {
  [todos.ADD_ITEM](state, newItem) {
    let newTodoItem = {id:state.items.length, ...newItem};
    state.items.push(newTodoItem);
  },
  // addItem(state, newItem) {
  //   state.items.push(newItem);
  // },

  [todos.TO_DONE](state, todo) {
    state.items.forEach((item)=> {
      if (todo.id === item.id) {
        item.isDone = !todo.isDone;
      }
    })
  },

  [todos.CHANGE_CURRENT_FILTER_TO_ALL](state) {
    Vue.set(state.views, "currentFilter", filterType.ALL);
    // state.views.currentFilter = "All";
  },

  [todos.CHANGE_CURRENT_FILTER_TO_DONE](state) {
    Vue.set(state.views, "currentFilter", filterType.DONE);
    // state.views.currentFilter = "Done";
  },

  [todos.CHANGE_CURRENT_FILTER_TO_ACTIVE](state) {
    Vue.set(state.views, "currentFilter", filterType.ACTIVE);
    // state.views.currentFilter = "Active";
  }
};
