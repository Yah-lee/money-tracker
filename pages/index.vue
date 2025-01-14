<template>
  <v-container class="pa-5">
    <!-- Transaction Form -->
    <v-form @submit.prevent="addTransaction" class="mb-6">
      <v-row>
        <!-- Date Field -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="transaction.date"
            label="Date"
            type="date"
            required
            outlined
            dense
          />
        </v-col>

        <!-- Description Field -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="transaction.description"
            label="Description"
            required
            outlined
            dense
          />
        </v-col>

        <!-- Category Field -->
        <v-col cols="12" md="6">
          <v-select
            v-model="transaction.category"
            :items="categories"
            label="Category"
            required
            outlined
            dense
          />
        </v-col>

        <!-- Amount Field -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="transaction.amount"
            label="Amount"
            type="number"
            required
            outlined
            dense
          />
        </v-col>

        <!-- Payment Method Field -->
        <v-col cols="12" md="6">
          <v-select
            v-model="transaction.paymentMethod"
            :items="paymentMethods"
            label="Payment Method"
            required
            outlined
            dense
          />
        </v-col>

        <!-- Submit Button -->
        <v-col cols="12">
          <v-btn
            type="submit"
            color="primary"
            class="text-transform-none"
            elevation="2"
            large
            block
          >
            Add Transaction
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-divider class="my-6"></v-divider>

    <!-- Transactions Table with Actions -->
    <v-data-table
      :headers="headers"
      :items="transactions"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date).toLocaleDateString() }}
      </template>
      <template v-slot:item.amount="{ item }">
        {{ item.amount | currency }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-btn
            small
            color="blue"
            @click="editTransaction(item)"
            class="mr-2"
          >
            Edit
          </v-btn>
          <v-btn small color="red" @click="deleteTransaction(item.id)">
            Delete
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Calculate Totals -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-btn
          @click="calculateTotals"
          color="secondary"
          class="text-transform-none"
          large
          block
        >
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
        <v-subheader>
          Total Bank Transfer: {{ totalBankTransfer | currency }}
        </v-subheader>
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
        <v-subheader>
          Total Credit Card: {{ totalCreditCard | currency }}
        </v-subheader>
      </v-col>
    </v-row>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Transaction</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="updateTransaction">
            <v-text-field
              v-model="editedTransaction.date"
              label="Date"
              type="date"
              required
              outlined
              dense
            />
            <v-text-field
              v-model="editedTransaction.description"
              label="Description"
              required
              outlined
              dense
            />
            <v-select
              v-model="editedTransaction.category"
              :items="categories"
              label="Category"
              required
              outlined
              dense
            />
            <v-text-field
              v-model.number="editedTransaction.amount"
              label="Amount"
              type="number"
              required
              outlined
              dense
            />
            <v-select
              v-model="editedTransaction.paymentMethod"
              :items="paymentMethods"
              label="Payment Method"
              required
              outlined
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="updateTransaction">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this transaction?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Optional: Snackbar for Feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
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
      categories: [
        'Sales',
        'Wages',
        'General Expenses'
      ],
      paymentMethods: ['Cash', 'Bank Transfer', 'Credit Card'],
      transactions: [],
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Description', value: 'description' },
        { text: 'Category', value: 'category' },
        { text: 'Amount', value: 'amount' },
        { text: 'Payment Method', value: 'paymentMethod' },
        { text: '', value: 'actions', sortable: false }
      ],
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      totalCash: 0,
      totalBankTransfer: 0,
      totalCreditCard: 0,
      // For editing
      dialog: false,
      editedTransaction: {},
      originalTransaction: {},
      // For delete confirmation
      deleteDialog: false,
      transactionToDelete: null,
      // For snackbar
      snackbar: {
        show: false,
        text: '',
        color: ''
      }
    };
  },
  created() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        this.transactions = JSON.parse(savedTransactions);
      } catch (e) {
        console.error('Error parsing transactions from localStorage:', e);
      }
    }
    this.calculateTotals();
  },
  methods: {
    addTransaction() {
      if (isNaN(this.transaction.amount) || this.transaction.amount <= 0) return;
      this.transactions.push({ ...this.transaction, id: Date.now() });
      this.resetForm();
      this.calculateTotals();
      this.showSnackbar('Transaction added successfully.', 'success');
    },
    resetForm() {
      this.transaction = {
        date: '',
        description: '',
        category: '',
        amount: 0,
        paymentMethod: ''
      };
    },
    calculateTotals() {
      this.totalIncome = this.transactions
        .filter(t => t.category === 'Sales')
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalExpenses = this.transactions
        .filter(
          t =>
            t.category === 'Wages' ||
            t.category === 'General Expenses'
        )
        .reduce((sum, t) => sum + t.amount, 0);

      this.netProfit = this.totalIncome - this.totalExpenses;

      // Calculate totals for each payment method
      this.totalCash = this.transactions
        .filter(t => t.paymentMethod === 'Cash')
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalBankTransfer = this.transactions
        .filter(t => t.paymentMethod === 'Bank Transfer')
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalCreditCard = this.transactions
        .filter(t => t.paymentMethod === 'Credit Card')
        .reduce((sum, t) => sum + t.amount, 0);
    },
    editTransaction(item) {
      this.editedTransaction = { ...item };
      this.originalTransaction = item;
      this.dialog = true;
    },
    updateTransaction() {
      if (!this.editedTransaction) return;

      const index = this.transactions.findIndex(
        t => t.id === this.editedTransaction.id
      );
      if (index !== -1) {
        this.$set(this.transactions, index, { ...this.editedTransaction });
        this.calculateTotals();
        this.closeDialog();
        this.showSnackbar('Transaction updated successfully.', 'success');
      }
    },
    closeDialog() {
      this.dialog = false;
      this.editedTransaction = {};
      this.originalTransaction = {};
    },

    // Updated deleteTransaction method
    deleteTransaction(id) {
      const transaction = this.transactions.find(t => t.id === id);
      if (transaction) {
        this.transactionToDelete = transaction;
        this.deleteDialog = true;
      }
    },
    confirmDelete() {
      if (this.transactionToDelete) {
        const index = this.transactions.findIndex(t => t.id === this.transactionToDelete.id);
        if (index !== -1) {
          this.transactions.splice(index, 1);
          this.calculateTotals();
          this.showSnackbar('Transaction deleted successfully.', 'success');
        }
        this.transactionToDelete = null;
        this.deleteDialog = false;
      }
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
      this.transactionToDelete = null;
    },

    // Snackbar method
    showSnackbar(message, color) {
      this.snackbar.text = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  },
  watch: {
    transactions: {
      deep: true,
      handler(newTransactions) {
        localStorage.setItem('transactions', JSON.stringify(newTransactions));
      }
    }
  },
  filters: {
    currency(value) {
      if (typeof value !== "number") {
        return value;
      }
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
  }
};
</script>

<style scoped>
.actions-cell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
