var budgetController = (function BudgetController() {})();

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
    return {getInput: _getInput, getDOMSelector: _getDOMSelector};
})();

var AppController = (function AppController(budgetController, uIController) {
    function addItem(event) {
      event.preventDefault();
      console.log('Event to add an has been entry registered.');
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
    return {init: _init};
})(budgetController, uIController);

AppController.init();
