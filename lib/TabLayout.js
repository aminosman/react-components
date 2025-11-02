"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var react_1 = (0, tslib_1.__importStar)(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
var react_content_loader_1 = (0, tslib_1.__importDefault)(require("react-content-loader"));
function TabLayout(_a) {
    var _this = this;
    var defaultActiveKey = _a.defaultActiveKey, nav = _a.nav, defaultPinnedTabs = _a.defaultPinnedTabs, title = _a.title, loading = _a.loading, navLinkContainerProps = _a.navLinkContainerProps, navContentContainerProps = _a.navContentContainerProps, onTitleEdit = _a.onTitleEdit, pinnedTabsStorageKey = _a.pinnedTabsStorageKey;
    // Enable persistence if storage key is provided
    var persistPinnedTabs = !!pinnedTabsStorageKey;
    // Initialize pinnedTabs state - load from localStorage if persistence is enabled
    var getInitialPinnedTabs = function () {
        if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined') {
            return defaultPinnedTabs
                ? nav.map(function (x) { return defaultPinnedTabs === null || defaultPinnedTabs === void 0 ? void 0 : defaultPinnedTabs.includes(x.id); })
                : new Array(nav.length).fill(false);
        }
        try {
            var stored = localStorage.getItem(pinnedTabsStorageKey);
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
    var pinnedTabsRef = (0, react_1.useRef)(getInitialPinnedTabs());
    // Create stable nav IDs string for dependency tracking (updates when nav IDs change)
    var navIdsString = (0, react_1.useMemo)(function () {
        return JSON.stringify(nav.map(function (x) { return x.id; }).sort());
    }, [JSON.stringify(nav.map(function (x) { return x.id; }).sort())]);
    // Keep ref in sync with state
    (0, react_1.useEffect)(function () {
        pinnedTabsRef.current = pinnedTabs;
    }, [pinnedTabs]);
    // Helper function to save pinned tabs to localStorage immediately
    var savePinnedTabsToStorage = function (tabs) {
        if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined')
            return;
        try {
            // Ensure tabs array matches nav length before saving
            var safeTabs = tabs.length === nav.length
                ? tabs
                : (0, tslib_1.__spreadArray)([], tabs, true).concat(new Array(Math.max(0, nav.length - tabs.length)).fill(false))
                    .slice(0, nav.length);
            // Load existing pinned IDs to preserve tabs that load async
            var existingPinnedIds = [];
            try {
                var stored = localStorage.getItem(pinnedTabsStorageKey);
                if (stored) {
                    var parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        existingPinnedIds = parsed;
                    }
                }
            }
            catch (e) {
                // Ignore errors when loading existing data
            }
            // Get current nav IDs to update
            var currentNavIds_1 = new Set(nav.map(function (x) { return x.id; }));
            // Remove IDs that are in current nav (we'll update them)
            var preservedPinnedIds = existingPinnedIds.filter(function (id) { return !currentNavIds_1.has(id); });
            // Add pinned IDs from current nav
            var newPinnedIds = [];
            for (var i = 0; i < nav.length; i++) {
                if (safeTabs[i] && nav[i]) {
                    newPinnedIds.push(nav[i].id);
                }
            }
            // Merge preserved (async) tabs with current nav tabs
            var allPinnedIds = (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], preservedPinnedIds, true), newPinnedIds, true);
            localStorage.setItem(pinnedTabsStorageKey, JSON.stringify(allPinnedIds));
        }
        catch (e) {
            console.warn('Failed to save pinned tabs to localStorage', e);
        }
    };
    // Reload pinned tabs from localStorage when nav structure changes (if persistence is enabled)
    (0, react_1.useEffect)(function () {
        // Skip on initial mount since we already loaded in useState
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined') {
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
            var stored = localStorage.getItem(pinnedTabsStorageKey);
            if (stored) {
                var storedPinnedIds_2 = JSON.parse(stored);
                if (Array.isArray(storedPinnedIds_2)) {
                    // Map stored IDs to current nav (handles async-loaded tabs)
                    var loadedPinnedTabs = nav.map(function (x) { return storedPinnedIds_2.includes(x.id); });
                    // Ensure array length matches
                    while (loadedPinnedTabs.length < nav.length) {
                        loadedPinnedTabs.push(false);
                    }
                    var finalPinnedTabs = loadedPinnedTabs.slice(0, nav.length);
                    setPinnedTabs(finalPinnedTabs);
                    // Save again to ensure all tabs (including newly loaded ones) are persisted
                    savePinnedTabsToStorage(finalPinnedTabs);
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
    }, [pinnedTabsStorageKey, persistPinnedTabs, defaultPinnedTabs, nav.length, navIdsString]); // Reload when nav structure changes
    // Ensure pinnedTabs array length always matches nav length (safety check)
    var isSyncingLength = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (pinnedTabs.length !== nav.length) {
            isSyncingLength.current = true;
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
            // Save after syncing length to ensure persistence
            if (persistPinnedTabs && pinnedTabsStorageKey && !isInitialMount.current) {
                savePinnedTabsToStorage(newPinnedTabs);
            }
            // Reset flag after state update
            setTimeout(function () {
                isSyncingLength.current = false;
            }, 0);
        }
    }, [nav.length, pinnedTabs.length]);
    // Save pinned tabs to localStorage whenever they change (backup for programmatic changes)
    (0, react_1.useEffect)(function () {
        if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined')
            return;
        // Skip save on initial mount since we just loaded from storage
        if (isInitialMount.current)
            return;
        // Skip save if we're currently syncing array length to prevent saving incomplete data
        if (isSyncingLength.current)
            return;
        // Only save if array lengths match to ensure we save complete data
        if (pinnedTabs.length !== nav.length)
            return;
        savePinnedTabsToStorage(pinnedTabs);
    }, [pinnedTabs, persistPinnedTabs, pinnedTabsStorageKey, nav]);
    // Save on page unload as a final safeguard
    (0, react_1.useEffect)(function () {
        if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined')
            return;
        var handleBeforeUnload = function () {
            // Use ref to get the latest value since closure might have stale state
            savePinnedTabsToStorage(pinnedTabsRef.current);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        // Also listen to visibilitychange for when user switches tabs/windows
        var handleVisibilityChange = function () {
            if (document.visibilityState === 'hidden') {
                savePinnedTabsToStorage(pinnedTabsRef.current);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function () {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [persistPinnedTabs, pinnedTabsStorageKey, nav]);
    var handlePinToggle = function (index) {
        var copy = (0, tslib_1.__spreadArray)([], pinnedTabs, true);
        copy[index] = !copy[index];
        setPinnedTabs(copy);
        // Save immediately to ensure persistence before page unload
        savePinnedTabsToStorage(copy);
    };
    var handlePinToggleAll = function () {
        var newPinnedTabs;
        if (pinnedTabs.length === nav.length && pinnedTabs.reduce(function (p, c) { return p && c; }, true)) {
            newPinnedTabs = new Array(nav.length).fill(false);
        }
        else {
            newPinnedTabs = new Array(nav.length).fill(true);
        }
        setPinnedTabs(newPinnedTabs);
        // Save immediately to ensure persistence before page unload
        savePinnedTabsToStorage(newPinnedTabs);
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
