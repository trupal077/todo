import { clientService } from "@/utils/services";
import AntDesign from "@expo/vector-icons/AntDesign";
import CheckBox from "@react-native-community/checkbox";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import Toast from "react-native-toast-message";

const Home = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [isSubmitting, setIsSubmitting] = useState(false); // For handling submission loader

  const getTodos = async () => {
    setLoading(true); // Show loader while fetching
    try {
      const res = await clientService.get("todos");
      if (res?.status) {
        setTodos(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Hide loader after fetching
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
    setIsSubmitting(true); // Show loader during submission
    try {
      const data = {
        todo_name: todo,
        completed: false,
      };
      const res = await clientService.post("addTodo", data);
      console.log("AddTodo response:", res);

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
      setIsSubmitting(false); // Hide loader after submission
    }
  };

  const handleDelete = async (id: any) => {
    setLoading(true); // Show loader while deleting
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
      setLoading(false); // Hide loader after deletion
    }
  };

  const handleCheckboxChange = async (id: any, value: any) => {
    try {
      const updatedTodos: any = todos.map((todo: any) =>
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

  const renderItem = ({ item }: any) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item.todo_name}</Text>
      <View style={styles.actionContainer}>
        <CheckBox
          value={item.completed}
          onValueChange={(value) => handleCheckboxChange(item._id, value)}
        />
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Todo</Text>
        <TextInput
          value={todo}
          onChangeText={setTodo}
          style={styles.input}
          placeholder="Add a new todo"
        />
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#0000ff" /> // Loader while adding
        ) : (
          <Button title="Add Todo" onPress={handleAddTodo} />
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Loader while fetching
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item: any) => item._id.toString()}
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
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  todoItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
