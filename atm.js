
// ========================================
// 1. CREATE THE USERS DATABASE
// ========================================

let users = JSON.parse(localStorage.getItem("atmUsers"));

if (!users) {
    users = [
        {
            name: "David",
            accountNumber: "1234567890",
            cardNumber: "1111222233334444",
            pin: "1234",
            balance: 50000,
            transactions: []
        },

        {
            name: "Amina",
            accountNumber: "0987654321",
            cardNumber: "5555666677778888",
            pin: "5678",
            balance: 75000,
            transactions: []
        }
    ];

    localStorage.setItem("atmUsers", JSON.stringify(users));
}


// ========================================
// 2. SAVE USERS
// ========================================

function saveUsers() {
    localStorage.setItem("atmUsers", JSON.stringify(users));
}


// ========================================
// 3. GET THE CURRENT USER
// ========================================

function getCurrentUser() {
    const accountNumber = localStorage.getItem("currentAccount");

    return users.find(function (user) {
        return user.accountNumber === accountNumber;
    });
}


// ========================================
// 4. SELECT A CARD
// ========================================

function insertCard(cardNumber) {
    const user = users.find(function (user) {
        return user.cardNumber === cardNumber;
    });

    if (!user) {
        alert("Invalid card!");
        return;
    }

    localStorage.setItem("currentAccount", user.accountNumber);

    alert("Welcome " + user.name);

    window.location.href = "pin.html";
}


// ========================================
// 5. VERIFY PIN
// ========================================

function verifyPin() {
    const user = getCurrentUser();
    const pinInput = document.getElementById("pin");

    if (!user) {
        alert("Please select your card first.");
        window.location.href = "card.html";
        return;
    }

    if (pinInput.value === user.pin) {
        alert("PIN correct. Welcome " + user.name);
        window.location.href = "menu.html";
    } else {
        alert("Incorrect PIN. Try again.");
        pinInput.value = "";
    }
}


// ========================================
// 6. DISPLAY ACCOUNT BALANCE
// ========================================

function updateBalance() {
    const user = getCurrentUser();

    if (!user) {
        alert("Please select your card first.");
        window.location.href = "card.html";
        return;
    }

    const balanceDisplay = document.getElementById("balanceDisplay");
    const accountName = document.getElementById("accountName");

    if (balanceDisplay) {
        balanceDisplay.innerText =
            "₦" + user.balance.toLocaleString("en-NG");
    }

    if (accountName) {
        accountName.innerText = user.name;
    }
}


// ========================================
// 7. RECORD A TRANSACTION
// ========================================

function recordTransaction(user, type, amount, description) {
    user.transactions.push({
        type: type,
        amount: amount,
        description: description,
        date: new Date().toLocaleString(),
        balanceAfter: user.balance
    });

    saveUsers();
}


// ========================================
// 8. DEPOSIT MONEY
// ========================================

function depositMoney(amount) {
    const user = getCurrentUser();

    if (!user) {
        alert("Please select your card first.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid deposit amount.");
        return;
    }

    user.balance += amount;

    recordTransaction(
        user,
        "Deposit",
        amount,
        "Cash deposit"
    );

    alert("Deposit successful!");

    window.location.href = "balance.html";
}


// ========================================
// 9. WITHDRAW MONEY
// ========================================

function withdrawMoney(amount) {
    const user = getCurrentUser();

    if (!user) {
        alert("Please select your card first.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid withdrawal amount.");
        return;
    }

    if (amount > user.balance) {
        alert("Insufficient balance.");
        return;
    }

    user.balance -= amount;

    recordTransaction(
        user,
        "Withdrawal",
        amount,
        "Cash withdrawal"
    );

    alert("Withdrawal successful!");

    window.location.href = "balance.html";
}


// ========================================
// 10. TRANSFER MONEY
// ========================================

function transferMoney(accountNumber, amount) {
    const sender = getCurrentUser();

    if (!sender) {
        alert("Please select your card first.");
        return;
    }

    const receiver = users.find(function (user) {
        return user.accountNumber === accountNumber;
    });

    if (!receiver) {
        alert("Receiver account not found.");
        return;
    }

    if (receiver.accountNumber === sender.accountNumber) {
        alert("You cannot transfer money to your own account.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid transfer amount.");
        return;
    }

    if (amount > sender.balance) {
        alert("Insufficient balance.");
        return;
    }

    // Deduct money from sender
    sender.balance -= amount;

    // Add money to receiver
    receiver.balance += amount;

    // Record the transaction in sender's history
    recordTransaction(
        sender,
        "Transfer Sent",
        amount,
        "Money sent to " + receiver.name
    );

    // Record the transaction in receiver's history
    recordTransaction(
        receiver,
        "Transfer Received",
        amount,
        "Money received from " + sender.name
    );

    saveUsers();

    alert("Transfer successful!");

    window.location.href = "balance.html";
}


// ========================================
// 11. DISPLAY TRANSACTION HISTORY
// ========================================

function displayTransactionHistory() {
    const user = getCurrentUser();

    const accountName = document.getElementById("accountName");
    const transactionList = document.getElementById("transactionList");

    if (!user) {
        alert("Please select your card first.");
        window.location.href = "card.html";
        return;
    }

    if (accountName) {
        accountName.innerText =
            user.name + "'s Transaction History";
    }

    if (!transactionList) {
        return;
    }

    transactionList.innerHTML = "";

    if (user.transactions.length === 0) {
        transactionList.innerText = "No transactions yet.";
        return;
    }

    user.transactions.forEach(function (transaction) {
        const item = document.createElement("div");

        const type = document.createElement("h3");
        type.innerText = transaction.type;

        const amount = document.createElement("p");
        amount.innerText =
            "Amount: ₦" +
            transaction.amount.toLocaleString("en-NG");

        const description = document.createElement("p");
        description.innerText = transaction.description;

        const date = document.createElement("p");
        date.innerText = transaction.date;

        const balance = document.createElement("p");
        balance.innerText =
            "Balance after transaction: ₦" +
            transaction.balanceAfter.toLocaleString("en-NG");

        item.append(type, amount, description, date, balance);

        const line = document.createElement("hr");

        transactionList.append(item, line);
    });
}


// ========================================
// 12. LOG OUT
// ========================================

function logout() {
    localStorage.removeItem("currentAccount");
    window.location.href = "card.html";
}

