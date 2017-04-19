const uIController = (function UIController() {
    const DOMSelector = {
        budget: '.js-budget',
        inputType: '.js-add-type',
        inputDescription: '.js-add-description',
        inputValue: '.js-add-value',
        btnAdd: '.js-add-btn',
        incomeList: '.js-income-list',
        expenseList: '.js-expense-list',
        eventListener: '.js-event-listener'
    };

    const budgetChart = _initBudgetChart();

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    function _updateChart(value) {
        budgetChart.update(value.percentage);
        document.querySelector(DOMSelector.budget).innerHTML = formatter.format(value.budget);
    }

    function _addListItem(item, type) {
        let html,
            element;

        if (type === 'inc') {
            element = DOMSelector.incomeList;
            html = '<div class="item" id="inc-%id%" data-type="inc"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-delete"><button class="btn btn-icon"><i class="icon small delete"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMSelector.expenseList;
            html = '<div class="item" id="exp-%id%" data-type="exp"><div class="item-description">%description%</div><div class="right"><div class="item-value">%value%</div><div class="item-delete"><button class="btn btn-icon"><i class="icon small delete"></i></button></div></div></div>';
        }

        html = html.replace('%id%', item.id)
          .replace('%description%', item.description)
          .replace('%value%', formatter.format(item.value));

        document.querySelector(element).insertAdjacentHTML('beforeend', html);
    }

    function _clearFields() {
        let fields = document.querySelectorAll(DOMSelector.inputDescription + ',' + DOMSelector.inputValue);
        fields.forEach( element =>
          element.value = ''
        );
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
        return liquidFill({
            circleColor: 'rgb(147, 112, 219)',
            circleThickness: 0.02,
            textColor: 'rgb(147, 112, 219)',
            textVertPosition: 0.5,
            textSize: 0.6,
            waveAnimateTime: 4000,
            waveTextColor: 'gainsboro',
            waveColor: 'rgb(147, 112, 219)'
        }, '.js-budget-chart', 0);
    }

    return {
        addListItem: _addListItem,
        clearFields: _clearFields,
        getDOMSelector: _getDOMSelector,
        getInput: _getInput,
        updateChart: _updateChart,
        validInput: _validInput
    };
})();
