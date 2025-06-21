import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';

// --- Data for Examples ---
const shoppingCartItems = [
  { id: 'item1', name: 'Laptop', price: 1200, quantity: 1 },
  { id: 'item2', name: 'Mouse', price: 25, quantity: 2 },
  { id: 'item3', name: 'Keyboard', price: 75, quantity: 1 },
  { id: 'item4', name: 'Monitor', price: 300, quantity: 1 },
];

const studentScores = [
  { name: 'Alice', scores: { math: 85, science: 90, history: 78 } },
  { name: 'Bob', scores: { math: 92, science: 88, history: 95 } },
  { name: 'Charlie', scores: { math: 70, science: 75, history: 80 } },
];

const transactionLogs = [
  { id: 't1', type: 'deposit', amount: 100, date: '2025-06-01' },
  { id: 't2', type: 'withdrawal', amount: 50, date: '2025-06-02' },
  { id: 't3', type: 'deposit', amount: 200, date: '2025-06-02' },
  { id: 't4', type: 'withdrawal', amount: 30, date: '2025-06-03' },
  { id: 't5', type: 'deposit', amount: 150, date: '2025-06-03' },
];

const ReduceExamples = () => {
  // State for Example 1: Calculating total
  const [cartTotal, setCartTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // State for Example 2: Processing student scores
  const [studentGrades, setStudentGrades] = useState({});
  const [highestScoreOverall, setHighestScoreOverall] = useState(0);

  // State for Example 3: Summarizing transactions
  const [transactionSummary, setTransactionSummary] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    netBalanceChange: 0,
    transactionsByDate: {},
  });

  // --- High-Level Use 1: Calculating Totals/Aggregates ---
  useEffect(() => {
    console.log("REDUCE: Calculating shopping cart totals...");
    const total = shoppingCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const count = shoppingCartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartTotal(total);
    setTotalItems(count);
  }, []); // Runs once on mount

  // --- High-Level Use 2: Transforming and Structuring Data ---
  useEffect(() => {
    console.log("REDUCE: Processing student scores...");

    // Calculate average score for each student
    const grades = studentScores.reduce((acc, student) => {
      const { math, science, history } = student.scores;
      const average = (math + science + history) / 3;
      acc[student.name] = average.toFixed(2); // Store average as string
      return acc;
    }, {});
    setStudentGrades(grades);

    // Find the highest single score across all students and subjects
    const highestScore = studentScores.reduce((maxScore, student) => {
      const scoresArray = Object.values(student.scores); // [85, 90, 78]
      const studentMax = Math.max(...scoresArray); // 90
      return Math.max(maxScore, studentMax); // Compare with overall max
    }, 0); // Initial max score is 0
    setHighestScoreOverall(highestScore);
  }, []); // Runs once on mount

  // --- High-Level Use 3: Grouping Data ---
  useEffect(() => {
    console.log("REDUCE: Summarizing transaction logs...");

    const summary = transactionLogs.reduce((acc, transaction) => {
      // Group by date
      if (!acc.transactionsByDate[transaction.date]) {
        acc.transactionsByDate[transaction.date] = [];
      }
      acc.transactionsByDate[transaction.date].push(transaction);

      // Sum deposits and withdrawals
      if (transaction.type === 'deposit') {
        acc.totalDeposits += transaction.amount;
        acc.netBalanceChange += transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        acc.totalWithdrawals += transaction.amount;
        acc.netBalanceChange -= transaction.amount;
      }
      return acc;
    }, {
      totalDeposits: 0,
      totalWithdrawals: 0,
      netBalanceChange: 0,
      transactionsByDate: {}, // Initialize as an empty object for grouping
    });
    setTransactionSummary(summary);
  }, []); // Runs once on mount

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`reduce()` High-Level Examples</Text>
      <Text style={styles.description}>
        Boiling down arrays to a single value, object, or aggregated data.
      </Text>

      {/* 1. Calculating Totals/Aggregates */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Shopping Cart Summary</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.statusText}>Total Items in Cart: {totalItems}</Text>
          <Text style={styles.statusText}>Cart Total: ${cartTotal.toFixed(2)}</Text>
          <Text style={styles.subContent}>
            (Calculated from `shoppingCartItems` using `reduce`)
          </Text>
        </View>
      </View>

      {/* 2. Transforming and Structuring Data */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Student Score Analysis</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.subSubHeader}>Average Scores:</Text>
          {Object.keys(studentGrades).length > 0 ? (
            Object.entries(studentGrades).map(([name, avg]) => (
              <Text key={name} style={styles.listItemText}>• {name}: {avg}</Text>
            ))
          ) : (
            <ActivityIndicator size="small" color="#007bff" />
          )}
          <Text style={styles.subSubHeader}>Highest Individual Score:</Text>
          <Text style={styles.statusText}>{highestScoreOverall}</Text>
          <Text style={styles.subContent}>
            (Averages and highest score derived using `reduce`)
          </Text>
        </View>
      </View>

      {/* 3. Grouping Data */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Transaction Summary & Grouping</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.statusText}>Total Deposits: ${transactionSummary.totalDeposits.toFixed(2)}</Text>
          <Text style={styles.statusText}>Total Withdrawals: ${transactionSummary.totalWithdrawals.toFixed(2)}</Text>
          <Text style={styles.statusText}>Net Balance Change: ${transactionSummary.netBalanceChange.toFixed(2)}</Text>

          <Text style={styles.subSubHeader}>Transactions by Date:</Text>
          {Object.keys(transactionSummary.transactionsByDate).length > 0 ? (
            Object.entries(transactionSummary.transactionsByDate).map(([date, transactions]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>Date: {date}</Text>
                {transactions.map(t => (
                  <Text key={t.id} style={styles.transactionItem}>
                    • {t.type}: ${t.amount.toFixed(2)}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <ActivityIndicator size="small" color="#007bff" />
          )}
          <Text style={styles.subContent}>
            (All summaries and groupings created with a single `reduce` operation)
          </Text>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
    paddingTop: 50,
  },
  mainHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  subSubHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#555',
  },
  exampleContainer: {
    backgroundColor: '#fefefe',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    marginBottom: 3,
  },
  subContent: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  dateGroup: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dateHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  transactionItem: {
    fontSize: 14,
    marginLeft: 10,
    color: '#555',
  },
});

export default ReduceExamples;