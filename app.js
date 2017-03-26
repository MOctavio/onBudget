(function() {
    console.info('App initialized');

    var budgetController = (function BudgetController() {});
    var UIController = (function UIController() {});
    var AppController = (function AppController(BudgetController, UIController) {
        document.querySelector('.btn-add').addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Cliked!');
        });
    });

    AppController();
})();
