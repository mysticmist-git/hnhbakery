"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/domelementtype";
exports.ids = ["vendor-chunks/domelementtype"];
exports.modules = {

/***/ "(rsc)/../node_modules/domelementtype/lib/esm/index.js":
/*!*******************************************************!*\
  !*** ../node_modules/domelementtype/lib/esm/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CDATA: () => (/* binding */ CDATA),\n/* harmony export */   Comment: () => (/* binding */ Comment),\n/* harmony export */   Directive: () => (/* binding */ Directive),\n/* harmony export */   Doctype: () => (/* binding */ Doctype),\n/* harmony export */   ElementType: () => (/* binding */ ElementType),\n/* harmony export */   Root: () => (/* binding */ Root),\n/* harmony export */   Script: () => (/* binding */ Script),\n/* harmony export */   Style: () => (/* binding */ Style),\n/* harmony export */   Tag: () => (/* binding */ Tag),\n/* harmony export */   Text: () => (/* binding */ Text),\n/* harmony export */   isTag: () => (/* binding */ isTag)\n/* harmony export */ });\n/** Types of elements found in htmlparser2's DOM */ var ElementType;\n(function(ElementType) {\n    /** Type for the root element of a document */ ElementType[\"Root\"] = \"root\";\n    /** Type for Text */ ElementType[\"Text\"] = \"text\";\n    /** Type for <? ... ?> */ ElementType[\"Directive\"] = \"directive\";\n    /** Type for <!-- ... --> */ ElementType[\"Comment\"] = \"comment\";\n    /** Type for <script> tags */ ElementType[\"Script\"] = \"script\";\n    /** Type for <style> tags */ ElementType[\"Style\"] = \"style\";\n    /** Type for Any tag */ ElementType[\"Tag\"] = \"tag\";\n    /** Type for <![CDATA[ ... ]]> */ ElementType[\"CDATA\"] = \"cdata\";\n    /** Type for <!doctype ...> */ ElementType[\"Doctype\"] = \"doctype\";\n})(ElementType || (ElementType = {}));\n/**\n * Tests whether an element is a tag or not.\n *\n * @param elem Element to test\n */ function isTag(elem) {\n    return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;\n}\n// Exports for backwards compatibility\n/** Type for the root element of a document */ const Root = ElementType.Root;\n/** Type for Text */ const Text = ElementType.Text;\n/** Type for <? ... ?> */ const Directive = ElementType.Directive;\n/** Type for <!-- ... --> */ const Comment = ElementType.Comment;\n/** Type for <script> tags */ const Script = ElementType.Script;\n/** Type for <style> tags */ const Style = ElementType.Style;\n/** Type for Any tag */ const Tag = ElementType.Tag;\n/** Type for <![CDATA[ ... ]]> */ const CDATA = ElementType.CDATA;\n/** Type for <!doctype ...> */ const Doctype = ElementType.Doctype;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL2RvbWVsZW1lbnR0eXBlL2xpYi9lc20vaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBaUQsR0FDMUMsSUFBSUEsWUFBWTtBQUN0QixVQUFVQSxXQUFXO0lBQ2xCLDRDQUE0QyxHQUM1Q0EsV0FBVyxDQUFDLE9BQU8sR0FBRztJQUN0QixrQkFBa0IsR0FDbEJBLFdBQVcsQ0FBQyxPQUFPLEdBQUc7SUFDdEIsdUJBQXVCLEdBQ3ZCQSxXQUFXLENBQUMsWUFBWSxHQUFHO0lBQzNCLDBCQUEwQixHQUMxQkEsV0FBVyxDQUFDLFVBQVUsR0FBRztJQUN6QiwyQkFBMkIsR0FDM0JBLFdBQVcsQ0FBQyxTQUFTLEdBQUc7SUFDeEIsMEJBQTBCLEdBQzFCQSxXQUFXLENBQUMsUUFBUSxHQUFHO0lBQ3ZCLHFCQUFxQixHQUNyQkEsV0FBVyxDQUFDLE1BQU0sR0FBRztJQUNyQiwrQkFBK0IsR0FDL0JBLFdBQVcsQ0FBQyxRQUFRLEdBQUc7SUFDdkIsNEJBQTRCLEdBQzVCQSxXQUFXLENBQUMsVUFBVSxHQUFHO0FBQzdCLEdBQUdBLGVBQWdCQSxDQUFBQSxjQUFjLENBQUM7QUFDbEM7Ozs7Q0FJQyxHQUNNLFNBQVNDLE1BQU1DLElBQUk7SUFDdEIsT0FBUUEsS0FBS0MsSUFBSSxLQUFLSCxZQUFZSSxHQUFHLElBQ2pDRixLQUFLQyxJQUFJLEtBQUtILFlBQVlLLE1BQU0sSUFDaENILEtBQUtDLElBQUksS0FBS0gsWUFBWU0sS0FBSztBQUN2QztBQUNBLHNDQUFzQztBQUN0Qyw0Q0FBNEMsR0FDckMsTUFBTUMsT0FBT1AsWUFBWU8sSUFBSSxDQUFDO0FBQ3JDLGtCQUFrQixHQUNYLE1BQU1DLE9BQU9SLFlBQVlRLElBQUksQ0FBQztBQUNyQyx1QkFBdUIsR0FDaEIsTUFBTUMsWUFBWVQsWUFBWVMsU0FBUyxDQUFDO0FBQy9DLDBCQUEwQixHQUNuQixNQUFNQyxVQUFVVixZQUFZVSxPQUFPLENBQUM7QUFDM0MsMkJBQTJCLEdBQ3BCLE1BQU1MLFNBQVNMLFlBQVlLLE1BQU0sQ0FBQztBQUN6QywwQkFBMEIsR0FDbkIsTUFBTUMsUUFBUU4sWUFBWU0sS0FBSyxDQUFDO0FBQ3ZDLHFCQUFxQixHQUNkLE1BQU1GLE1BQU1KLFlBQVlJLEdBQUcsQ0FBQztBQUNuQywrQkFBK0IsR0FDeEIsTUFBTU8sUUFBUVgsWUFBWVcsS0FBSyxDQUFDO0FBQ3ZDLDRCQUE0QixHQUNyQixNQUFNQyxVQUFVWixZQUFZWSxPQUFPLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1lbWFpbC1jbGllbnQvLi4vbm9kZV9tb2R1bGVzL2RvbWVsZW1lbnR0eXBlL2xpYi9lc20vaW5kZXguanM/MDljYyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVHlwZXMgb2YgZWxlbWVudHMgZm91bmQgaW4gaHRtbHBhcnNlcjIncyBET00gKi9cbmV4cG9ydCB2YXIgRWxlbWVudFR5cGU7XG4oZnVuY3Rpb24gKEVsZW1lbnRUeXBlKSB7XG4gICAgLyoqIFR5cGUgZm9yIHRoZSByb290IGVsZW1lbnQgb2YgYSBkb2N1bWVudCAqL1xuICAgIEVsZW1lbnRUeXBlW1wiUm9vdFwiXSA9IFwicm9vdFwiO1xuICAgIC8qKiBUeXBlIGZvciBUZXh0ICovXG4gICAgRWxlbWVudFR5cGVbXCJUZXh0XCJdID0gXCJ0ZXh0XCI7XG4gICAgLyoqIFR5cGUgZm9yIDw/IC4uLiA/PiAqL1xuICAgIEVsZW1lbnRUeXBlW1wiRGlyZWN0aXZlXCJdID0gXCJkaXJlY3RpdmVcIjtcbiAgICAvKiogVHlwZSBmb3IgPCEtLSAuLi4gLS0+ICovXG4gICAgRWxlbWVudFR5cGVbXCJDb21tZW50XCJdID0gXCJjb21tZW50XCI7XG4gICAgLyoqIFR5cGUgZm9yIDxzY3JpcHQ+IHRhZ3MgKi9cbiAgICBFbGVtZW50VHlwZVtcIlNjcmlwdFwiXSA9IFwic2NyaXB0XCI7XG4gICAgLyoqIFR5cGUgZm9yIDxzdHlsZT4gdGFncyAqL1xuICAgIEVsZW1lbnRUeXBlW1wiU3R5bGVcIl0gPSBcInN0eWxlXCI7XG4gICAgLyoqIFR5cGUgZm9yIEFueSB0YWcgKi9cbiAgICBFbGVtZW50VHlwZVtcIlRhZ1wiXSA9IFwidGFnXCI7XG4gICAgLyoqIFR5cGUgZm9yIDwhW0NEQVRBWyAuLi4gXV0+ICovXG4gICAgRWxlbWVudFR5cGVbXCJDREFUQVwiXSA9IFwiY2RhdGFcIjtcbiAgICAvKiogVHlwZSBmb3IgPCFkb2N0eXBlIC4uLj4gKi9cbiAgICBFbGVtZW50VHlwZVtcIkRvY3R5cGVcIl0gPSBcImRvY3R5cGVcIjtcbn0pKEVsZW1lbnRUeXBlIHx8IChFbGVtZW50VHlwZSA9IHt9KSk7XG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgYW4gZWxlbWVudCBpcyBhIHRhZyBvciBub3QuXG4gKlxuICogQHBhcmFtIGVsZW0gRWxlbWVudCB0byB0ZXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1RhZyhlbGVtKSB7XG4gICAgcmV0dXJuIChlbGVtLnR5cGUgPT09IEVsZW1lbnRUeXBlLlRhZyB8fFxuICAgICAgICBlbGVtLnR5cGUgPT09IEVsZW1lbnRUeXBlLlNjcmlwdCB8fFxuICAgICAgICBlbGVtLnR5cGUgPT09IEVsZW1lbnRUeXBlLlN0eWxlKTtcbn1cbi8vIEV4cG9ydHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4vKiogVHlwZSBmb3IgdGhlIHJvb3QgZWxlbWVudCBvZiBhIGRvY3VtZW50ICovXG5leHBvcnQgY29uc3QgUm9vdCA9IEVsZW1lbnRUeXBlLlJvb3Q7XG4vKiogVHlwZSBmb3IgVGV4dCAqL1xuZXhwb3J0IGNvbnN0IFRleHQgPSBFbGVtZW50VHlwZS5UZXh0O1xuLyoqIFR5cGUgZm9yIDw/IC4uLiA/PiAqL1xuZXhwb3J0IGNvbnN0IERpcmVjdGl2ZSA9IEVsZW1lbnRUeXBlLkRpcmVjdGl2ZTtcbi8qKiBUeXBlIGZvciA8IS0tIC4uLiAtLT4gKi9cbmV4cG9ydCBjb25zdCBDb21tZW50ID0gRWxlbWVudFR5cGUuQ29tbWVudDtcbi8qKiBUeXBlIGZvciA8c2NyaXB0PiB0YWdzICovXG5leHBvcnQgY29uc3QgU2NyaXB0ID0gRWxlbWVudFR5cGUuU2NyaXB0O1xuLyoqIFR5cGUgZm9yIDxzdHlsZT4gdGFncyAqL1xuZXhwb3J0IGNvbnN0IFN0eWxlID0gRWxlbWVudFR5cGUuU3R5bGU7XG4vKiogVHlwZSBmb3IgQW55IHRhZyAqL1xuZXhwb3J0IGNvbnN0IFRhZyA9IEVsZW1lbnRUeXBlLlRhZztcbi8qKiBUeXBlIGZvciA8IVtDREFUQVsgLi4uIF1dPiAqL1xuZXhwb3J0IGNvbnN0IENEQVRBID0gRWxlbWVudFR5cGUuQ0RBVEE7XG4vKiogVHlwZSBmb3IgPCFkb2N0eXBlIC4uLj4gKi9cbmV4cG9ydCBjb25zdCBEb2N0eXBlID0gRWxlbWVudFR5cGUuRG9jdHlwZTtcbiJdLCJuYW1lcyI6WyJFbGVtZW50VHlwZSIsImlzVGFnIiwiZWxlbSIsInR5cGUiLCJUYWciLCJTY3JpcHQiLCJTdHlsZSIsIlJvb3QiLCJUZXh0IiwiRGlyZWN0aXZlIiwiQ29tbWVudCIsIkNEQVRBIiwiRG9jdHlwZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/domelementtype/lib/esm/index.js\n");

/***/ })

};
;