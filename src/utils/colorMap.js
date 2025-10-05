// utils/colorMap.js
export const kelvinToRGB = (temp) => {
  temp = temp / 100;
  let r = temp <= 66 ? 255 : Math.min(255, 329.698727446 * Math.pow(temp - 60, -0.1332047592));
  let g = temp <= 66 ? 99.4708025861 * Math.log(temp) - 161.1195681661 : 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
  let b = temp >= 66 ? 255 : Math.max(0, temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307);
  return [Math.clamp(r, 0, 255), Math.clamp(g, 0, 255), Math.clamp(b, 0, 255)];
};