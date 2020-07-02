import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Workspace } from './workspace/Workspace';

const appElement = document.createElement('div');
appElement.classList.add('guiai');
document.body.appendChild(appElement);

ReactDOM.render(
  <Workspace />,
  appElement,
);
