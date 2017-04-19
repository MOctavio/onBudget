const appController = (function AppController(budgetController, uIController) {
    function addItem(event) {
        event.preventDefault();
        if (!uIController.validInput())
            return;

        let input = uIController.getInput();
        let newItem = budgetController.addItem(input.type, input.description, input.value);
        uIController.addListItem(newItem, input.type);
        uIController.clearFields();
        updateBudget();
    }

    function deleteItem(event) {
        let item = event.target.parentNode.parentNode.parentNode.parentNode;
        console.log(item.id, item.dataset.type);
    }

    function updateBudget() {
        let budget = budgetController.getBudget();
        uIController.updateChart(budget);
    }

    function setupEventListeners() {
        let DOMSelector = uIController.getDOMSelector();

        document.querySelector(DOMSelector.eventListener).addEventListener('click', deleteItem);
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

appController.init();
