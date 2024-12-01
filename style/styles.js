import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15, // Spazio extra tra i label
    marginTop: 5, // Spazio aggiuntivo sopra
    color: "#444",
  },
  cardFullNameLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 6,
    color: "#444",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 360, // Ampio spazio sopra i pulsanti
    marginBottom: 10,
  },
  bottone: {
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 10, // Spazio tra i pulsanti
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  bottoneTesto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  item: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "flex-start",
    minHeight: 60,
  },
  fullWidthItem: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    minHeight: 60,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default styles;