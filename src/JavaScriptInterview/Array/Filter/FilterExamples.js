import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';

// --- Data for Examples ---
const usersData = [
  { id: 'u1', name: 'Alice', role: 'admin', active: true, country: 'USA' },
  { id: 'u2', name: 'Bob', role: 'user', active: false, country: 'Canada' },
  { id: 'u3', name: 'Charlie', role: 'editor', active: true, country: 'USA' },
  { id: 'u4', name: 'David', role: 'user', active: true, country: 'UK' },
  { id: 'u5', name: 'Eve', role: 'admin', active: false, country: 'Canada' },
  { id: 'u6', name: 'Frank', role: 'user', active: true, country: 'USA' },
];

const tasksData = [
  { id: 't1', title: 'Implement login screen', status: 'pending', priority: 'high' },
  { id: 't2', title: 'Design home page UI', status: 'completed', priority: 'medium' },
  { id: 't3', title: 'Fix bug in user profile', status: 'pending', priority: 'high' },
  { id: 't4', title: 'Write API documentation', status: 'in-progress', priority: 'low' },
  { id: 't5', title: 'Review code for feature X', status: 'pending', priority: 'medium' },
];

const categories = ['All', 'admin', 'user', 'editor'];
const taskStatuses = ['All', 'pending', 'completed', 'in-progress'];

const FilterExamples = () => {
  const [users, setUsers] = useState(usersData);
  const [tasks, setTasks] = useState(tasksData);

  // State for filtering users
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // State for filtering tasks
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [selectedTaskStatus, setSelectedTaskStatus] = useState('All');

  // --- High-Level Use 1: Filtering a List based on User Input (Search) ---
  const filteredUsersByName = useCallback(() => {
    if (!searchTerm) {
      return users; // Return all users if search term is empty
    }
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // --- High-Level Use 2: Filtering based on Multiple Criteria (Dropdowns, Toggles) ---
  const getCombinedFilteredUsers = useCallback(() => {
    let filtered = users;

    // Filter by role
    if (selectedRole !== 'All') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by active status
    if (showActiveOnly) {
      filtered = filtered.filter(user => user.active);
    }

    // Combine with search term (if present)
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [users, searchTerm, selectedRole, showActiveOnly]);

  // --- High-Level Use 3: Filtering for Dynamic Status/State ---
  const getFilteredTasks = useCallback(() => {
    let filtered = tasks;

    // Filter by task status
    if (selectedTaskStatus !== 'All') {
      filtered = filtered.filter(task => task.status === selectedTaskStatus);
    }

    // Filter by search term in title
    if (taskSearchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(taskSearchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, taskSearchTerm, selectedTaskStatus]);

  // --- Render Item for FlatList ---
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userRole}>({item.role})</Text>
      <Text style={[styles.userStatus, item.active ? styles.activeUser : styles.inactiveUser]}>
        {item.active ? 'Active' : 'Inactive'}
      </Text>
      <Text style={styles.userCountry}>{item.country}</Text>
    </View>
  );

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={[styles.taskStatusText, styles[item.status]]}>Status: {item.status}</Text>
      <Text style={styles.taskPriority}>Priority: {item.priority}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`filter()` High-Level Examples</Text>
      <Text style={styles.description}>
        Dynamically selecting and displaying subsets of data in React Native.
      </Text>

      {/* --- 1 & 2. Filtering Users --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1 & 2. Dynamic User Filtering</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Search user by name..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by Role:</Text>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedRole === cat && styles.selectedChip]}
              onPress={() => setSelectedRole(cat)}
            >
              <Text style={[styles.chipText, selectedRole === cat && styles.selectedChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowActiveOnly(prev => !prev)}
        >
          <Text style={styles.toggleButtonText}>
            Show Active Users Only: {showActiveOnly ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subSubHeader}>Filtered Users:</Text>
        <FlatList
          data={getCombinedFilteredUsers()}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          ListEmptyComponent={<Text style={styles.emptyListText}>No users match criteria.</Text>}
          style={styles.flatListContainer}
        />
      </View>

      {/* --- 3. Filtering Tasks --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Dynamic Task Filtering</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Search task by title..."
          value={taskSearchTerm}
          onChangeText={setTaskSearchTerm}
        />
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by Status:</Text>
          {taskStatuses.map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.chip, selectedTaskStatus === status && styles.selectedChip]}
              onPress={() => setSelectedTaskStatus(status)}
            >
              <Text style={[styles.chipText, selectedTaskStatus === status && styles.selectedChipText]}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subSubHeader}>Filtered Tasks:</Text>
        <FlatList
          data={getFilteredTasks()}
          keyExtractor={item => item.id}
          renderItem={renderTaskItem}
          ListEmptyComponent={<Text style={styles.emptyListText}>No tasks match criteria.</Text>}
          style={styles.flatListContainer}
        />
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
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  chip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  selectedChip: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  chipText: {
    color: '#555',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  flatListContainer: {
    maxHeight: 300, // Limit height for demo
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  userStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  activeUser: {
    color: '#28a745',
  },
  inactiveUser: {
    color: '#dc3545',
  },
  userCountry: {
    fontSize: 14,
    color: '#888',
    flex: 1,
    textAlign: 'right',
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#888',
  },
  taskItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pending: {
    color: '#ffc107',
  },
  completed: {
    color: '#28a745',
  },
  'in-progress': {
    color: '#007bff',
  },
  taskPriority: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default FilterExamples;