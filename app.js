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

        if (type === 'exp') {
            newItem = new Expense(id, description, value);
        } else if (type === 'inc') {
            newItem = new Income(id, description, value);
        }

        data.items[type].push(newItem);
        console.log(data);
        return newItem;
    }
    return {
        addItem: _addItem
    };
})();

var uIController = (function UIController() {
    var DOMSelector = {
        inputType: '.js-add-type',
        inputDescription: '.js-add-description',
        inputValue: '.js-add-value',
        btnAdd: '.js-add-btn'
    };

    function _getDOMSelector() {
        return DOMSelector;
    }

    function _getInput() {
        return {
            type: document.querySelector(DOMSelector.inputType).value,
            description: document.querySelector(DOMSelector.inputDescription).value,
            value: document.querySelector(DOMSelector.inputValue).value
        };
    }

    var config = new LiquidFillSettings();
    config.circleColor = 'rgb(23, 161, 83)';
    config.circleThickness = 0.02;
    config.textColor = 'rgb(23, 161, 83)';
    config.textVertPosition = 0.5;
    config.textSize = 0.6;
    config.waveAnimateTime = 4000;
    config.waveTextColor = 'gainsboro';
    config.waveColor = 'rgb(23, 161, 83)';

    var budgetChart = loadLiquidFill('.js-budget-chart', 75, config);
    // budgetChart.update(50);

    return {
        getInput: _getInput,
        getDOMSelector: _getDOMSelector
    };
})();

var appController = (function AppController(budgetController, uIController) {
    function addItem(event) {
        event.preventDefault();
        var item,
            newItem;
        item = uIController.getInput();
        newItem = budgetController.addItem(item.type, item.description, item.value);
    }

    function setupEventListeners() {
        var DOMSelector = uIController.getDOMSelector();

        document.querySelector(DOMSelector.btnAdd).addEventListener('click', addItem);
        document.querySelector(DOMSelector.inputValue).addEventListener('keypress', function(e) {
            if (e.keyCode == 13) {
                addItem(e);
            }
            return;
        });
    }

    function _init() {
        setupEventListeners();
    }
    return {
        init: _init
    };
})(budgetController, uIController);

appController.init();
