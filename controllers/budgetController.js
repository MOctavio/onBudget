var budgetController = (function BudgetController() {
    var data = {
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
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    function _addItem(type, description, value) {
        var newItem,
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

    var calculateTotal = function(type) {
        var total = 0;
        data.items[type].forEach(function functionName(item) {
            total += item.value;
        });
        data.totals[type] = total;
    };

    var calculateBudget = function() {
        calculateTotal('inc');
        calculateTotal('exp');
        data.budget = data.totals.inc - data.totals.exp;
        data.percentage = 100 - Math.round(data.totals.exp / data.totals.inc * 100);
    };

    function _getBudget() {
        calculateBudget();
        return {
            budget: data.budget,
            expenses: data.totals.exp,
            incomes: data.totals.inc,
            percentage: data.percentage,
        };
    }

    return {
        addItem: _addItem,
        getBudget: _getBudget
    };
})();
