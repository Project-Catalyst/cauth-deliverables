import { defineStore } from 'pinia';
import { Todo, Meta } from 'components/models';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [
      {
        id: 1,
        content: 'Remember the milk',
      },
      {
        id: 2,
        content: 'ct2',
      },
      {
        id: 3,
        content: 'ct3',
      },
      {
        id: 4,
        content: 'ct4',
      },
      {
        id: 5,
        content: 'ct5',
      },
    ] as Todo[],
    counter: 0,
    meta: { totalCount: 1200 } as Meta,
  }),
  getters: {},
  actions: {
    increment() {
      this.counter++;
    },
  },
});
