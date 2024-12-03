import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a73e8",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1a73e8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorInput: {
    borderColor: "#dc3545",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  }
});

export default styles;