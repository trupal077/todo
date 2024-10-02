import { clientService } from "@/utils/services";
import AntDesign from "@expo/vector-icons/AntDesign";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import Toast from "react-native-toast-message";

interface Todo {
  _id: string;
  todo_name: string;
  completed: boolean;
}

const Home = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getTodos = async () => {
    setLoading(true);
    try {
      const res = await clientService.get("todos");
      if (res?.status) {
        setTodos(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!todo.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a todo",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const data = {
        todo_name: todo,
        completed: false,
      };
      const res = await clientService.post("addTodo", data);
      if (res?.status) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res?.data?.message,
        });
        getTodos();
        setTodo("");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res?.data || "Failed to add todo",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await clientService.delete(`todos/${id}`);
      if (res?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Deleted",
          text2: "Todo has been deleted successfully",
        });
        getTodos();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (id: string, value: boolean) => {
    try {
      const updatedTodos: Todo[] = todos.map((todo) =>
        todo._id === id ? { ...todo, completed: value } : todo
      );
      setTodos(updatedTodos);

      await clientService.post(`todos/${id}`, { completed: value });
      Toast.show({
        type: "info",
        text1: "Updated",
        text2: "Todo status has been updated",
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <Text style={[styles.todoText, item.completed && styles.completedText]}>
        {item.todo_name}
      </Text>
      <View style={styles.actionContainer}>
        <Checkbox
          value={item.completed}
          onValueChange={(value) => handleCheckboxChange(item._id, value)}
          color={item.completed ? "#4630EB" : undefined}
        />
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <AntDesign name="delete" size={24} color="#FF3D00" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={todo}
          onChangeText={setTodo}
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="#888"
        />
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#4630EB" />
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Text style={styles.addButtonText}>Add Todo</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4630EB" />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No todos available</Text>
          }
        />
      )}
      <Toast
        config={{
          success: (internalState) => (
            <Animated.View
              entering={SlideInRight.springify().stiffness(100)}
              exiting={SlideOutLeft}
              style={styles.toastContainer}
            >
              <Text style={styles.toastText}>
                {internalState?.text1}: {internalState?.text2}
              </Text>
            </Animated.View>
          ),
          error: (internalState) => (
            <Animated.View
              entering={SlideInRight.springify().stiffness(100)}
              exiting={SlideOutLeft}
              style={[styles.toastContainer, styles.toastError]}
            >
              <Text style={styles.toastText}>
                {internalState?.text1}: {internalState?.text2}
              </Text>
            </Animated.View>
          ),
          info: (internalState) => (
            <Animated.View
              entering={SlideInRight.springify().stiffness(100)}
              exiting={SlideOutLeft}
              style={[styles.toastContainer, styles.toastInfo]}
            >
              <Text style={styles.toastText}>
                {internalState?.text1}: {internalState?.text2}
              </Text>
            </Animated.View>
          ),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4630EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 10,
  },
  todoItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  toastContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toastError: {
    backgroundColor: "#f44336",
  },
  toastInfo: {
    backgroundColor: "#2196F3",
  },
});

export default Home;
