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
    console.log(renderToString(renderObserver(state)));
  });


  it('changes root name according to the option', () => {

    var state = {};

    initObserver(state);
    var s1 = renderToString(renderObserver(state));

    initObserver(state, null, {rootName: 'root'});
    var s2 = renderToString(renderObserver(state));

    assert.equal(s1, s2.replace(/root/g, 'state'));
  });
});

