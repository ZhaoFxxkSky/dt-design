const { TextDecoder, TextEncoder } = require('node:util');
const ResizeObserver = require('resize-observer-polyfill');

// Use the polyfill as the global ResizeObserver (single definition)
global.ResizeObserver = ResizeObserver;
window.ResizeObserver = ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: jest.fn(),
        unobserve: jest.fn(),
    })),
});

Object.assign(global, { TextDecoder, TextEncoder });

// jsdom does not implement scrollIntoView — add a no-op stub
window.HTMLElement.prototype.scrollIntoView = function () {};
