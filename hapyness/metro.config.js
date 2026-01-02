const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable CSS support
config.transformer.unstable_allowRequireContext = true;

module.exports = config;