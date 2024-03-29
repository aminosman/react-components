"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = (0, tslib_1.__importStar)(require("react"));
var react_1 = require("react");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var path_value_1 = require("path-value");
var react_use_1 = require("react-use");
var Button_1 = (0, tslib_1.__importDefault)(require("react-bootstrap/Button"));
var Modal_1 = (0, tslib_1.__importDefault)(require("react-bootstrap/Modal"));
var Col_1 = (0, tslib_1.__importDefault)(require("react-bootstrap/Col"));
var Form_1 = (0, tslib_1.__importDefault)(require("react-bootstrap/Form"));
var react_bootstrap_1 = require("react-bootstrap");
var react_content_loader_1 = (0, tslib_1.__importDefault)(require("react-content-loader"));
var react_router_dom_1 = require("react-router-dom");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var TableCell = function (_a) {
    var snapshot = _a.snapshot, children = _a.children, Wrapper = _a.Wrapper, row = _a.row, id = _a.id, cellClassName = _a.cellClassName, props = (0, tslib_1.__rest)(_a, ["snapshot", "children", "Wrapper", "row", "id", "cellClassName"]);
    var _b = (0, react_use_1.useMeasure)(), ref = _b[0], _c = _b[1], width = _c.width, height = _c.height;
    var _d = (0, react_1.useState)(null), dimensionSnapshot = _d[0], setDimensionSnapshot = _d[1];
    (0, react_1.useEffect)(function () {
        if (!snapshot.isDragging) {
            setDimensionSnapshot({ width: width + 24, height: height + 24 });
        }
    }, [width]);
    return (React.createElement("td", { ref: ref, className: "" + (cellClassName || ''), style: (snapshot === null || snapshot === void 0 ? void 0 : snapshot.isDragging) ? dimensionSnapshot || {} : {} }, children));
};
var TableLoader = function (props) {
    var propKey = props.rootKey || '';
    var _a = (0, react_1.useState)(false), showModal = _a[0], setShowModal = _a[1];
    var _b = (0, react_1.useState)(null), editing = _b[0], setEditing = _b[1];
    var _c = (0, react_1.useState)(null), editingId = _c[0], setEditingId = _c[1];
    var _d = (0, react_1.useState)(null), saveError = _d[0], setSaveError = _d[1];
    var _e = (0, react_1.useState)(null), optionsMap = _e[0], setOptionsMap = _e[1];
    var _f = (0, react_1.useState)(false), validated = _f[0], setValidated = _f[1];
    var _g = (0, react_1.useState)(false), saving = _g[0], setSaving = _g[1];
    var _h = (0, react_1.useState)(false), loadingOptions = _h[0], setLoadingOptions = _h[1];
    var items = typeof props.items === 'function' ? props.items(editing) : props.items || [];
    (0, react_1.useEffect)(function () {
        var item = items.find(function (i) { return i['id'] === editingId; });
        if (item)
            setEditing(props.schema.map(function (itemSchema) {
                var _a;
                var value = ((_a = editing === null || editing === void 0 ? void 0 : editing.find(function (e) { return e.property === (itemSchema === null || itemSchema === void 0 ? void 0 : itemSchema.property); })) === null || _a === void 0 ? void 0 : _a.value) ||
                    getOriginalValue(item, itemSchema);
                if (itemSchema.type === 'table') {
                    value = getOriginalValue(item, itemSchema);
                }
                return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, itemSchema), { value: value, item: item });
            }));
    }, [items]);
    var handleCloseModal = function () {
        setSaveError(null);
        setSaving(false);
        setShowModal(false);
    };
    var handleSave = function (event) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var form, result, _a, _b, _c, ex_1;
        return (0, tslib_1.__generator)(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!editing)
                        return [2 /*return*/];
                    form = event.currentTarget;
                    setSaveError(null);
                    event.preventDefault();
                    event.stopPropagation();
                    setValidated(true);
                    if (!form.checkValidity()) return [3 /*break*/, 9];
                    setSaving(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, , 9]);
                    if (!editingId) return [3 /*break*/, 4];
                    _b = props.onUpdate;
                    if (!_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, props.onUpdate(editingId, editing)];
                case 2:
                    _b = (_d.sent());
                    _d.label = 3;
                case 3:
                    _a = _b;
                    return [3 /*break*/, 7];
                case 4:
                    _c = props.onCreate;
                    if (!_c) return [3 /*break*/, 6];
                    return [4 /*yield*/, props.onCreate(props.parentId, editing)];
                case 5:
                    _c = (_d.sent());
                    _d.label = 6;
                case 6:
                    _a = _c;
                    _d.label = 7;
                case 7:
                    result = _a;
                    if (result) {
                        clearEditFields();
                        handleCloseModal();
                    }
                    return [3 /*break*/, 9];
                case 8:
                    ex_1 = _d.sent();
                    setSaveError(ex_1.message || 'There was an error saving your changes. Please reload and try again.');
                    return [3 /*break*/, 9];
                case 9:
                    setSaving(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleShowModal = function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            handleEdit(null);
            return [2 /*return*/];
        });
    }); };
    var getOriginalValue = function (parentItem, itemSchema) {
        var value = '';
        if (parentItem && itemSchema.type === 'text' && itemSchema.extractor)
            value = itemSchema.extractor((0, path_value_1.resolveValue)(parentItem, "" + itemSchema.property)).value;
        else if (parentItem && itemSchema.type === 'number')
            value = (0, path_value_1.resolveValue)(parentItem, "" + itemSchema.property) || 0;
        else if (parentItem)
            value = (0, path_value_1.resolveValue)(parentItem, "" + itemSchema.property);
        return value;
    };
    var handleEdit = function (item) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadOptions()];
                case 1:
                    _a.sent();
                    clearEditFields();
                    setEditingId(item ? item['id'] : null);
                    setEditing(props.schema.map(function (itemSchema) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, itemSchema), { value: getOriginalValue(item, itemSchema), item: item })); }));
                    setShowModal(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleRemove = function (item) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var _a, _b;
        return (0, tslib_1.__generator)(this, function (_c) {
            if (!props.onRemove)
                return [2 /*return*/];
            if (window.confirm("Are you sure you want to remove " + (item.name || ((_b = (_a = props.schema[0]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.call(_a, item)) || item[props.schema[0].property] || '') + "?")) {
                props.onRemove(item);
            }
            return [2 /*return*/];
        });
    }); };
    var loadOption = function (x) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var o;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof x.options === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, x.options()];
                case 1:
                    o = _a.sent();
                    return [2 /*return*/, [x.property, o]];
                case 2: return [2 /*return*/, [x.property, x.options]];
            }
        });
    }); };
    var loadOptions = function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var x, _a;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoadingOptions(true);
                    if (!!optionsMap) return [3 /*break*/, 2];
                    _a = Map.bind;
                    return [4 /*yield*/, Promise.all(props.schema.map(loadOption))];
                case 1:
                    x = new (_a.apply(Map, [void 0, _b.sent()]))();
                    setOptionsMap(x);
                    _b.label = 2;
                case 2:
                    setLoadingOptions(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var clearEditFields = function () {
        setValidated(false);
        setSaving(false);
        setEditing(null);
    };
    var renderOptions = function (property, options) {
        if (loadingOptions)
            return React.createElement("option", null, "Loading...");
        if (!optionsMap)
            return React.createElement("option", null, "No Options Found");
        var _options = Array.isArray(options) ? options : optionsMap.get(property);
        var currentItem = (editing || []).find(function (y) { return y.property === property; });
        if (!currentItem)
            return React.createElement("option", null, "Failed to load value");
        if (!Array.isArray(_options))
            return React.createElement("option", null, "No Options Found");
        return _options.map(function (option) {
            var _a, _b;
            var kvPair = (_b = (_a = props.schema.find(function (s) { return s.property === property; })) === null || _a === void 0 ? void 0 : _a.extractor) === null || _b === void 0 ? void 0 : _b.call(_a, option);
            return (React.createElement("option", { key: property + "-" + (kvPair === null || kvPair === void 0 ? void 0 : kvPair.key) + "-" + (kvPair === null || kvPair === void 0 ? void 0 : kvPair.value), value: "" + (kvPair === null || kvPair === void 0 ? void 0 : kvPair.key) }, kvPair === null || kvPair === void 0 ? void 0 : kvPair.value));
        });
    };
    var getEditingPropertyIndex = function (property) {
        return (editing || []).findIndex(function (x) { return (x.key ? x.key === property : x.property === property); });
    };
    var onEditValueChange = function (property, value) {
        var copy = (0, tslib_1.__spreadArray)([], (editing || []), true);
        var editingIndex = getEditingPropertyIndex(property);
        if (editingIndex === -1)
            return;
        copy[editingIndex].value = value;
        props.schema.map(function (depSchemaItem) {
            var parts = ("" + depSchemaItem.property).split('.');
            if ((parts === null || parts === void 0 ? void 0 : parts.length) > 1 && parts[0] === property) {
                var index = getEditingPropertyIndex(depSchemaItem.property);
                copy[index].value = (0, path_value_1.resolveValue)(value, parts.slice(1).join('.'));
            }
        });
        setEditing(copy);
    };
    var handleView = function (item) {
        if (props === null || props === void 0 ? void 0 : props.onClick)
            props === null || props === void 0 ? void 0 : props.onClick(item);
        return false;
    };
    var handleDragEnd = function (event) {
        if (props.onDragEnd)
            props.onDragEnd(props.parentId, parseInt(event.draggableId), event.destination.index);
    };
    var chunkArray = function (myArray, chunk_size) {
        var arrayCopy = (0, tslib_1.__spreadArray)([], myArray, true);
        var results = [];
        while (arrayCopy.length) {
            results.push(arrayCopy.splice(0, chunk_size));
        }
        return results;
    };
    var renderLoader = function (value, width, height) {
        if (width === void 0) { width = 275; }
        if (height === void 0) { height = 15; }
        return (React.createElement(react_content_loader_1.default, { viewBox: "0 0 " + width + " " + height, foregroundColor: '#333', backgroundColor: '#999' },
            React.createElement("rect", { x: "0", y: "0", rx: "5", ry: "5", width: width, height: height })));
    };
    var renderLoadingTable = function () { return (React.createElement(React.Fragment, null, (0, tslib_1.__spreadArray)([], new Array(10), true).map(function (x) { return Math.max(Math.floor(Math.random() * 250), 125); })
        .map(function (x, i) { return (React.createElement("tr", { className: "bg-gradient-dark text-white", key: "row-data-loading-" + JSON.stringify(i) + "-" + propKey }, props.schema.map(function (i) { return (React.createElement("td", { key: "row-data-td-loading-" + i.label + "-" + i.property + "-" + i.key },
        React.createElement("div", { style: { width: 75, height: 10 }, className: "mb-2" }, renderLoader('', 50, 5)))); }))); }))); };
    var renderUnits = function (units) {
        if (!units)
            return null;
        return (React.createElement(react_bootstrap_1.InputGroup.Append, null,
            React.createElement(react_bootstrap_1.InputGroup.Text, null, units)));
    };
    var renderField = function (item) {
        var _a, _b, _c, _d, _e, _f;
        var editingField = editing === null || editing === void 0 ? void 0 : editing.find(function (x) { return (x.key ? x.key === item.key : x.property === item.property); });
        var currentField = editing === null || editing === void 0 ? void 0 : editing.reduce(function (p, c) {
            var _a;
            return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, p), (_a = {}, _a[c.key || c.property] = c.value, _a)));
        }, {});
        if (!editingField)
            return null;
        if (item.renderComponent && typeof item.renderComponent === 'function')
            return (React.createElement(Form_1.default.Group, { as: Col_1.default, controlId: "editLabel", key: item.label + "-label" },
                React.createElement(Form_1.default.Label, { className: "text-white" }, item.label),
                item.renderComponent(function (e) { return onEditValueChange(item.key || item.property, e); }, editingField.value)));
        if (item.CustomComponent && typeof item.CustomComponent === 'function')
            return (React.createElement(Form_1.default.Group, { as: Col_1.default, controlId: "editLabel", key: item.label + "-label" },
                React.createElement(Form_1.default.Label, { className: "text-white" }, item.label),
                React.createElement(item.CustomComponent, { onChange: function (e) { return onEditValueChange(item.key || item.property, e); }, onEditValueChange: onEditValueChange, item: editingField.item })));
        var type = typeof item.type === 'function' ? (_a = item.type) === null || _a === void 0 ? void 0 : _a.call(item, currentField) : item.type || 'text';
        switch (type) {
            case 'select':
                return (React.createElement(Form_1.default.Group, { as: Col_1.default, controlId: "" + item.property, key: "form-info-" + String(item.key || item.property) + "-" + type },
                    React.createElement(Form_1.default.Label, { className: "text-white" }, item.label),
                    React.createElement(react_bootstrap_1.InputGroup, null,
                        React.createElement(Form_1.default.Control, { disabled: item.editable === false, as: "select", required: item.required, value: "" + ((_c = (_b = item === null || item === void 0 ? void 0 : item.extractor) === null || _b === void 0 ? void 0 : _b.call(item, editingField.value)) === null || _c === void 0 ? void 0 : _c.key), onChange: function (e) {
                                var _a;
                                var _options = (item.itemBasedOptions && ((_a = item.itemBasedOptions) === null || _a === void 0 ? void 0 : _a.call(item, currentField))) ||
                                    (optionsMap === null || optionsMap === void 0 ? void 0 : optionsMap.get(item.property));
                                var option = _options === null || _options === void 0 ? void 0 : _options.find(function (o) { var _a, _b; return "" + ((_b = (_a = item === null || item === void 0 ? void 0 : item.extractor) === null || _a === void 0 ? void 0 : _a.call(item, o)) === null || _b === void 0 ? void 0 : _b.key) === e.target.value; });
                                onEditValueChange(item.key || item.property, option);
                            } },
                            React.createElement("option", null),
                            renderOptions(item.property, item.itemBasedOptions ? (_d = item.itemBasedOptions) === null || _d === void 0 ? void 0 : _d.call(item, currentField) : undefined)),
                        renderUnits(((_e = item === null || item === void 0 ? void 0 : item.units) === null || _e === void 0 ? void 0 : _e.call(item, editingField.item)) || '')),
                    React.createElement(Form_1.default.Control.Feedback, { type: "invalid" }, "This field is required.")));
            case 'text':
            case 'number':
            case 'textarea':
                return (React.createElement(Form_1.default.Group, { as: Col_1.default, controlId: "" + item.property, key: "form-info-" + String(item.key || item.property) + "-" + type },
                    React.createElement(Form_1.default.Label, { className: "text-white" }, item.label),
                    React.createElement(react_bootstrap_1.InputGroup, null,
                        React.createElement(Form_1.default.Control, { required: item.required, as: type === 'textarea' ? 'textarea' : undefined, type: type === 'textarea' ? 'text' : type, rows: type === 'textarea' ? 3 : undefined, value: editingField.value !== null
                                ? item.type === 'number'
                                    ? editingField.value
                                    : "" + editingField.value
                                : '', onChange: function (e) { return onEditValueChange(item.key || item.property, e.target.value); }, disabled: item.editable === false }),
                        renderUnits(((_f = item === null || item === void 0 ? void 0 : item.units) === null || _f === void 0 ? void 0 : _f.call(item, editingField.item)) || '')),
                    React.createElement(Form_1.default.Control.Feedback, { type: "invalid" }, "This field is required.")));
            case 'switch':
            case 'checkbox':
                return (React.createElement(Form_1.default.Group, { as: Col_1.default, controlId: "" + item.property, key: "form-info-" + String(item.key || item.property) + "-" + type },
                    React.createElement(Form_1.default.Label, null),
                    React.createElement(Form_1.default.Check, { className: "form-control-lg text-white", required: item.required, type: type, label: item.label, checked: editingField.value, onChange: function (e) { return onEditValueChange(item.key || item.property, e.target.checked); }, disabled: item.editable === false }),
                    React.createElement(Form_1.default.Control.Feedback, { type: "invalid" }, "This field is required.")));
            case 'table':
                return (React.createElement(Form_1.default.Group, { as: Col_1.default, controlId: "" + item.property, key: "form-info-" + String(item.key || item.property) + "-" + type },
                    React.createElement(Form_1.default.Label, { className: "text-white" }, item.label),
                    item.props && (React.createElement(TableLoader, (0, tslib_1.__assign)({}, item.props, { title: typeof item.props.title === 'function'
                            ? items.find(function (i) { return i.id === editingId; }) &&
                                item.props.title(items.find(function (i) { return i.id === editingId; }))
                            : item.props.title, items: editingField === null || editingField === void 0 ? void 0 : editingField.value, onCreate: props.onCreate
                            ? function (id, object) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
                                var currentValue, addedValue_1;
                                return (0, tslib_1.__generator)(this, function (_a) {
                                    if (editing) {
                                        currentValue = editingField === null || editingField === void 0 ? void 0 : editingField.value;
                                        addedValue_1 = { id: Math.random() };
                                        object.forEach(function (o) {
                                            addedValue_1[o.property] = o.value;
                                        });
                                        onEditValueChange(item.key || item.property, (currentValue === null || currentValue === void 0 ? void 0 : currentValue.length)
                                            ? (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], currentValue, true), [addedValue_1], false) : [addedValue_1]);
                                    }
                                    return [2 /*return*/, true];
                                });
                            }); }
                            : undefined, onUpdate: props.onCreate
                            ? function (id, object) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
                                var subItemList, updatedValue_1;
                                var _a, _b;
                                return (0, tslib_1.__generator)(this, function (_c) {
                                    if (editing) {
                                        subItemList = editingField === null || editingField === void 0 ? void 0 : editingField.value;
                                        updatedValue_1 = (0, tslib_1.__assign)({}, (_a = subItemList === null || subItemList === void 0 ? void 0 : subItemList.find) === null || _a === void 0 ? void 0 : _a.call(subItemList, function (x) { return x.id === id; }));
                                        object.forEach(function (o) {
                                            updatedValue_1[o.property] = o.value;
                                        });
                                        onEditValueChange(item.key || item.property, (subItemList === null || subItemList === void 0 ? void 0 : subItemList.length)
                                            ? (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (_b = subItemList === null || subItemList === void 0 ? void 0 : subItemList.filter) === null || _b === void 0 ? void 0 : _b.call(subItemList, function (x) { return x.id !== id; }), true), [
                                                updatedValue_1,
                                            ], false) : [updatedValue_1]);
                                    }
                                    return [2 /*return*/, true];
                                });
                            }); }
                            : undefined })))));
        }
        return null;
    };
    var renderCreateModal = function () {
        return (React.createElement(Modal_1.default, { size: "lg", show: showModal, onHide: handleCloseModal, "aria-labelledby": "contained-modal-title-vcenter", centered: true },
            React.createElement(Form_1.default, { noValidate: true, validated: validated, onSubmit: handleSave },
                React.createElement(Modal_1.default.Header, { closeButton: true, className: 'bg-dark text-white' },
                    React.createElement(Modal_1.default.Title, null,
                        editingId ? 'Edit' : 'Add',
                        ' ',
                        typeof props.title === 'function'
                            ? items.find(function (i) { return i.id === editingId; }) &&
                                props.title(items.find(function (i) { return i.id === editingId; }))
                            : props.title)),
                React.createElement(Modal_1.default.Body, { className: 'bg-dark' },
                    saveError && React.createElement(react_bootstrap_1.Alert, { variant: "danger" }, saveError),
                    chunkArray(props.schema.filter(function (s) { return s.type !== 'table'; }), 2).map(function (x, i) {
                        return React.createElement(Form_1.default.Row, { key: "formRow-" + i }, x.map(renderField));
                    }),
                    props.schema
                        .filter(function (s) { return s.type === 'table'; })
                        .map(function (t, i) { return (React.createElement(Form_1.default.Row, { key: "formRow-table-" + i }, renderField(t))); })),
                React.createElement(Modal_1.default.Footer, { className: 'bg-dark' },
                    React.createElement(Button_1.default, { variant: "secondary", onClick: handleCloseModal }, "Close"),
                    React.createElement(Button_1.default, { variant: "primary", type: "submit", disabled: saving }, "Save")))));
    };
    var booleanParser = function (value) {
        if (value === true)
            return 'Yes';
        if (value === false)
            return 'No';
        return value;
    };
    var renderItemPropContents = function (i, item) {
        var _a, _b;
        return (React.createElement(React.Fragment, null,
            typeof i.value === 'function'
                ? i.value(item)
                : (i === null || i === void 0 ? void 0 : i.extractor)
                    ? (_b = (_a = i.extractor) === null || _a === void 0 ? void 0 : _a.call(i, (0, path_value_1.resolveValue)(item, "" + i.property), item)) === null || _b === void 0 ? void 0 : _b.value
                    : booleanParser((0, path_value_1.resolveValue)(item, "" + i.property)),
            ' ',
            i.units ? ' ' + i.units(item) : ''));
    };
    var renderItemProp = function (i, item) {
        if (i.onClick) {
            return (React.createElement(Button_1.default, { variant: "link", className: "text-link", onClick: function () { var _a; return (_a = i === null || i === void 0 ? void 0 : i.onClick) === null || _a === void 0 ? void 0 : _a.call(i, item, i.property); } }, renderItemPropContents(i, item)));
        }
        return renderItemPropContents(i, item);
    };
    var renderRowContents = function (item, snapshot, schema, cellClassName) {
        var rows = [];
        if ((props === null || props === void 0 ? void 0 : props.onClick) && props.clickType === 'link') {
            rows.push(schema.map(function (i) { return (React.createElement("td", { key: "row-prop-data-" + propKey + "-" + String(i.key || i.property) + "-link" },
                React.createElement(react_router_dom_1.Link, { className: "text-white", target: "_blank", to: (props === null || props === void 0 ? void 0 : props.onClick) && (props === null || props === void 0 ? void 0 : props.onClick(item)) }, renderItemProp(i, item)))); }));
        }
        else if (props === null || props === void 0 ? void 0 : props.onClick) {
            rows.push(schema.map(function (i) { return (React.createElement("td", { key: "row-prop-data-" + propKey + "-" + String(i.key || i.property) + "-click" },
                React.createElement(Button_1.default, { variant: "link", className: "text-link", onClick: function () { return handleView(item); } }, renderItemProp(i, item)))); }));
        }
        else
            rows.push(schema.map(function (i) { return (React.createElement(TableCell, { cellClassName: cellClassName, snapshot: snapshot, id: String(i.key || i.property), key: "row-prop-data-" + propKey + "-" + String(i.key || i.property) }, renderItemProp(i, item))); }));
        if (Array.isArray(props.customActions))
            rows.push.apply(rows, props.customActions.map(function (cA) { return (React.createElement(TableCell, { snapshot: snapshot, key: "row-custom-actions-" + propKey + "-update-" + JSON.stringify(item) }, cA(item))); }));
        if (props.onUpdate) {
            rows.push(React.createElement(TableCell, { snapshot: snapshot, key: "row-prop-data-" + propKey + "-update-" + JSON.stringify(item) },
                React.createElement(Button_1.default, { variant: "light", className: "float-right", onClick: function () { return handleEdit(item); } },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "edit" }))));
        }
        return (React.createElement(React.Fragment, null,
            rows,
            props.onRemove && (React.createElement(TableCell, { snapshot: snapshot },
                React.createElement(Button_1.default, { variant: "light", className: "float-right", onClick: function () { return handleRemove(item); } },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "trash" }))))));
    };
    var renderRow = function (item, index, schema, cellClassName) { return (React.createElement(react_beautiful_dnd_1.Draggable, { key: "draggable-row-" + (item.id || item.title || item.dateCreated || JSON.stringify(item)) + "-" + propKey, draggableId: "" + item.id, index: index, isDragDisabled: !props.onDragEnd }, function (provided, snapshot) {
        var _a, _b;
        return (React.createElement(React.Fragment, { key: "row-data-" + index + "-" + item.id + "-" + propKey },
            React.createElement("tr", (0, tslib_1.__assign)({ className: "bg-gradient-dark text-white " + (props.rowClassName || ''), ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { style: provided.draggableProps.style }), renderRowContents(item, snapshot, schema, cellClassName)),
            Array.isArray(item.children) &&
                !!((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) &&
                Array.isArray(props.nestedSchema) && (React.createElement("tr", { className: "bg-mars-dark" },
                React.createElement("td", { className: "p-0", colSpan: (_b = props.schema) === null || _b === void 0 ? void 0 : _b.length }, renderTable(item.children, props.nestedSchema, props.nestedTableClassName, props.nestedCellClassName)))),
            provided.placeholder));
    })); };
    var renderHeader = function (schema) {
        var _a;
        return (React.createElement("tr", { className: "bg-dark text-white" },
            schema.map(function (i) { return (React.createElement("th", { style: i.labelStyle || {}, className: "" + (i.labelClassName || ''), key: "row-header-" + (i.property || i.label) + "-" + propKey }, i.label)); }), (_a = props.customActions) === null || _a === void 0 ? void 0 :
            _a.map(function (_, i) { return (React.createElement("th", { key: "action-header-" + i })); }),
            props.onRemove && (!props.onCreate || !!props.onUpdate) && React.createElement("th", null),
            props.onCreate && (React.createElement("th", { scope: "col" },
                React.createElement(Button_1.default, { variant: "light", className: "float-right", onClick: handleShowModal },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "plus", className: "small" }))))));
    };
    var renderTable = function (itemsToRender, schema, tableClassName, cellClassName) { return (React.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleDragEnd },
        React.createElement(react_beautiful_dnd_1.Droppable, { droppableId: "droppable", isDropDisabled: !props.onDragEnd }, function (provided, snapshot) {
            var _a;
            return (React.createElement("table", { ref: provided.innerRef, className: "table table-hover table-dark " + tableClassName, key: ((_a = schema === null || schema === void 0 ? void 0 : schema[0]) === null || _a === void 0 ? void 0 : _a.label) + "-table" },
                React.createElement("thead", null, renderHeader(schema)),
                React.createElement("tbody", null,
                    props.loading
                        ? renderLoadingTable()
                        : itemsToRender.map(function (item, index) { return renderRow(item, index, schema, cellClassName); }),
                    provided.placeholder)));
        }))); };
    return (React.createElement(React.Fragment, null,
        renderTable(items, props.schema, props.tableClassName, props.cellClassName),
        props.loading || (items === null || items === void 0 ? void 0 : items.length) ? null : props.ListEmptyComponent,
        renderCreateModal()));
};
exports.default = TableLoader;
