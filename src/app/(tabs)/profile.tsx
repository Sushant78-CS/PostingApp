import React, { useState } from "react";
import {
    Button,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("#1dc9b8");
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        Selected: {color}
      </Text>
      <Button title="Open Modal" onPress={() => setIsOpen(true)} />
      <Modal transparent visible={isOpen} animationType="slide">
        <TouchableOpacity
          style={[styles.overlay]}
          onPress={() => setIsOpen(false)}
        >
          {/* <TouchableOpacity
            activeOpacity={1}
            style={[styles.sheet, { height: 400 }]}
          > */}

          <View style={[styles.sheet]}>
            <Text>Pick a color</Text>
            <ColorPicker
              color={color}
              onColorChange={setColor}
              onColorChangeComplete={(c) => setColor(c)}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
            ></ColorPicker>
            {/* </TouchableOpacity> */}
          </View>
          <View style={[styles.sheet]}>
            <Text>Hello Sumit</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 280,
    marginTop: 20,
  },
});
