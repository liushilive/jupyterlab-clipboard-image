import {
    JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';

const insertAt = (a: string, b: string, position: number) => a.substr(0, position) + b + a.substr(position);

const extension: JupyterFrontEndPlugin<void> = {
    id: 'jupyterlab-clipboard-image',
    autoStart: true,
    requires: [
        INotebookTracker,
    ],
    activate: (app: JupyterFrontEnd, notebooks: INotebookTracker, ) => {
        console.log('JupyterLab extension jupyterlab-clipboard-image is activated!');
        
        window.addEventListener("paste", async function (e: ClipboardEvent) {
            const items: any[] = [];
            const clipboardData = e.clipboardData || (window as any).clipboardData;
            if (!clipboardData) return items;

            let rawItems = clipboardData.items;
            if (!rawItems || !rawItems.length) return items;

            for (let i = 0, len = rawItems.length; i < len; i++) {
                const item = rawItems[i];
                if (!item.type.includes("image")) continue;
                items.push(item.getAsFile())
            }
            const clipboardImage = items.find(Boolean);

            if (!clipboardImage) return;

            var reader = new FileReader();
            reader.onloadend = function () {
                var base64data = reader.result;
                var content = `![](${base64data})`;
                if (notebooks.activeCell) {
                    const { line, column } = notebooks.activeCell.editor.getCursorPosition();
                    const cellContent = notebooks.activeCell.editor.model.value;
                    const newContent = cellContent.text.split("\n");

                    newContent[line] = insertAt(newContent[line], content, column);
                    cellContent.text = newContent.join("\n");

                    notebooks.activeCell.editor.setCursorPosition({
                        line: line + content.length,
                        column: column
                    });
                }
            }
            reader.readAsDataURL(clipboardImage);

        }, false);
    }
};

export default extension;

