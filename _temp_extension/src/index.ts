import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-clipboard-image extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-clipboard-image:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-clipboard-image is activated!');
  }
};

export default extension;
