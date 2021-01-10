const btnStart = document.getElementById('start'),
    btnIncomeAdd = document.getElementsByTagName('button')[0],
    btnExpensesAdd = document.getElementsByTagName('button')[1],
    depositCheck = document.querySelector('#deposit-check'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelectorAll('.income-title'),
    expensesTitle = document.querySelectorAll('.expenses-title'),
    expensesAmount = document.querySelector('.expenses-amount'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    incomeAmount = document.querySelector('.income-amount'),
    periodAmount = document.querySelector('.period-amount'),
    btnReset = document.getElementById('cancel'), 
    depositBank = document.querySelector('.deposit-bank'),  
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent');     

let expensesItems = document.querySelectorAll('.expenses-items'),
    incomeItem = document.querySelectorAll('.income-items');

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

const isTextInput = (str) =>{
    const textInput = /^[A-Za-zА-Яа-я]+/ig
    return textInput.test(str) ?  true : false
};

const isValidDeposit = percent => {
    if (!isNumber(percent) || (percent > 100 || percent < 0)){
        alert('Введите корректное значение в поле проценты');
        return false    
    } else{
        return true
    }
};

class AppData {
    constructor(){
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false; 
        this.percentDeposit = 0;
        this.moneyDeposit = 0; 
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
    }
    start() {
        function calc(){
            this.budget = +salaryAmount.value;
            this.getExpenses();
            this.getIncome();
            this.getExpensesMonth();
            this.getAddExpenses();
            this.getAddIncome();
            this.getInfoDeposit();
            this.getBudget();
            this.showResult();
            
            const input = document.querySelectorAll("input[type=text]");
            input.forEach((elem) => elem.disabled = true);
        
            btnStart.style.display = "none";
            btnReset.style.display = "block";
        }
        
        if(isNumber(salaryAmount.value)){
            if (depositPercent.value !== ''){
                if(isValidDeposit(depositPercent.value)){
                    calc.call(this);
                }
            }
            calc.call(this);
        }
    }
    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(this.getTargetMonth());
        periodSelect.addEventListener('input', () => {
            incomePeriodValue.value = this.budgetMonth * periodSelect.value;
            periodAmount.textContent = periodSelect.value;
        });
        incomePeriodValue.value = this.budgetMonth * periodSelect.value;
    }
    addExpensesBlock() {
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnExpensesAdd);
        expensesItems = document.querySelectorAll('.expenses-items');
        if(expensesItems.length === 3){
            btnExpensesAdd.style.display = 'none';
        }
    }
    addIncomeBlock() {
        const cloneIncomeItem = incomeItem[0].cloneNode(true);
        incomeItem[0].parentNode.insertBefore(cloneIncomeItem, btnIncomeAdd);
        incomeItem = document.querySelectorAll('.income-items');
        if(incomeItem.length === 3){
            btnIncomeAdd.style.display = 'none';
        }
    }
    getExpenses() {
        let itemExpenses = 0;
        let cashExpenses = 0;
        expensesItems.forEach((item) => {
            itemExpenses = item.children[0].value;
            cashExpenses = item.children[1].value;
            if(itemExpenses !== '' && cashExpenses !== ''){
                this.expenses[itemExpenses] = cashExpenses;
            }
            
        });
    }
    getIncome () {
        let itemIncome = 0;
        let cashIncome = 0;
        incomeItem.forEach((item) => {
            itemIncome = item.children[0].value;
            cashIncome = item.children[1].value;
            if(itemIncome !== '' && cashIncome !== ''){
                this.income[itemIncome] = cashIncome;
            }
        });
    
        for (let key in this.income){
            this.incomeMonth += +this.income[key]
        };
    }
    getAddExpenses() {
        const addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach((item) => {
            item = item.trim();
            if(item !== ''){
                this.addExpenses.push(item)
            }
        });
    }
    getAddIncome() {
        additionalIncomeItem.forEach((item) => {
            const itemValue = item.value.trim();
            if (itemValue !== ''){
                this.addIncome.push(itemValue);
            }
        });
    }
    getExpensesMonth() {
        for(let key in this.expenses){
            this.expensesMonth += +this.expenses[key]
        }
    }
    getBudget() {
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = Math.ceil(this.budgetMonth / 30);
    }
    getTargetMonth () {
        return targetAmount.value / this.budgetMonth;
    }
    reset() {
        for (let key in this) {
            if(!(typeof this[key] === 'function')){
                if(typeof this[key] === 'number'){
                    this[key] = 0;
                } else if(typeof this[key] === 'string'){
                    this[key] = '';
                } else if(typeof this[key] === 'object'){
                    this[key] = [];
                } 
            }
        };
    
        this.resetIncomeExpensesBlock();
        periodAmount.textContent = '1';
        periodSelect.value = 0;
        depositCheck.checked  = false; 
    
        const input = document.querySelectorAll("input[type=text]");
        input.forEach((elem) => {
            elem.value = ''
            elem.disabled = false;
        });
        btnReset.style.display = "none";
        btnStart.style.display = "block";

        depositBank.style.display = 'none';
        depositAmount.style.display = 'none';
        depositPercent.style.display = 'none';
        depositBank.value = '';
    }
    resetIncomeExpensesBlock() {
        expensesItems = document.querySelectorAll('.expenses-items');
        expensesItems[1] ? expensesItems[1].style.display = 'none' : null     
        expensesItems[2] ? expensesItems[2].style.display = 'none' : null
        btnExpensesAdd.style.display = 'block';

        incomeItem = document.querySelectorAll('.income-items');
        incomeItem[1] ? incomeItem[1].style.display = 'none' : null
        incomeItem[2] ? incomeItem[2].style.display = 'none' : null
        btnIncomeAdd.style.display = 'block';
    }
    getInfoDeposit() {
        if(this.deposit){
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
    }
    changePercent() {
        const valueSelect = this.value;
        if(valueSelect === 'other'){
            depositPercent.value = '';
            depositPercent.style.display = 'inline-block';
        } else{
            depositPercent.value = valueSelect;
            depositPercent.style.display = 'none';
        }
    }
    depositHandler() {
        if(depositCheck.checked){
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);

        } else{
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    }
    eventsListeners() {
        btnStart.addEventListener('click', this.start.bind(this));
        btnReset.addEventListener('click', this.reset.bind(this));
        
        btnExpensesAdd.addEventListener('click', this.addExpensesBlock);
        btnIncomeAdd.addEventListener('click', this.addIncomeBlock);
        
        periodSelect.addEventListener('input', () => {
            periodAmount.textContent = periodSelect.value;
        });

        depositCheck.addEventListener('change', this.depositHandler.bind(this));

        depositPercent.addEventListener('input', () => {
            if (depositPercent.value > 100){
                alert('Введенное значение % по депозиту > 100');
                depositPercent.value = 0;
            }
        })
    }
};

const appData = new AppData();
appData.eventsListeners();


