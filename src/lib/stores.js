import { writable, readonly } from 'svelte/store'

const opsBudgetStore = writable(10000); // in cents

export const session = writable(null);
export const operatingBudget = readonly(opsBudgetStore);