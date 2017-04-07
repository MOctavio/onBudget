var appController = (function AppController(budgetController, uIController) {
    function addItem(event) {
        event.preventDefault();
        if(!uIController.validInput()) return;

        var input,
            newItem;
        input = uIController.getInput();
        newItem = budgetController.addItem(input.type, input.description, input.value);
        uIController.addListItem(newItem, input.type);
        uIController.clearFields();
        updateBudget();
    }

    function updateBudget() {
        var budget = budgetController.getBudget();
        uIController.updateChart(budget);
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
