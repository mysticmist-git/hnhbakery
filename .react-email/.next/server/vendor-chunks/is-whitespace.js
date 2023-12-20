"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-whitespace";
exports.ids = ["vendor-chunks/is-whitespace"];
exports.modules = {

/***/ "(rsc)/../node_modules/is-whitespace/index.js":
/*!**********************************************!*\
  !*** ../node_modules/is-whitespace/index.js ***!
  \**********************************************/
/***/ ((module) => {

eval("/*!\n * is-whitespace <https://github.com/jonschlinkert/is-whitespace>\n *\n * Copyright (c) 2014-2015, Jon Schlinkert.\n * Licensed under the MIT License.\n */ \nvar cache;\nmodule.exports = function isWhitespace(str) {\n    return typeof str === \"string\" && regex().test(str);\n};\nfunction regex() {\n    // ensure that runtime compilation only happens once\n    return cache || (cache = new RegExp('^[\\\\s\t\\n\\v\\f\\r \\xa0 ᠎             　\\u2028\\u2029\\uFEFF\"]+$'));\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL2lzLXdoaXRlc3BhY2UvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0NBS0MsR0FFRDtBQUVBLElBQUlBO0FBRUpDLE9BQU9DLE9BQU8sR0FBRyxTQUFTQyxhQUFhQyxHQUFHO0lBQ3hDLE9BQU8sT0FBUUEsUUFBUSxZQUFhQyxRQUFRQyxJQUFJLENBQUNGO0FBQ25EO0FBRUEsU0FBU0M7SUFDUCxvREFBb0Q7SUFDcEQsT0FBT0wsU0FBVUEsQ0FBQUEsUUFBUSxJQUFJTyxPQUFPLDREQUF5SjtBQUMvTCIsInNvdXJjZXMiOlsid2VicGFjazovL3JlYWN0LWVtYWlsLWNsaWVudC8uLi9ub2RlX21vZHVsZXMvaXMtd2hpdGVzcGFjZS9pbmRleC5qcz83MjdmIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogaXMtd2hpdGVzcGFjZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtd2hpdGVzcGFjZT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNXaGl0ZXNwYWNlKHN0cikge1xuICByZXR1cm4gKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSAmJiByZWdleCgpLnRlc3Qoc3RyKTtcbn07XG5cbmZ1bmN0aW9uIHJlZ2V4KCkge1xuICAvLyBlbnN1cmUgdGhhdCBydW50aW1lIGNvbXBpbGF0aW9uIG9ubHkgaGFwcGVucyBvbmNlXG4gIHJldHVybiBjYWNoZSB8fCAoY2FjaGUgPSBuZXcgUmVnRXhwKCdeW1xcXFxzXFx4MDlcXHgwQVxceDBCXFx4MENcXHgwRFxceDIwXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOFxcdTIwMjlcXHVGRUZGXCJdKyQnKSk7XG59XG4iXSwibmFtZXMiOlsiY2FjaGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiaXNXaGl0ZXNwYWNlIiwic3RyIiwicmVnZXgiLCJ0ZXN0IiwiUmVnRXhwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/is-whitespace/index.js\n");

/***/ })

};
;