const editor = document.querySelector('.editor');
const viewer = document.querySelector('.viewer');

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

const operatorKeys = [
    document.querySelector('.add'),
    document.querySelector('.sub'),
    document.querySelector('.mul'),
    document.querySelector('.divide'),
    document.querySelector('.percentage')
];

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

        if (wordListQueue.length <= 2) {
            return '';
        }

        for (let i = 0; i < wordListQueue.length; i++) {
            if (wordListQueue[i] === '%') {
                wordListQueue[i - 1] = JSON.stringify(parseFloat(wordListQueue[i - 1]) / 100)
                wordListQueue[i] = '*'
            }
        }

        const calcRes = (op, index) => {
            const operandBefore = parseFloat(wordListQueue[index - 1]);
            const operandAfter = parseFloat(wordListQueue[index + 1]);

            if (op === '/') {
                return JSON.stringify(operandBefore / operandAfter);
            } else if (op === '*') {
                return JSON.stringify(operandBefore * operandAfter);
            } else if (op === '+') {
                return JSON.stringify(operandBefore + operandAfter);
            } else {
                return JSON.stringify(operandBefore - operandAfter);
            }
        }

        for (let stage = 1; stage <= 4; stage++) {
            for (let i = 0; i < wordListQueue.length; ) {
                const sliceBefore = wordListQueue.slice(0, i - 1);
                const sliceAfter = wordListQueue.slice(i + 2, wordListQueue.length);
                if (stage === 1 && wordListQueue[i] === '/' && i !== wordListQueue.length - 1) {
                    wordListQueue = [...sliceBefore, calcRes(wordListQueue[i], i), ...sliceAfter];
                } else if (stage === 2 && wordListQueue[i] === '*' && i !== wordListQueue.length - 1) {
                    wordListQueue = [...sliceBefore, calcRes(wordListQueue[i], i), ...sliceAfter];
                } else if (stage === 3 && wordListQueue[i] === '+' && i !== wordListQueue.length - 1) {
                    wordListQueue = [...sliceBefore, calcRes(wordListQueue[i], i), ...sliceAfter];
                    console.log(editorQueue);
                    console.log(wordListQueue);
                } else if (stage === 4 && wordListQueue[i] === '-' && i !== wordListQueue.length - 1) {
                    wordListQueue = [...sliceBefore, calcRes(wordListQueue[i], i), ...sliceAfter];
                } else {
                    i++;
                }
            }
        }

        return wordListQueue.length === 0 ? '' : parseFloat(wordListQueue[0]).toFixed(2)
    })();
}

const numericKeyPressEventHandler = value => {
    editorQueue.push(value);
    reRenderEditor();
    reRenderOutput();
}
const pointEventHandler = () => {
    let lastOperatorIndex = -1;
    for (let i = 0; i < editorQueue.length; i++) {
        if (['+', '-', '*', '/', '%'].includes(editorQueue[i])) {
            lastOperatorIndex = i;
        }
    }
    const sliceAfterLastOperator = editorQueue.slice(lastOperatorIndex + 1, editorQueue.length);
    if (!sliceAfterLastOperator.includes('.')) {
        const lastElement = editorQueue.pop();
        editorQueue.push(lastElement);

        if (lastElement !== undefined) {
            editorQueue.push('.');
            reRenderEditor();
            reRenderOutput();
        }
    }
}
const clearScreenEventHandler = () => {
    editorQueue = [];
    editor.innerText = '';
    viewer.innerText = '';
}
const deleteKeyEventHandler = () => {
    editorQueue.pop();
    reRenderEditor();
    reRenderOutput();
}
const operatorKeyEventHandler = keyText => {
    const lastElement = editorQueue.pop();

    if (!['-', '+', '*', '/', '%', '.'].includes(lastElement) && lastElement !== undefined) {
        editorQueue.push(lastElement);
        editorQueue.push(keyText);
        reRenderEditor();
        reRenderOutput();
    }
}

numericKeys.forEach(numericKey => {
    numericKey.addEventListener('click', e => {
        numericKeyPressEventHandler(e.target.innerText);
    });
});

document.querySelector('.point').addEventListener('click', e => pointEventHandler());

document.querySelector('.clr').addEventListener('click', e => clearScreenEventHandler());
document.querySelector('.del').addEventListener('click', e => deleteKeyEventHandler());

operatorKeys.forEach(operator => {
    operator.addEventListener('click', e => {
        operatorKeyEventHandler(e.target.innerText);
    });
});

document.addEventListener('keydown', e => {
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(e.key)) {
        numericKeyPressEventHandler(e.key);
    } else if (e.key === '.') {
        pointEventHandler()
    } else if (e.key === 'Backspace') {
        deleteKeyEventHandler()
    } else if (e.key === 'Delete') {
       clearScreenEventHandler()
    } else if (['+', '-', '%', '/', '*'].includes(e.key)) {
        operatorKeyEventHandler(e.key);
    }
});