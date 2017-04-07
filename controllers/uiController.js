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
            html = '<div class="item" id="inc-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-delete"><button class="btn btn-icon"><i class="icon small delete"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMSelector.expenseList;
            html = '<div class="item" id="exp-%id%"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-delete"><button class="btn btn-icon"><i class="icon small delete"></i></button></div></div></div>';
        }

        html = html.replace('%id%', item.id)
            .replace('%description%', item.description)
            .replace('%value%', item.value);

        document.querySelector(element).insertAdjacentHTML('beforeend', html);
    }

    function _clearFields() {
        var fields = document.querySelectorAll(DOMSelector.inputDescription + ',' + DOMSelector.inputValue);
        fields.forEach(function(element) {
            element.value = '';
        });
        fields[0].focus();
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
        clearFields: _clearFields,
        getDOMSelector: _getDOMSelector,
        getInput: _getInput,
    };
})();
