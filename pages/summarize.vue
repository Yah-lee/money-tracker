<template>
  <v-container class="pa-5">
    <!-- Transaction Form (Add New) -->
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

    <!-- Transactions Table -->
    <v-data-table
      :headers="headers"
      :items="transactions"
      item-key="id"
      class="elevation-1"
    >
      <!-- แก้ไขจุดนี้: ตรวจสอบว่ามี date หรือไม่ก่อน new Date(...) -->
      <template v-slot:item.date="{ item }">
        <span v-if="item.date">
          {{ new Date(item.date).toLocaleDateString() }}
        </span>
        <span v-else>
          -
        </span>
      </template>

      <template v-slot:item.amount="{ item }">
        {{ item.amount | currency }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          small
          color="primary"
          @click="openEditDialog(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon small color="error" @click="deleteTransaction(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
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

    <!-- Dialog สำหรับแก้ไขรายการ -->
    <v-dialog
      v-model="editDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">Edit Transaction</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedTransaction.date"
                  label="Date"
                  type="date"
                  required
                  outlined
                  dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedTransaction.description"
                  label="Description"
                  required
                  outlined
                  dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="editedTransaction.category"
                  :items="categories"
                  label="Category"
                  required
                  outlined
                  dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editedTransaction.amount"
                  label="Amount"
                  type="number"
                  required
                  outlined
                  dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="editedTransaction.paymentMethod"
                  :items="paymentMethods"
                  label="Payment Method"
                  required
                  outlined
                  dense
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="cancelEdit">Cancel</v-btn>
          <v-btn text color="primary" @click="updateTransaction">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        amount: 0,
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
      transactions: [],
      // ส่วนของการแก้ไข
      editDialog: false,
      editedTransaction: null,
      editedIndex: -1,

      headers: [
        { text: "Date", value: "date" },
        { text: "Description", value: "description" },
        { text: "Category", value: "category" },
        { text: "Amount", value: "amount" },
        { text: "Payment Method", value: "paymentMethod" },
        // เพิ่มคอลัมน์ Actions
        { text: "Actions", value: "actions", sortable: false },
      ],
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      totalCash: 0,
      totalBankTransfer: 0,
      totalCreditCard: 0,
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
    // คำนวณยอดหลังโหลดข้อมูล
    this.calculateTotals();
  },
  methods: {
    // เพิ่มรายการใหม่
    addTransaction() {
      // ป้องกันกรอก amount ผิด
      if (isNaN(this.transaction.amount) || this.transaction.amount <= 0) return;
      // สร้างรายการพร้อม id (เวลาปัจจุบัน)
      this.transactions.push({ ...this.transaction, id: Date.now() });
      this.resetForm();
      this.calculateTotals();
    },
    // รีเซตฟอร์ม
    resetForm() {
      this.transaction = {
        date: "",
        description: "",
        category: "",
        amount: 0,
        paymentMethod: "",
      };
    },
    // คำนวณยอด
    calculateTotals() {
      this.totalIncome = this.transactions
        .filter(
          (t) =>
            t.category === "Sales" ||
            t.category === "Service Income" ||
            t.category === "Interest"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalExpenses = this.transactions
        .filter(
          (t) =>
            t.category === "Housing" ||
            t.category === "Marketing" ||
            t.category === "General Expenses" ||
            t.category === "Wages"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      this.netProfit = this.totalIncome - this.totalExpenses;

      // Calculate totals for each payment method
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

    // ฟังก์ชันเปิด Dialog แก้ไข
    openEditDialog(item) {
      // หา index ของ item ที่ต้องการแก้ไข
      this.editedIndex = this.transactions.findIndex((t) => t.id === item.id);
      // ทำสำเนาของ item ไปยัง editedTransaction เพื่อแก้ไข
      this.editedTransaction = { ...item };
      this.editDialog = true;
    },

    // บันทึกการแก้ไข
    updateTransaction() {
      if (this.editedIndex > -1) {
        // ใช้ splice เพื่อแทนที่ค่าเก่า
        this.transactions.splice(this.editedIndex, 1, {
          ...this.editedTransaction,
        });
        this.calculateTotals();
      }
      this.editDialog = false;
      this.editedTransaction = null;
      this.editedIndex = -1;
    },

    // ยกเลิกแก้ไข
    cancelEdit() {
      this.editDialog = false;
      this.editedTransaction = null;
      this.editedIndex = -1;
    },

    // ลบรายการ
    deleteTransaction(item) {
      const index = this.transactions.findIndex((t) => t.id === item.id);
      if (index > -1) {
        this.transactions.splice(index, 1);
      }
      this.calculateTotals();
    },
  },
  watch: {
    // Watch เพื่อเก็บข้อมูลลง localStorage ทุกครั้งที่ transactions เปลี่ยน
    transactions: {
      deep: true,
      handler(newTransactions) {
        localStorage.setItem("transactions", JSON.stringify(newTransactions));
      },
    },
  },
  filters: {
    currency(value) {
      return Number(value).toFixed(2);
    },
  },
};
</script>
