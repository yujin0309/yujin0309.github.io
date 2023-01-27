"use strict";
/*화면의 verticalBar를 마우스로 드래그해서 
/*재생플레이어와 챗창의 화면너비 비율을 조절하는 자바스크립트 코드*/
// Query the element
const resizer = document.getElementsByClassName('gutter');
const leftSide = resizer[0].previousElementSibling;
const rightSide = resizer[0].nextElementSibling;

// The current position of mouse
let x = 0;
let y = 0;

// Width of left side
let leftWidth = 0;

//마우스 드래그시 작동
const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const newLeftWidth = (leftWidth + dx) * 100 / resizer[0].parentNode.getBoundingClientRect().width;
    /*재생플레이어 최소 너비는 전체화면의 10% 이상 90미만으로 제한*/
    if (newLeftWidth >= 10 && newLeftWidth < 90) {
        leftSide.style.width = `${newLeftWidth}%`;
        rightSide.style.width = `${100 - newLeftWidth}%`;
    }
    /*console.error("움직일때너비",newLeftWidth);*/

    document.body.style.cursor = 'col-resize';
    leftSide.style.userSelect = 'none';
    leftSide.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
};
const mouseUpHandler = function () {
    resizer[0].style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    leftSide.style.removeProperty('user-select');
    leftSide.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

// Handle the 마우스클릭 event
// that's triggered when user drags the resizer
const mouseDownHandler = function (e) {
    // Get the current mouse positionS
    x = e.clientX;
    y = e.clientY;
    leftWidth = leftSide.getBoundingClientRect().width;
    /*console.error("클릭시너비",leftWidth);*/
    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};
// Attach the handler
resizer[0].addEventListener('mousedown', mouseDownHandler);
