import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View, StyleSheet} from "react-native"
import Ripple from 'components/UI/Ripple'
const ViewButton = ({
  activeOpacity,
  onButtonPress,
  buttonSize = 60,
  text,
  customComponent,
  customViewStyle,
  accessible,
  accessibilityLabel,
  disabled,
  customTextStyle,
}) => {
  return (
    <View          
      style={PinViewStyle.buttonContainer}>
      <Ripple
        accessible={accessible}
      accessibilityRole="keyboardkey"
      accessibilityLabel={customComponent !== undefined ? accessibilityLabel : text}
        disabled={disabled}
        onPress={onButtonPress}
        rippleContainerBorderRadius={buttonSize * 2}
        style={[
          PinViewStyle.buttonView,
          customViewStyle,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        ]}>
        {customComponent !== undefined ? (
          customComponent
        ) : (
          <Text style={[PinViewStyle.buttonText, customTextStyle]}>{text}</Text>
        )}
      </Ripple>
    </View>
  )
}

const ViewInput = ({
  showInputText = false,
  inputTextStyle,
  size = 40,
  customStyle,
  text,
  inputFilledStyle = { backgroundColor: "#000" },
  inputEmptyStyle = { backgroundColor: "#FFF" },
}) => {
  if (showInputText) {
    return (
      <View
        style={[
          PinViewStyle.inputView,
          customStyle,
          { width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" },
          text !== undefined ? inputFilledStyle : inputEmptyStyle,
        ]}>
        <Text style={[PinViewStyle.inputText, inputTextStyle]}>{text}</Text>
      </View>
    )
  } else {
    return (
      <View
        style={[
          PinViewStyle.inputView,
          customStyle,
          { width: size, height: size, borderRadius: size / 2 },
          text !== undefined ? inputFilledStyle : inputEmptyStyle,
        ]}
      />
    )
  }
}

const ViewHolder = () => {
  return <View style={PinViewStyle.buttonContainer} />
}

const Pin = React.forwardRef(
  (
    {
      buttonTextByKey,
      accessible,
      style,
      onButtonPress,
      onValueChange,
      buttonAreaStyle,
      inputAreaStyle,
      inputViewStyle,
      activeOpacity,
      pinLength,
      buttonSize,
      buttonViewStyle,
      buttonTextStyle ,
      inputViewEmptyStyle,
      inputViewFilledStyle,
      showInputText,
      inputTextStyle,
      inputSize,
      disabled,

      customLeftButton,
      customRightButton,
      customRightAccessibilityLabel,
      customLeftAccessibilityLabel,
      customLeftButtonViewStyle,
      customRightButtonViewStyle,
      customLeftButtonDisabled,
      customRightButtonDisabled,


      clearText
    },
    ref
  ) => {
    const [input, setInput] = useState("")
    ref.current = {
      clear: () => {
        if (input.length > 0) {
          setInput(input.slice(0, -1))
        }
      },
      clearAll: () => {
        if (input.length > 0) {
          setInput("")
        }
      },
    }

    const onButtonPressHandle = (key, value) => {
      onButtonPress(key)
      if (input.length < pinLength) {
        setInput(input + "" + value)
      }
    }

    useEffect(() => {
      if (onValueChange!==undefined){
         onValueChange(input)
      }
    }, [input])

    useEffect(() => {
        if (clearText == 0 || clearText == 1)if (input.length > 0)setInput(input.slice(0, -1));
        if (clearText == 2 || clearText == 3)if (input.length > 0)setInput("");      
    }, [clearText])


    return (
      <View style={[PinViewStyle.pinView, style]}>
        <View style={[PinViewStyle.inputContainer, inputAreaStyle]}>
          {Array.apply(null, { length: pinLength }).map((e, i) => (
            <ViewInput
              inputTextStyle={inputTextStyle}
              showInputText={showInputText}
              inputEmptyStyle={inputViewEmptyStyle}
              inputFilledStyle={inputViewFilledStyle}
              text={input[i]}
              customStyle={inputViewStyle}
              size={inputSize}
              key={"input-view-" + i}
            />
          ))}
        </View>
        <View style={[PinViewStyle.buttonAreaContainer, buttonAreaStyle]}>
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("one", "1")}
            buttonSize={buttonSize}
            text={buttonTextByKey.one}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("two", "2")}
            buttonSize={buttonSize}
            text={buttonTextByKey.two}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("three", "3")}
            buttonSize={buttonSize}
            text={buttonTextByKey.three}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("four", "4")}
            buttonSize={buttonSize}
            text={buttonTextByKey.four}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("five", "5")}
            buttonSize={buttonSize}
            text={buttonTextByKey.five}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("six", "6")}
            buttonSize={buttonSize}
            text={buttonTextByKey.six}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("seven", "7")}
            buttonSize={buttonSize}
            text={buttonTextByKey.seven}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("eight", "8")}
            buttonSize={buttonSize}
            text={buttonTextByKey.eight}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("nine", "9")}
            buttonSize={buttonSize}
            text={buttonTextByKey.nine}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          {customLeftButton !== undefined ? (
            <ViewButton
              disabled={customLeftButtonDisabled}
              accessible={accessible}
              activeOpacity={activeOpacity}
              accessibilityLabel={customLeftAccessibilityLabel}
              onButtonPress={() => onButtonPress("custom_left")}
              customViewStyle={customLeftButtonViewStyle}
              customComponent={customLeftButton}
            />
          ) : (
            <ViewHolder />
          )}
          <ViewButton
            disabled={disabled}
            accessible={accessible}
            activeOpacity={activeOpacity}
            onButtonPress={() => onButtonPressHandle("zero", "0")}
            buttonSize={buttonSize}
            text={buttonTextByKey.zero}
            customTextStyle={buttonTextStyle}
            customViewStyle={buttonViewStyle}
          />
          {customRightButton !== undefined ? (
            <ViewButton
              disabled={customRightButtonDisabled}
              accessible={accessible}
              activeOpacity={activeOpacity}
              accessibilityLabel={customRightAccessibilityLabel}
              onButtonPress={() => onButtonPress("custom_right")}
              customViewStyle={customRightButtonViewStyle}
              customComponent={customRightButton}
            />
          ) : (
            <ViewHolder />
          )}
        </View>
      </View>
    )
  }
)

Pin.defaultProps = {
  buttonTextByKey: {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    zero: "0",
  },
  clearText:false,
  accessible: false,
  onButtonPress: () => {},
  inputTextStyle : { color: "#FFF" },
  buttonAreaStyle : { marginVertical: 12 },
  inputAreaStyle : { marginVertical: 12 },
  activeOpacity :0.9,
  buttonTextStyle : { color: "#FFF", fontSize: 30 },
  customRightAccessibilityLabel : "right",
  customLeftAccessibilityLabel : "left",
  disabled: false,
  customLeftButtonDisabled: false,
  customRightButtonDisabled: false,
}

const PinViewStyle = StyleSheet.create({
  pinView: {
    alignItems: "center",
  },
  buttonAreaContainer: {
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonContainer: {
    marginBottom: 12,
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonView: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
  },
  inputView: {
    margin: 6,
    backgroundColor: "#a3a7b9",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default Pin