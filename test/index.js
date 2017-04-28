import assert from 'assert';
import {renderToString} from 'inferno-server';
import {renderObserver, initObserver} from '../build/index';

describe('renderObserver', () => {

  it('outputs result without errors', () => {

    var state = {
      foo: 123
    , bar: "321"
    , baz: false
    , qux: {
        quux: "234"
      , corge: ['grault', 'garply']
      , waldo: null
      }
    };

    initObserver(state);
    renderToString(renderObserver(state));
  });


  it('changes root name according to the option', () => {

    var state = {};

    initObserver(state);
    var s1 = renderToString(renderObserver(state));

    initObserver(state, null, {rootName: 'root'});
    var s2 = renderToString(renderObserver(state));

    assert.equal(s1, s2.replace(/root/g, 'state'));
  });


  it('expands items specified in `options.watch`', () => {

    var state = {
      foo: {
        bar: 123
      , baz: "321"
      }
    , qux: {
        quux: 456
      , corge: "654"
      }
    };

    initObserver(state, null, {rootName: 's'});
    assert.deepEqual(
      ['.s', '.s.foo', '.s.qux'].map(s => !!state.observer.watch[s])
    , [true, false, false]);

    initObserver(state, null, {rootName: 's', watch: ['foo']});
    assert.deepEqual(
      ['.s', '.s.foo', '.s.qux'].map(s => !!state.observer.watch[s])
    , [true, true, false]);

    initObserver(state, null, {rootName: 's', watch: ['qux']});
    assert.deepEqual(
      ['.s', '.s.foo', '.s.qux'].map(s => !!state.observer.watch[s])
    , [true, false, true]);
  });
});

