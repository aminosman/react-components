"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var react_1 = (0, tslib_1.__importStar)(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
var react_content_loader_1 = (0, tslib_1.__importDefault)(require("react-content-loader"));
function TabLayout(_a) {
    var _this = this;
    var defaultActiveKey = _a.defaultActiveKey, nav = _a.nav, defaultPinnedTabs = _a.defaultPinnedTabs, title = _a.title, loading = _a.loading, navLinkContainerProps = _a.navLinkContainerProps, navContentContainerProps = _a.navContentContainerProps, onTitleEdit = _a.onTitleEdit, persistPinnedTabs = _a.persistPinnedTabs;
    // Helper function to compute storage key consistently
    var computeStorageKey = function (navItems) {
        var navIds = navItems
            .map(function (x) { return x.id; })
            .sort()
            .join('-');
        return "tabLayout-pinnedTabs-" + navIds;
    };
    // Generate a stable localStorage key based on nav item IDs
    var storageKey = (0, react_1.useMemo)(function () { return computeStorageKey(nav); }, [JSON.stringify(nav.map(function (x) { return x.id; }).sort())]);
    // Initialize pinnedTabs state - load from localStorage if persistence is enabled
    var getInitialPinnedTabs = function () {
        if (!persistPinnedTabs || typeof window === 'undefined') {
            return defaultPinnedTabs
                ? nav.map(function (x) { return defaultPinnedTabs === null || defaultPinnedTabs === void 0 ? void 0 : defaultPinnedTabs.includes(x.id); })
                : new Array(nav.length).fill(false);
        }
        // Compute storage key directly to ensure consistency
        var initialStorageKey = computeStorageKey(nav);
        try {
            var stored = localStorage.getItem(initialStorageKey);
            if (stored) {
                var storedPinnedIds_1 = JSON.parse(stored);
                if (Array.isArray(storedPinnedIds_1)) {
                    var loadedPinnedTabs = nav.map(function (x) { return storedPinnedIds_1.includes(x.id); });
                    // Ensure array length matches
                    while (loadedPinnedTabs.length < nav.length) {
                        loadedPinnedTabs.push(false);
                    }
                    return loadedPinnedTabs.slice(0, nav.length);
                }
            }
        }
        catch (e) {
            console.warn('Failed to load pinned tabs from localStorage', e);
        }
        return defaultPinnedTabs ? nav.map(function (x) { return defaultPinnedTabs === null || defaultPinnedTabs === void 0 ? void 0 : defaultPinnedTabs.includes(x.id); }) : new Array(nav.length).fill(false);
    };
    var _b = (0, react_1.useState)(getInitialPinnedTabs), pinnedTabs = _b[0], setPinnedTabs = _b[1];
    var _c = (0, react_1.useState)(), showAll = _c[0], setShowAll = _c[1];
    var _d = (0, react_1.useState)(defaultActiveKey), currentTab = _d[0], setCurrentTab = _d[1];
    var isInitialMount = (0, react_1.useRef)(true);
    var lastStorageKey = (0, react_1.useRef)(storageKey);
    // Reload pinned tabs from localStorage when nav structure changes (if persistence is enabled)
    (0, react_1.useEffect)(function () {
        // Always compute the current storage key to ensure we use the right one
        var currentStorageKey = computeStorageKey(nav);
        // Skip on initial mount since we already loaded in useState
        if (isInitialMount.current) {
            isInitialMount.current = false;
            lastStorageKey.current = currentStorageKey;
            return;
        }
        // Only reload if storage key actually changed (nav structure changed)
        if (lastStorageKey.current === currentStorageKey) {
            return;
        }
        lastStorageKey.current = currentStorageKey;
        if (!persistPinnedTabs || typeof window === 'undefined') {
            // If persistence disabled, reset to defaults when nav changes
            if (pinnedTabs.length !== nav.length) {
                var initialPinnedTabs_1 = defaultPinnedTabs
                    ? nav.map(function (x) { return defaultPinnedTabs === null || defaultPinnedTabs === void 0 ? void 0 : defaultPinnedTabs.includes(x.id); })
                    : new Array(nav.length).fill(false);
                setPinnedTabs(initialPinnedTabs_1);
            }
            return;
        }
        try {
            var stored = localStorage.getItem(currentStorageKey);
            if (stored) {
                var storedPinnedIds_2 = JSON.parse(stored);
                if (Array.isArray(storedPinnedIds_2)) {
                    var loadedPinnedTabs = nav.map(function (x) { return storedPinnedIds_2.includes(x.id); });
                    // Ensure array length matches
                    while (loadedPinnedTabs.length < nav.length) {
                        loadedPinnedTabs.push(false);
                    }
                    var finalPinnedTabs = loadedPinnedTabs.slice(0, nav.length);
                    setPinnedTabs(finalPinnedTabs);
                    return;
                }
            }
        }
        catch (e) {
            console.warn('Failed to load pinned tabs from localStorage', e);
        }
        // Fallback to defaults if nothing in storage
        var initialPinnedTabs = defaultPinnedTabs
            ? nav.map(function (x) { return defaultPinnedTabs === null || defaultPinnedTabs === void 0 ? void 0 : defaultPinnedTabs.includes(x.id); })
            : new Array(nav.length).fill(false);
        setPinnedTabs(initialPinnedTabs);
    }, [storageKey, persistPinnedTabs, defaultPinnedTabs, nav, pinnedTabs.length]); // Reload when nav structure changes
    // Ensure pinnedTabs array length always matches nav length (safety check)
    (0, react_1.useEffect)(function () {
        if (pinnedTabs.length !== nav.length) {
            var newPinnedTabs = (0, tslib_1.__spreadArray)([], pinnedTabs, true);
            // If array is shorter, pad with false
            while (newPinnedTabs.length < nav.length) {
                newPinnedTabs.push(false);
            }
            // If array is longer, trim it
            if (newPinnedTabs.length > nav.length) {
                newPinnedTabs.splice(nav.length);
            }
            setPinnedTabs(newPinnedTabs);
        }
    }, [nav.length, pinnedTabs.length]);
    // Save pinned tabs to localStorage whenever they change
    (0, react_1.useEffect)(function () {
        if (!persistPinnedTabs || typeof window === 'undefined')
            return;
        // Skip save on initial mount since we just loaded from storage
        if (isInitialMount.current)
            return;
        try {
            // Always compute the storage key from current nav to ensure consistency
            var currentStorageKey = computeStorageKey(nav);
            var pinnedIds = nav.map(function (x, i) { return (pinnedTabs[i] ? x.id : null); }).filter(function (id) { return id !== null; });
            localStorage.setItem(currentStorageKey, JSON.stringify(pinnedIds));
        }
        catch (e) {
            console.warn('Failed to save pinned tabs to localStorage', e);
        }
    }, [pinnedTabs, persistPinnedTabs, nav]);
    var handlePinToggle = function (index) {
        var copy = (0, tslib_1.__spreadArray)([], pinnedTabs, true);
        copy[index] = !copy[index];
        setPinnedTabs(copy);
    };
    var handlePinToggleAll = function () {
        if (pinnedTabs.length === nav.length && pinnedTabs.reduce(function (p, c) { return p && c; }, true)) {
            setPinnedTabs(new Array(nav.length).fill(false));
        }
        else {
            setPinnedTabs(new Array(nav.length).fill(true));
        }
    };
    var renderPin = function (tabIndex) { return (react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "thumbtack", onClick: function () { return handlePinToggle(tabIndex); }, className: pinnedTabs[tabIndex] ? 'text-warning' : 'text-light', style: !pinnedTabs[tabIndex] ? { transform: 'rotate(45deg)' } : {} })); };
    var renderTabLinks = function (anchors) { return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
            react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: 'all', onSelect: function () { return setShowAll(true); }, className: "text-white" },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: "thumbtack", onClick: handlePinToggleAll, className: pinnedTabs.length === nav.length && pinnedTabs.reduce(function (p, c) { return p && c; }, true)
                        ? 'text-warning'
                        : 'text-light', style: pinnedTabs.length === nav.length && pinnedTabs.reduce(function (p, c) { return p && c; }, true)
                        ? {}
                        : { transform: 'rotate(45deg)' } }),
                react_1.default.createElement("span", { className: "ml-4" }, "All"))),
        anchors.map(function (x, i) {
            return !x.permission || x.permission() ? (react_1.default.createElement(react_bootstrap_1.Nav.Item, { key: "v-pills-" + x.id.toLowerCase() + "-tab" },
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: x.id.toLowerCase(), onSelect: function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                        var element;
                        return (0, tslib_1.__generator)(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (r) {
                                        setTimeout(r, 100);
                                    })];
                                case 1:
                                    _a.sent();
                                    element = document.getElementById("recipe-section-" + x.id);
                                    if (element === null || element === void 0 ? void 0 : element.scrollIntoView)
                                        element === null || element === void 0 ? void 0 : element.scrollIntoView();
                                    window.scrollBy(0, -50);
                                    setCurrentTab(x.id);
                                    setShowAll(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, className: "text-white my-1 " + (currentTab === x.id ? 'active' : ' bg-dark ') },
                    renderPin(i),
                    react_1.default.createElement("span", { className: "ml-4" }, x.tab || x.label)))) : null;
        }))); };
    var renderTabContent = function () { return (react_1.default.createElement(react_bootstrap_1.Tab.Content, null, nav.map(function (n, i) { return (react_1.default.createElement(react_bootstrap_1.Tab.Pane, { key: "tab-nav-" + n.id, eventKey: n.id, title: n.label, active: showAll || pinnedTabs[i] || undefined, style: { marginBottom: 50 } },
        react_1.default.createElement(react_1.default.Fragment, null,
            renderPin(i),
            ' ',
            react_1.default.createElement("span", { id: "recipe-section-" + n.id, className: 'h3' }, n.label)),
        n.content)); }))); };
    var renderTabs = function () { return react_1.default.createElement(react_bootstrap_1.Col, null, renderTabContent()); };
    var loader = function (value, width, height) {
        if (width === void 0) { width = 275; }
        if (height === void 0) { height = 15; }
        return !loading ? (value) : (react_1.default.createElement(react_content_loader_1.default, { height: height, speed: 3, foregroundColor: '#333', backgroundColor: '#999' },
            react_1.default.createElement("rect", { x: "25", y: "0", rx: "5", ry: "5", width: width, height: height })));
    };
    var defaultProps = {
        xs: 12,
        md: 4,
        lg: 3,
    };
    return (react_1.default.createElement(react_bootstrap_1.Tab.Container, { defaultActiveKey: defaultActiveKey },
        react_1.default.createElement(react_bootstrap_1.Row, null,
            react_1.default.createElement(react_bootstrap_1.Col, (0, tslib_1.__assign)({}, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, defaultProps), (navLinkContainerProps || {}))),
                react_1.default.createElement("h3", { className: "text-center" },
                    typeof title !== 'undefined' && loader(title, 225, 25),
                    onTitleEdit && (react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { className: "text-white ml-2", style: { fontSize: 22 }, icon: "edit", onClick: onTitleEdit }))),
                react_1.default.createElement(react_bootstrap_1.Nav, { variant: "pills", className: "flex-column sticky-top sticky-top-pad" }, renderTabLinks(nav))),
            react_1.default.createElement(react_bootstrap_1.Col, null,
                react_1.default.createElement(react_bootstrap_1.Row, (0, tslib_1.__assign)({}, (navContentContainerProps || {})), renderTabs())))));
}
exports.default = TabLayout;
