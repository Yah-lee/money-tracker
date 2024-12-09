<template>
  <v-container class="pa-5">
    <!-- Transaction Form -->
    <v-form @submit.prevent="addTransaction" class="mb-6">
      <v-row>
        <!-- Date Field -->
        <v-col cols="12" md="6">
          <v-text-field v-model="transaction.date" label="Date" type="date" required outlined dense />
        </v-col>

        <!-- Description Field -->
        <v-col cols="12" md="6">
          <v-text-field v-model="transaction.description" label="Description" required outlined dense />
        </v-col>

        <!-- Category Field -->
        <v-col cols="12" md="6">
          <v-select v-model="transaction.category" :items="categories" label="Category" required outlined dense />
        </v-col>

        <!-- Amount Field -->
        <v-col cols="12" md="6">
          <v-text-field v-model.number="transaction.amount" label="Amount" type="number" required outlined dense />
        </v-col>

        <!-- Payment Method Field -->
        <v-col cols="12" md="6">
          <v-select v-model="transaction.paymentMethod" :items="paymentMethods" label="Payment Method" required outlined
            dense />
        </v-col>

        <!-- Submit Button -->
        <v-col cols="12">
          <v-btn type="submit" color="primary" class="text-transform-none" elevation="2" large block>
            Add Transaction
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-divider class="my-6"></v-divider>

    <!-- Transactions Table -->
    <v-data-table :headers="headers" :items="transactions" item-key="id" class="elevation-1">
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date).toLocaleDateString() }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{ item.amount | currency }}
      </template>
    </v-data-table>

    <!-- Calculate Totals -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-btn @click="calculateTotals" color="secondary" class="text-transform-none" large block>
          Calculate Totals
        </v-btn>
      </v-col>
    </v-row>

    <!-- Totals Display -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-subheader>Total Income: {{ totalIncome | currency }}</v-subheader>
      </v-col>
      <v-col cols="12" md="4">
        <v-subheader>Total Cash: {{ totalCash | currency }}</v-subheader>
      </v-col>
      <v-col cols="12" md="6">
        <v-subheader>Total Expenses: {{ totalExpenses | currency }}</v-subheader>
      </v-col>
      <v-col cols="12" md="4">
        <v-subheader>Total Bank Transfer: {{ totalBankTransfer | currency }}</v-subheader>
      </v-col>
      <v-col cols="12" md="6">
        <v-subheader>Net Profit/Loss: {{ netProfit | currency }}</v-subheader>
      </v-col>
      <v-col cols="12" md="4">
        <v-subheader>Total Credit Card: {{ totalCreditCard | currency }}</v-subheader>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      transaction: {
        date: "",
        description: "",
        category: "",
        amount: null, // Changed to null for better validation
        paymentMethod: "",
      },
      categories: [
        "Sales",
        "Service Income",
        "Interest",
        "Housing",
        "Marketing",
        "General Expenses",
        "Wages",
      ],
      paymentMethods: ["Cash", "Bank Transfer", "Credit Card"],
      transactions: [], // Stores all transactions
      headers: [
        { text: "Date", value: "date" },
        { text: "Description", value: "description" },
        { text: "Category", value: "category" },
        { text: "Amount", value: "amount" },
        { text: "Payment Method", value: "paymentMethod" },
      ],
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      totalCash: 0,
      totalBankTransfer: 0,
      totalCreditCard: 0,
    };
  },
  methods: {
    // Adds a transaction to the list
    addTransaction() {
      if (this.transaction.amount <= 0) {
        alert("Amount must be greater than 0");
        return;
      }

      // Ensure all fields are filled
      if (
        !this.transaction.date ||
        !this.transaction.description ||
        !this.transaction.category ||
        !this.transaction.paymentMethod
      ) {
        alert("Please fill all fields");
        return;
      }

      // Add transaction to the transactions array
      this.transactions.push({
        ...this.transaction,
        id: Date.now(), // Assign unique ID for tracking
      });

      // Reset form after adding
      this.resetForm();
    },

    // Resets the transaction form
    resetForm() {
      this.transaction = {
        date: "",
        description: "",
        category: "",
        amount: null,
        paymentMethod: "",
      };
    },

    // Calculates totals for income, expenses, and net profit
    calculateTotals() {
      // Income categories
      const incomeCategories = ["Sales", "Service Income", "Interest"];

      // Expense categories
      const expenseCategories = [
        "Housing",
        "Marketing",
        "General Expenses",
        "Wages",
      ];

      // Filter and calculate totals
      this.totalIncome = this.transactions
        .filter((t) => incomeCategories.includes(t.category))
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalExpenses = this.transactions
        .filter((t) => expenseCategories.includes(t.category))
        .reduce((sum, t) => sum + t.amount, 0);

      // Net Profit
      this.netProfit = this.totalIncome - this.totalExpenses;

      // Totals by payment method
      this.totalCash = this.transactions
        .filter((t) => t.paymentMethod === "Cash")
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalBankTransfer = this.transactions
        .filter((t) => t.paymentMethod === "Bank Transfer")
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalCreditCard = this.transactions
        .filter((t) => t.paymentMethod === "Credit Card")
        .reduce((sum, t) => sum + t.amount, 0);
    },
  },
  filters: {
    // Currency formatting filter
    currency(value) {
      if (!value) return "0.00";
      return parseFloat(value).toFixed(2);
    },
  },
};
</script>
