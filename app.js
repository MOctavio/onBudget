var budgetController = (function BudgetController() {

});
var UIController = (function UIController() {

});
var AppController = (function AppController(BudgetController, UIController) {
    document.querySelector('.add-btn').addEventListener('click', function () {
        console.log('Cliked!');
    });
});
