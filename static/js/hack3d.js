// Legacy 3D module intentionally neutralised.
// Kept as a harmless compatibility shim for old cache paths.
export function createHack3D() {
    return {
        start() {
            return 'Legacy 3D theatre retired. No real systems touched.';
        },
        stop() {},
    };
}
