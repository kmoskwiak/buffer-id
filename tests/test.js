import test from 'ava';
import Tree from '../index';

test('First path should be [0,0,0]', t => {
    const root = new Tree({
        pathLength: 3
    });
    let path = root.create();
    t.deepEqual(path, [0,0,0]);
});

test('Third path should be [0,0,2]', t => {
    const root = new Tree({
        pathLength: 3
    });
    root.create();
    root.create();
    let path = root.create();
    t.deepEqual(path, [0,0,2]);
});

test('Path removal should release it', t => {
    const root = new Tree({
        pathLength: 3
    });
    root.create();
    root.create();
    root.remove([0,0,1]);
    let path = root.create();
    t.deepEqual(path, [0,0,1]);
});
