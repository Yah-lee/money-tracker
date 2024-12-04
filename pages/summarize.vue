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
        <v-subheader>Total Bank Transfer: {{ totalBankTransfer | currency }}</v-subheader>
      </v-col>
      <v-col cols="12" md="6">
        <v-subheader>Total Expenses: {{ totalExpenses | currency }}</v-subheader>
      </v-col>


      <!-- New Payment Method Totals -->
      <v-col cols="12" md="4">
        <v-subheader>Total Cash: {{ totalCash | currency }}</v-subheader>
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
        date: '',
        description: '',
        category: '',
        amount: '',
        paymentMethod: ''
      },
      categories: ['Sales', 'Service Income', 'Interest', 'Housing', 'Marketing', 'General Expenses', 'Wages'],
      paymentMethods: ['Cash', 'Bank Transfer', 'Credit Card'],
      transactions: [],
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Description', value: 'description' },
        { text: 'Category', value: 'category' },
        { text: 'Amount', value: 'amount' },
        { text: 'Payment Method', value: 'paymentMethod' }
      ],
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      totalCash: 0,
      totalBankTransfer: 0,
      totalCreditCard: 0
    };
  },
  methods: {
    addTransaction() {
      // Check if amount is a valid number before pushing
      if (isNaN(this.transaction.amount) || this.transaction.amount <= 0) {
        // alert('Please enter a valid amount.');
        return;
      }

      // Add transaction to transactions array
      this.transactions.push({ ...this.transaction, id: Date.now() });
      this.resetForm();
    },
    resetForm() {
      this.transaction = { date: '', description: '', category: '', amount: 0, paymentMethod: '' };
    },
    calculateTotals() {
      this.totalIncome = this.transactions.filter(t => t.category === 'Sales' || t.category === 'Service Income' || t.category === 'Interest')
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalExpenses = this.transactions.filter(t => t.category === 'Housing' || t.category === 'Marketing' || t.category === 'General Expenses' || t.category === 'Wages')
        .reduce((sum, t) => sum + t.amount, 0);

      this.netProfit = this.totalIncome - this.totalExpenses;

      // Calculate totals for each payment method
      this.totalCash = this.transactions.filter(t => t.paymentMethod === 'Cash')
        .reduce((sum, t) => sum + t.amount, 0);
      this.totalBankTransfer = this.transactions.filter(t => t.paymentMethod === 'Bank Transfer')
        .reduce((sum, t) => sum + t.amount, 0);
      this.totalCreditCard = this.transactions.filter(t => t.paymentMethod === 'Credit Card')
        .reduce((sum, t) => sum + t.amount, 0);
    }
  },
  filters: {
    currency(value) {
      return value.toFixed(2);
    }
  }
};
</script>
