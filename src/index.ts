import {
    Accessory,
    uuid,
    Service,
    Characteristic,
    CharacteristicEventTypes,
    Categories,
    CharacteristicValue,
} from "hap-nodejs";

import { Gpio } from "onoff";

const led = new Gpio(17, "out");

// optionally set a different storage location with code below
// hap.HAPStorage.setCustomStoragePath("...");

const accessoryUuid = uuid.generate("hap.snow.light");
const accessory = new Accessory("Snow's Lightbulb", accessoryUuid);

const lightService = new Service.Lightbulb("Lightbulb");

let currentLightState: CharacteristicValue = false; // on or off
let currentBrightnessLevel: CharacteristicValue = 100;

function setLightState(value: CharacteristicValue) {
    currentLightState = value;
    led.write(value ? 1 : 0);
}

function setBrightnessLevel(value: CharacteristicValue) {
    currentBrightnessLevel = value;
}

// 'On' characteristic is required for the light service
const onCharacteristic = lightService.getCharacteristic(Characteristic.On);
// 'Brightness' characteristic is optional for the light service; 'getCharacteristic' will automatically add it to the service!
const brightnessCharacteristic = lightService.getCharacteristic(
    Characteristic.Brightness,
);

// with the 'on' function we can add event handlers for different events, mainly the 'get' and 'set' event
onCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    console.log("Queried current light state: " + currentLightState);
    callback(undefined, currentLightState);
});
onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log("Setting light state to: " + value);
    setLightState(value);
    callback();
});

brightnessCharacteristic.on(CharacteristicEventTypes.GET, (callback) => {
    console.log("Queried current brightness level: " + currentBrightnessLevel);
    callback(undefined, currentBrightnessLevel);
});
brightnessCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    console.log("Setting brightness level to: " + value);
    setBrightnessLevel(value);
    callback();
});

accessory.addService(lightService); // adding the service to the accessory

// once everything is set up, we publish the accessory. Publish should always be the last step!
accessory.publish({
    username: "17:51:07:F4:BC:8A",
    pincode: "678-90-876",
    port: 47129,
    category: Categories.LIGHTBULB, // value here defines the symbol shown in the pairing screen
});

process.on("SIGINT", (_) => {
    led.unexport();
});

console.log("Accessory setup finished!");
