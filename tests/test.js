import test from 'ava';
import BufferId from '../index';

test('First path should be [0,0,0]', t => {
    const root = new BufferId({
        idLength: 3,
        indexRange: 10
    });

    let path = root.create();
    t.deepEqual(path, [0,0,0]);
});

test('Third path should be [0,0,2]', t => {
    const root = new BufferId({
        idLength: 3,
        indexRange: 10
    });

    root.create();
    root.create();
    let path = root.create();
    t.deepEqual(path, [0,0,2]);
});

test('ID removal should release it', t => {
    const root = new BufferId({
        idLength: 3,
        indexRange: 10
    });

    root.create();
    root.create();
    root.remove([0,0,1]);
    let path = root.create();
    t.deepEqual(path, [0,0,1]);
});

test('ID should have length 2', t => {
    const root = new BufferId({
        idLength: 2,
        indexRange: 10
    });

    let path = root.create();
    t.is(path.length, 2);
});

test('Last ID should be [1,1]', t => {
    const root = new BufferId({
        idLength: 2,
        indexRange: 5
    });

    root.create();
    root.create();
    root.create();
    root.create();
    root.create();
    root.create();

    let path = root.create();
    t.deepEqual(path, [1,1]);
});

test('indexRange should be 256 if option is not specified', t => {
    const root = new BufferId({
        idLength: 3
    });

    for(let i = 0; i < 255; i++) {
        root.create();
    }

    let path = root.create();
    let nextPath = root.create();
    t.deepEqual(path, [0,0,255]);
    t.deepEqual(nextPath, [0,1,0])
});

test('id should be buffer if format is set to buffer', t => {
    const root = new BufferId({
        idLength: 3,
        idFormat: 'buffer'
    });

    let path = root.create();
    t.is(path instanceof Buffer, true);
});
