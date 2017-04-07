var budgetController = (function BudgetController() {
    var data = {
        items: {
            inc: [],
            exp: []
        },
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
    return {
        addItem: _addItem
    };
})();
