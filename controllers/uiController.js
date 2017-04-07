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

    function _updateChart(value) {
        budgetChart.update(value);
    }

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
        var fields = document
            .querySelectorAll(DOMSelector.inputDescription + ',' + DOMSelector.inputValue);
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
            value: parseFloat(document.querySelector(DOMSelector.inputValue).value)
        };
    }

    function _validInput() {
        if (document.querySelector(DOMSelector.inputDescription).value !== '' &&
        !isNaN(document.querySelector(DOMSelector.inputValue).value) &&
        document.querySelector(DOMSelector.inputValue).value > 0)
            return true;
        return false;
    }

    function _initBudgetChart() {
        var config = new LiquidFillSettings();
        config.circleColor = 'rgb(66, 73, 73)';
        config.circleThickness = 0.02;
        config.textColor = 'rgb(66, 73, 73)';
        config.textVertPosition = 0.5;
        config.textSize = 0.6;
        config.waveAnimateTime = 4000;
        config.waveTextColor = 'gainsboro';
        config.waveColor = 'rgb(66, 73, 73)';
        return loadLiquidFill('.js-budget-chart', 0, config);
    }

    return {
        addListItem: _addListItem,
        clearFields: _clearFields,
        getDOMSelector: _getDOMSelector,
        getInput: _getInput,
        updateChart: _updateChart,
        validInput: _validInput,
    };
})();
