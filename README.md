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

