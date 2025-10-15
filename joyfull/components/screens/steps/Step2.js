import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Correct SafeArea import

export default function Step2({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    "#Holidays",
    "#Music",
    "#Travel",
    "#Fitness",
    "#Fashion",
    "#Sports",
    "#Movies",
    "#Tech",
    "#Gaming",
  ];

  const toggleCategory = (item) => {
    if (selectedCategories.includes(item)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== item));
    } else {
      setSelectedCategories([...selectedCategories, item]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <TouchableOpacity
              key={step}
              style={[
                styles.circle,
                step === 2 ? styles.activeCircle : styles.inactiveCircle,
              ]}
              onPress={() => navigation.navigate(`Step${step}`)}
            >
              <Text
                style={[
                  styles.circleText,
                  step === 2 ? styles.activeCircleText : null,
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>What are you interested in?</Text>
      <Text style={styles.subtitle}>
        Choose a few categories you like, you can change them later
      </Text>

      {/* Category Grid */}
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryBox,
              selectedCategories.includes(item) && styles.selectedBox,
            ]}
            onPress={() => toggleCategory(item)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategories.includes(item) && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Next Step Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Step3")}
      >
        <Text style={styles.nextButtonText}>Next Step</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backText: {
    color: "#ccc",
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCircle: {
    backgroundColor: "#ff3b30",
  },
  inactiveCircle: {
    backgroundColor: "#222",
  },
  circleText: {
    color: "#888",
    fontWeight: "bold",
  },
  activeCircleText: {
    color: "#fff",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 30,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryBox: {
    backgroundColor: "#1a1a1a",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedBox: {
    backgroundColor: "#00c851",
  },
  categoryText: {
    color: "#aaa",
    fontSize: 16,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#00c851",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
