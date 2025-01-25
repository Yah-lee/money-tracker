<template>
    <v-container class="pa-5">
      <!-- Transaction Form -->
      <v-form @submit.prevent="addTransaction" class="mb-6">
        <v-row>
          <!-- Date Field -->
          <v-col cols="12" md="6">
            <v-text-field v-model="transaction.date" label="ວັນທີ່/ເດືອນ/ປີ" type="date" required outlined dense />
          </v-col>
  
          <!-- Description Field -->
          <v-col cols="12" md="6">
            <v-text-field v-model="transaction.description" label="ລາຍລະອຽດ" required outlined dense />
          </v-col>
  
          <!-- Category Field -->
          <v-col cols="12" md="6">
            <v-select v-model="transaction.category" :items="categories" label="ປະເພດ" required outlined dense />
          </v-col>
  
          <!-- Amount Field -->
          <v-col cols="12" md="6">
            <v-text-field v-model.number="transaction.amount" label="ຈຳນວນ (₭)" type="number" required outlined dense />
          </v-col>
  
          <!-- Payment Method Field -->
          <v-col cols="12" md="6">
            <v-select v-model="transaction.paymentMethod" :items="paymentMethods" label="ວິທີການຊຳລະເງີນ" required
              outlined dense />
          </v-col>
  
          <!-- Submit Button -->
          <v-col cols="12">
            <v-btn type="submit" color="primary" class="text-transform-none" elevation="2" large block>
              ການເພີ່ມທຸລະກໍາ
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
  
      <v-divider class="my-6"></v-divider>
  
      <!-- Transactions Table with Actions -->
      <v-data-table :headers="headers" :items="transactions" item-key="id" class="elevation-1">
        <template v-slot:item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template v-slot:item.amount="{ item }">
          {{ item.amount | currency }}
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end">
            <v-btn small color="blue" @click="editTransaction(item)" class="mr-2">
              ແກ້ໄຂ
            </v-btn>
            <v-btn small color="red" @click="deleteTransaction(item.id)"> ລຶບ </v-btn>
          </div>
        </template>
      </v-data-table>
  
      <!-- Totals Display -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-subheader>ລາຍໄດ້ລວມ : {{ totalIncome | currency }}</v-subheader>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-subheader> ເງີນໂອນທັງໝົດ : {{ totalBankTransfer | currency }} </v-subheader>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-subheader>ຄ່າໃຊ້ຈ່າຍທັງໝົດ : {{ totalExpenses | currency }}</v-subheader>
        </v-col>
  
        <!-- Payment Method Totals -->
        <v-col cols="12" md="4">
          <v-subheader>ເງີນສົດທັງໝົດ : {{ totalCash | currency }}</v-subheader>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-subheader>ກຳໄລ / ຂາດທຸນ ສຸດທິດ : {{ netProfit | currency }}</v-subheader>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-subheader> Credit Card: {{ totalCreditCard | currency }} </v-subheader>
        </v-col>
      </v-row>
  
      <!-- Edit Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">ແກ້ໄຂທຸລະກໍາ</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="updateTransaction">
              <v-text-field v-model="editedTransaction.date" label="ວັນທີ/ເດືອນ/ປີ" type="date" required outlined dense />
              <v-text-field v-model="editedTransaction.description" label="ລາຍລະອຽດ" required outlined dense />
              <v-select v-model="editedTransaction.category" :items="categories" label="ປະເພດ" required outlined dense />
              <v-text-field v-model.number="editedTransaction.amount" label="ຈຳນວນ (₭)" type="number" required outlined
                dense />
              <v-select v-model="editedTransaction.paymentMethod" :items="paymentMethods" label="ວິທີການຊຳລະເງີນ" required
                outlined dense />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog"> ຍົກເລີກ </v-btn>
            <v-btn color="blue darken-1" text @click="updateTransaction"> ບັນທືກ </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">ຢືນຢັນການລຶບ</v-card-title>
          <v-card-text> ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບທຸລະກຳນີ້ ? </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="closeDeleteDialog">ຍົກເລີກ</v-btn>
            <v-btn color="red darken-1" text @click="confirmDelete">ລຶບ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar for Feedback -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.text }}
        <v-btn text @click="snackbar.show = false">ປິດ</v-btn>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        transaction: {
          date: this.getCurrentDate(), // Initialize with current date
          description: "",
          category: "",
          amount: 0,
          paymentMethod: "",
        },
        categories: ["ການຂາຍ", "ເງີນເດືອນ", "ຄ່າໃຊ້ຈ່າຍທົ່ວໄປ"],
        paymentMethods: ["ເງີນສົດ", "ເງີນໂອນ", "Credit Card"],
        transactions: [],
        headers: [
          { text: "ເດືອນ/ວັນທີ/ປີ", value: "date" },
          { text: "ລາຍລະອຽດ", value: "description" },
          { text: "ປະເພດ", value: "category" },
          { text: "ຈໍານວນ (₭)", value: "amount" },
          { text: "ວິທີການຊໍາລະເງິນ", value: "paymentMethod" },
          { text: "", value: "actions", sortable: false },
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
          text: "",
          color: "",
        },
        // Optional: Current DateTime Display
        currentDateTime: "",
      };
    },
    created() {
      const savedTransactions = localStorage.getItem("transactions");
      if (savedTransactions) {
        try {
          this.transactions = JSON.parse(savedTransactions);
        } catch (e) {
          console.error("Error parsing transactions from localStorage:", e);
        }
      }
      this.calculateTotals();
      // Initialize currentDateTime if using dynamic display
      this.currentDateTime = this.getFormattedCurrentDateTime();
    },
    mounted() {
      // Optional: Update currentDateTime every second
      setInterval(() => {
        this.currentDateTime = this.getFormattedCurrentDateTime();
      }, 1000);
    },
    methods: {
      getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
      },
      getFormattedCurrentDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      },
      addTransaction() {
        // If date is empty, set it to current date
        if (!this.transaction.date) {
          this.transaction.date = this.getCurrentDate();
        }
  
        if (isNaN(this.transaction.amount) || this.transaction.amount <= 0) {
          this.showSnackbar("ກະລຸນາໃສ່ຈໍານວນທີ່ຖືກຕ້ອງ .", "error");
          return;
        }
        if (
          !this.transaction.description ||
          !this.transaction.category ||
          !this.transaction.paymentMethod
        ) {
          this.showSnackbar("Please fill in all required fields.", "error");
          return;
        }
        this.transactions.push({ ...this.transaction, id: Date.now() });
        this.resetForm();
        this.calculateTotals();
        this.showSnackbar("ເພີ່ມທຸລະກຳສຳເລັດແລ້ວ.", "success");
      },
      resetForm() {
        this.transaction = {
          date: this.getCurrentDate(), // Reset to current date
          description: "",
          category: "",
          amount: 0,
          paymentMethod: "",
        };
      },
      calculateTotals() {
        // Total Income: Sales
        this.totalIncome = this.transactions
          .filter((t) => t.category === "ການຂາຍ") // Ensure category matches your categories
          .reduce((sum, t) => sum + t.amount, 0);
  
        // Total Expenses: Wages + General Expenses
        this.totalExpenses = this.transactions
          .filter((t) => t.category === "ເງີນເດືອນ" || t.category === "ຄ່າໃຊ້ຈ່າຍທົ່ວໄປ")
          .reduce((sum, t) => sum + t.amount, 0);
  
        // Net Profit/Loss
        this.netProfit = this.totalIncome - this.totalExpenses;
  
        // Calculate totals for each payment method
        this.totalCash = this.transactions
          .filter((t) => t.paymentMethod === "ເງີນສົດ")
          .reduce((sum, t) => sum + t.amount, 0);
  
        this.totalBankTransfer = this.transactions
          .filter((t) => t.paymentMethod === "ເງີນໂອນ")
          .reduce((sum, t) => sum + t.amount, 0);
  
        this.totalCreditCard = this.transactions
          .filter((t) => t.paymentMethod === "Credit Card")
          .reduce((sum, t) => sum + t.amount, 0);
      },
      editTransaction(item) {
        this.editedTransaction = { ...item };
        this.originalTransaction = item;
        this.dialog = true;
      },
      updateTransaction() {
        if (
          !this.editedTransaction.amount ||
          isNaN(this.editedTransaction.amount) ||
          this.editedTransaction.amount <= 0
        ) {
          this.showSnackbar("Please enter a valid amount.", "error");
          return;
        }
        if (
          !this.editedTransaction.date ||
          !this.editedTransaction.description ||
          !this.editedTransaction.category ||
          !this.editedTransaction.paymentMethod
        ) {
          this.showSnackbar("Please fill in all required fields.", "error");
          return;
        }
  
        const index = this.transactions.findIndex(
          (t) => t.id === this.editedTransaction.id
        );
        if (index !== -1) {
          this.$set(this.transactions, index, { ...this.editedTransaction });
          this.calculateTotals();
          this.closeDialog();
          this.showSnackbar("ອັບເດດທຸລະກຳສຳເລັດແລ້ວ .", "success");
        }
      },
      closeDialog() {
        this.dialog = false;
        this.editedTransaction = {};
        this.originalTransaction = {};
      },
  
      // Delete Transaction
      deleteTransaction(id) {
        const transaction = this.transactions.find((t) => t.id === id);
        if (transaction) {
          this.transactionToDelete = transaction;
          this.deleteDialog = true;
        }
      },
      confirmDelete() {
        if (this.transactionToDelete) {
          const index = this.transactions.findIndex(
            (t) => t.id === this.transactionToDelete.id
          );
          if (index !== -1) {
            this.transactions.splice(index, 1);
            this.calculateTotals();
            this.showSnackbar("ລຶບທຸລະກຳສຳເລັດແລ້ວ .", "success");
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
      },
  
      // Format Date
      formatDate(date) {
        return new Date(date).toLocaleDateString("en-US");
      },
    },
    watch: {
      transactions: {
        deep: true,
        handler(newTransactions) {
          localStorage.setItem("transactions", JSON.stringify(newTransactions));
        },
      },
    },
    filters: {
      currency(value) {
        if (typeof value !== "number") {
          return value;
        }
        try {
          return value.toLocaleString("lo-LA", { style: "currency", currency: "LAK" });
        } catch (e) {
          return "₭" + value.toLocaleString("en-US", { minimumFractionDigits: 0 });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .actions-cell {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  </style>
  