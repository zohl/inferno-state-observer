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
});

