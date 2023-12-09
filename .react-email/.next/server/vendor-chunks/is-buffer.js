/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-buffer";
exports.ids = ["vendor-chunks/is-buffer"];
exports.modules = {

/***/ "(rsc)/../node_modules/is-buffer/index.js":
/*!******************************************!*\
  !*** ../node_modules/is-buffer/index.js ***!
  \******************************************/
/***/ ((module) => {

eval("/*!\n * Determine if an object is a Buffer\n *\n * @author   Feross Aboukhadijeh <https://feross.org>\n * @license  MIT\n */ // The _isBuffer check is for Safari 5-7 support, because it's missing\n// Object.prototype.constructor. Remove this eventually\nmodule.exports = function(obj) {\n    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);\n};\nfunction isBuffer(obj) {\n    return !!obj.constructor && typeof obj.constructor.isBuffer === \"function\" && obj.constructor.isBuffer(obj);\n}\n// For Node v0.10 support. Remove this eventually.\nfunction isSlowBuffer(obj) {\n    return typeof obj.readFloatLE === \"function\" && typeof obj.slice === \"function\" && isBuffer(obj.slice(0, 0));\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1lbWFpbC1jbGllbnQvLi4vbm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcz9iMThiIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJvYmoiLCJpc0J1ZmZlciIsImlzU2xvd0J1ZmZlciIsIl9pc0J1ZmZlciIsImNvbnN0cnVjdG9yIiwicmVhZEZsb2F0TEUiLCJzbGljZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0NBS0MsR0FFRCxzRUFBc0U7QUFDdEUsdURBQXVEO0FBQ3ZEQSxPQUFPQyxPQUFPLEdBQUcsU0FBVUMsR0FBRztJQUM1QixPQUFPQSxPQUFPLFFBQVNDLENBQUFBLFNBQVNELFFBQVFFLGFBQWFGLFFBQVEsQ0FBQyxDQUFDQSxJQUFJRyxTQUFTLEFBQUQ7QUFDN0U7QUFFQSxTQUFTRixTQUFVRCxHQUFHO0lBQ3BCLE9BQU8sQ0FBQyxDQUFDQSxJQUFJSSxXQUFXLElBQUksT0FBT0osSUFBSUksV0FBVyxDQUFDSCxRQUFRLEtBQUssY0FBY0QsSUFBSUksV0FBVyxDQUFDSCxRQUFRLENBQUNEO0FBQ3pHO0FBRUEsa0RBQWtEO0FBQ2xELFNBQVNFLGFBQWNGLEdBQUc7SUFDeEIsT0FBTyxPQUFPQSxJQUFJSyxXQUFXLEtBQUssY0FBYyxPQUFPTCxJQUFJTSxLQUFLLEtBQUssY0FBY0wsU0FBU0QsSUFBSU0sS0FBSyxDQUFDLEdBQUc7QUFDM0ciLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/is-buffer/index.js\n");

/***/ })

};
;