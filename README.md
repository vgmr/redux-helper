# redux-helper [![npm version](https://img.shields.io/npm/v/redux-helper.svg?style=flat)](https://www.npmjs.com/package/redux-helper) [![build](https://travis-ci.org/vgmr/redux-helper.svg)](https://travis-ci.org/vgmr/redux-helper)

_Action creator, checked action creator and checked promise middleware._

This library is written in order to support development of projects using redux in typescript.

The goal is to try to get as much advantage as possible form the strong typing system that typescript provide in
order to reduce errors and catch them early.

> For example actions will be defined once and they will provide a matchAction function that reducers can use
to match the received action and get the typed payload.


# Usage 

```bash
npm i 'redux-helper' --save
```

### Simple action creator
```ts
//actions.ts
import {createAction} from 'redux-helper';

export const addProduct =  createAction<{name:string}> ('ADD_TODO'); // ADD_TODO literal is written only here.

//reducer.ts
import {Action} from 'redux-helper';
import {addProduct} from './actions.ts'; 

const reducer = (state: IProductsModel = defaultState, action: Action<any>) => {
    if (actions.addProduct.matchAction(action)) {
        ...
        // the type of action payload here is {name:string}
        // no need to cast or test string literals 
    }

//dispatch action..
import {addProduct} from './actions.ts'; 
...
    //event handler, 
    const onAddTodo = (name:string) =>{
        this.props.dispatch(addProduct({name:name}));
    }
...
```

### Checked action creator
```ts
//actions.ts
import {createCheckedAction} from 'redux-helper';

```

### Configure middleware
```ts


```


# Development

```bash
'run unit test'
npm test

'build'
npm run build

'release to npm repository (only authorized members)'
npm run release
```

