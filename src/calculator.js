const editor = document.querySelector('.editor');
const viewer = document.querySelector('.viewer');

let editorQueue = [];

const reRenderEditor = () => {
    editor.innerText = (() => {
        let str = '';
        editorQueue.forEach(elm => {
            str += elm;
        });
        return str;
    })();
};

const reRenderOutput = () => {
    viewer.innerText = (() => {
        let wordListQueue = [];
        editorQueue.forEach(elm => {
            if (wordListQueue.length === 0) {
                wordListQueue.push(elm);
            } else {
                const lastElement = wordListQueue.pop();

                const isLastElementOperator = ['+', '-', '*', '/', '%'].includes(lastElement);
                const isElementOperator = ['+', '-', '*', '/', '%'].includes(elm);

                if (isLastElementOperator) {
                    wordListQueue.push(lastElement);
                    wordListQueue.push(elm);
                } else {
                    if (isElementOperator) {
                        wordListQueue.push(lastElement);
                        wordListQueue.push(elm);
                    } else {
                        wordListQueue.push(`${lastElement}${elm}`);
                    }
                }
            }
        });
        console.log(wordListQueue);
        return '';
    })();
}

editorQueue = ['1', '2', '3', '-', '2', '4', '5', '*', '6', '/', '8', '9', '+', '4', '%', '4'];
reRenderOutput();

const numericKeys = [
    document.querySelector('.zero'),
    document.querySelector('.one'),
    document.querySelector('.two'),
    document.querySelector('.three'),
    document.querySelector('.four'),
    document.querySelector('.five'),
    document.querySelector('.six'),
    document.querySelector('.seven'),
    document.querySelector('.eight'),
    document.querySelector('.nine')
];

numericKeys.forEach(numericKey => {
    numericKey.addEventListener('click', e => {
        editorQueue.push(e.target.innerText);
        reRenderEditor();
    })
});

document.querySelector('.clr').addEventListener('click', e => {
    editorQueue = [];
    editor.innerText = '';
    viewer.innerText = '';
});

document.querySelector('.del').addEventListener('click', e => {
    editorQueue.pop()
    reRenderEditor();
    viewer.innerText = 'TODO: //'  // TODO:
});

const add = document.querySelector('.add');
const sub = document.querySelector('.sub');
const mul = document.querySelector('.mul');

const point = document.querySelector('.point');

const percentage = document.querySelector('.percentage');

const divide = document.querySelector('.divide');
