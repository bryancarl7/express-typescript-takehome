import 'reflect-metadata';

if (typeof (global as any).AbortController === 'undefined') {
    (global as any).AbortController = class {
        public signal = { aborted: false };
        public abort(): void { this.signal.aborted = true; }
    };
}
