// @flow

import Inferno from 'inferno';


type Action<State> = (s: State, d: Dispatch<State>) => void;
type Dispatch<State> = (a: Action<State>) => void;

type ObserverState = {
  observer: {
    enabled:  bool
  , watch:    Array<string>
  , rootName: string
  }
};

type ObserverOptions = {
  position?: ('left' | 'right')
, width?:    number
, rootName?: string
, watch?:    Array<string>
};

const coalesce = <T>(x: ?T, y:T):T => (null == x) ? y : x;

const initObserver = <State: Object>(
  state:     State
, _dispatch: Dispatch<State>
, options?:  ObserverOptions
): void => {

  options = (null != options) ? options : {};

  let rootName = coalesce(options.rootName, 'state');

  let watch = {};
  watch['.' + rootName] = true;

  let watchPaths = coalesce(options.watch, []);
  watchPaths.forEach(s => {
    var path = '.' + rootName;
    s.split('.').forEach(p => {
      path += '.' + p;
      watch[path] = true;
    });
  });

  state.observer = {
    enabled: true
  , watch: watch
  , rootName: rootName
  };


  if ('undefined' !== typeof document) {
    var style = document.createElement('style');
    style.id = 'observer-stylesheet';

    style.type = 'text/css';
    style.innerHTML = `
      #include "inferno-state-observer.css"
    `;

    document.getElementsByTagName('head')[0].appendChild(style);

    let sheet = style.sheet;
    if (sheet instanceof CSSStyleSheet) {

      let position = coalesce(options.position, 'right');
      let width = coalesce(options.width, 40);
      sheet.insertRule(`
        .observer {
          ${position}: 0px;
          width: ${width}ch;
        }`
      , sheet.cssRules.length);
    }
    else {
      // cannot modify the sheet
    }
  }
  else {
    // running not in a browser
  }
};


const toggleWatch = <State: Object & ObserverState>(name: string):Action<State> =>
  (state, _dispatch) => {
    let result = name in state.observer.watch && state.observer.watch[name];
    state.observer.watch[name] = !result;
  };


const renderSimpleValue = <State: Object & ObserverState>(
  state:     State
, _dispatch: Dispatch<State>
, key:       string
, value:     string
): React$Element<any> => (
  <div class = "field">
    <span class = "key">{key}: </span>
    <span class = {value == null ? 'null' : typeof value}>
      {value == null ? 'null' : value.toString()}
    </span>
  </div>
);


const renderCompositeValue = <State: Object & ObserverState>(
  state:    State
, dispatch: Dispatch<State>
, path:     string
, key:      string
, value:    Object
): React$Element<any> => {
  let newPath = path + '.' + key;
  let isExpanded = state.observer.watch[newPath];

  return (
    <div class = "field">
      <label>
        <input type = "checkbox"
          name = {path + '.' + key}
          checked = {isExpanded}
          onInput = {e => dispatch(toggleWatch(e.target.name))}
        />
        <div class = "widget"/>
        <span class = "key">{key}</span>
      </label>

      <div class = {'contents' + ((isExpanded) ? '' : ' hidden')}>
        {Object.keys(value)
          .filter((path.length) ? _ => true : x => 'observer' !== x)
          .map(x => (null !== value[x] && 'object' == typeof value[x])
            ? renderCompositeValue(state, dispatch, path + '.' + key, x, value[x])
            : renderSimpleValue(state, dispatch, x, value[x]))}
      </div>
    </div>);
};



const renderObserver = <State: Object & ObserverState>(
  state: State
, dispatch: Dispatch<State>
): React$Element<any> =>
  (state.observer && state.observer.enabled)
    ? (<div class = "observer">
         {renderCompositeValue(state, dispatch, '', state.observer.rootName, state)}
       </div>)
    : (<div class = "observer"/>);

export {initObserver, renderObserver};
