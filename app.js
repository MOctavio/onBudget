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

var uIController = (function UIController() {
    var DOMSelector = {
        inputType: '.js-add-type',
        inputDescription: '.js-add-description',
        inputValue: '.js-add-value',
        btnAdd: '.js-add-btn',
        incomeList: '.js-income-list',
        expenseList: '.js-expense-list',
    };

    var budgetChart = _initBudgetChart();
    // budgetChart.update(50);

    function _addListItem(item, type) {
        var html, element;

        if (type === 'inc') {
            element = DOMSelector.incomeList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMSelector.expenseList;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        html = html.replace('%id%', item.id)
            .replace('%description%', item.description)
            .replace('%value%', item.value);

        document.querySelector(element).insertAdjacentHTML('beforeend', html);
    }

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

    function _initBudgetChart() {
        var config = new LiquidFillSettings();
        config.circleColor = 'rgb(23, 161, 83)';
        config.circleThickness = 0.02;
        config.textColor = 'rgb(23, 161, 83)';
        config.textVertPosition = 0.5;
        config.textSize = 0.6;
        config.waveAnimateTime = 4000;
        config.waveTextColor = 'gainsboro';
        config.waveColor = 'rgb(23, 161, 83)';
        return loadLiquidFill('.js-budget-chart', 75, config);
    }

    return {
        addListItem: _addListItem,
        getDOMSelector: _getDOMSelector,
        getInput: _getInput,
    };
})();

var appController = (function AppController(budgetController, uIController) {
    function addItem(event) {
        event.preventDefault();
        var input,
            newItem;
        input = uIController.getInput();
        newItem = budgetController.addItem(input.type, input.description, input.value);
        uIController.addListItem(newItem, input.type);
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
