const budgetController = (function BudgetController() {
    let data = {
        budget: 0,
        items: {
            inc: [],
            exp: []
        },
        percentage: 0,
        totals: {
            inc: 0,
            exp: 0
        }
    };
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type) {
        let total = 0;
        data.items[type].forEach(item => total += item.value);
        data.totals[type] = total;
    };

    const calculateBudget = function() {
        calculateTotal('inc');
        calculateTotal('exp');
        data.budget = data.totals.inc - data.totals.exp;
        data.percentage = 100 - Math.round(data.totals.exp / data.totals.inc * 100);
    };

    function _addItem(type, description, value) {
        let newItem,
            id = 0;
        // New id base on last id number
        if (data.items[type].length)
            id = data.items[type][data.items[type].length - 1].id + 1;

        if (type === 'inc') {
            newItem = new Income(id, description, value);
        } else if (type === 'exp') {
            newItem = new Expense(id, description, value);
        }

        data.items[type].push(newItem);
        return newItem;
    }

    function _deleteItem(type, id) {
        data.items[type] = data.items[type].filter((item)=> item.id != id);
    }

    function _getBudget() {
        calculateBudget();
        return {budget: data.budget, expenses: data.totals.exp, incomes: data.totals.inc, percentage: data.percentage};
    }

    return {addItem: _addItem, deleteItem: _deleteItem, getBudget: _getBudget};
})();
