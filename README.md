# redux-helper

action creator, checked action creator and checked promise middleware.

# Usage 

```bash
npm i 'redux-helper' --save
```

Simple action creator
```ts
//actions.ts
import {createAction} from 'redux-helper';

export const addProduct =  createAction<{name:string}> ('ADD_TODO');

//reducer.ts
import {Action} from 'redux-helper';
import {addProduct} from './actions.ts';

const reducer = (state: IProductsModel = defaultState, action: Action<any>) => {
    if (actions.addProduct.matchAction(action)) {
        ...
        // the type of action payload here is {name:string}
        // 
    }

```


## Use action creator


## Use checked action creator

## Configure checked promise middleware


# Development

```bash
'run unit test'
npm test

'build'
npm run build

'release to npm repository (only authorized members)'
npm run release
```

