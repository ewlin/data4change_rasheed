let state = {
    q_id: null,
    q_progress: null,
};  //state tracks question AND progress

let currentQContent;

let touchstartPoint;
let touchendPoint;

const contentFlow = [
    /**
    {id: 0, text: "Something", children: [{answer: 0, id: 1}, {answer: 1, id: 2}]},
    {id: 1, text: 'You haven\t? Here are some resources: ...', children: []},
    {id: 2, text: 'Share your story. Here\'s what you can do', children: [{answer: 0, id: 3}, {answer: 1, id: 4}]},
    {id: 3, text: 'I do not feel comfortable sharing', children: []},
    {id: 4, text: 'What do you want to tell us?', children: []},
    **/
    {id: 0, slide_text: "Question 1 Text. Have you been...?", image: "image1.png"},
    {id: 1, slide_text: "Question 2 Text. Have you been...?", image: "imageA.png"},
    {id: 2, slide_text: "Question 3 Text. Have you been...?", image: "imageB.png"},
];

const dataVizPage = [
    {id: 0, slide_text: "Data Viz 1", image: "data_image1.svg"},
    {id: 1, slide_text: "Data Viz 2", image: "data_image2.svg"},
    {id: 2, slide_text: "Data Viz 3", image: "data_image3.svg"},
];

const sharedContent = [
    {slide_text: 'Rasheed content'},
    {slide_text: 'More content'},
    {slide_text: 'Here goes a form'},
];


function loadInitial() {
    if (!document.querySelector('ul')) {
        document.getElementById('container').appendChild(document.createElement('ul'));

        contentFlow.forEach((e,i) => {

            //document.getElementByID('question-container').
            let containerListItem = document.createElement('li');
            containerListItem.innerHTML = e.slide_text;
            //bind id with google analytics to track question #
            containerListItem.addEventListener('click', () => {
                state.q_id = e.id;
                state.q_progress = 0;
                document.getElementById('container').removeChild(document.querySelector('ul'));
                //update();
                generateSlides();
                document.querySelector('nav').style = 'display: block';

                console.log(state);
                gtag('event', 'first screen', {'event_category': `question-${e.id}`})
                //loadNavigation
            });
            document.querySelector('#container ul').appendChild(containerListItem);
        });
    }


}

loadInitial();


//New function to generate slides
function generateSlides() {
    const parentEle = document.querySelector('#container');
    currentQContent = [contentFlow[state.q_id], dataVizPage[state.q_id], ...sharedContent]

    currentQContent.forEach((slide, i) => {
        const slideElement = document.createElement('div');
        //element position absolute
        slideElement.style.zIndex = `-${i}`;
        slideElement.style.position = 'absolute';
        slideElement.classList.add('slide');
        slideElement.setAttribute('id', `slide${state.q_id}-${i}`)
        if (i == 0) {
            slideElement.classList.add('center');
        } else {
            slideElement.classList.add('right');
        }
        slideElement.innerHTML = `${currentQContent[i].slide_text}`;
        parentEle.appendChild(slideElement);
    });

}


//New version- update only controls sliding (shifting slides)
function update(slideFlag) {
    //state.q_id = state.q_id || 0;
    //state.q_progress = state.q_progress || 0;
    console.log(state.q_id, state.q_progress)
    currentQContent = [contentFlow[state.q_id], dataVizPage[state.q_id], ...sharedContent]
    /**
    if (slideFlag) {
        document.querySelector('#question').setAttribute('class', 'slideLeft');
        setTimeout(function() {
            document.querySelector('#question').innerHTML = currentQContent[state.q_progress]['slide_text'];
        }, 2000);
    } else {
        document.querySelector('#question').innerHTML = currentQContent[state.q_progress]['slide_text'];
    }
    **/
    document.querySelector('#question').innerHTML = currentQContent[state.q_progress]['slide_text'];

}

//update();

function shiftSlides(direction) {
    if (direction == 'back') {
        let currentSlide = document.querySelector(`#slide${state.q_id}-${state.q_progress + 1}`);
        let prevSlide = document.querySelector(`#slide${state.q_id}-${state.q_progress}`);

        currentSlide.classList.remove('center');
        currentSlide.classList.add('right');

        prevSlide.classList.remove('left');
        prevSlide.classList.add('center');
    } else if (direction == 'next') {
        let currentSlide = document.querySelector(`#slide${state.q_id}-${state.q_progress - 1}`);
        let nextSlide = document.querySelector(`#slide${state.q_id}-${state.q_progress}`);

        currentSlide.classList.remove('center');
        currentSlide.classList.add('left');

        nextSlide.classList.remove('right');
        nextSlide.classList.add('center');
    }

}

document.querySelector('#container').addEventListener('touchstart', function(e) {
    if (state.q_id != null) {
        touchstartPoint = null;
        touchendPoint = null;
        console.log('test');
        console.log(e.changedTouches[0]['clientX']);
        touchstartPoint = e.changedTouches[0]['clientX'];
    }
});


document.querySelector('#container').addEventListener('touchend', function(e) {
    if (state.q_id != null) {
        console.log('test');
        console.log(e.changedTouches[0]['clientX']);
        touchendPoint = e.changedTouches[0]['clientX'];

        if (touchendPoint > touchstartPoint) {
            state.q_progress > 0 ? state.q_progress-- : 0;
            shiftSlides('back');
        } else {
            state.q_progress < currentQContent.length - 1 ? state.q_progress++ : currentQContent.length - 1;
            shiftSlides('next');
        }
        console.log(state);

        //update('left');
    }

});


document.querySelector('#back').addEventListener('click', function(e) {
    if (state.q_id != null) {
        state.q_progress > 0 ? state.q_progress-- : 0;
    }
    console.log(state);
    shiftSlides('back');

});

document.querySelector('#next').addEventListener('click', function(e) {
    if (state.q_id != null) {
        state.q_progress < currentQContent.length - 1 ? state.q_progress++ : currentQContent.length - 1;
    }
    console.log(state);
    gtag('event', `screen-number-${state.q_progress}`, {'event_category': `question-${state.q_id}`});
    shiftSlides('next');


});



function reset() {
    document.querySelector('#question').innerHTML = '';
    state = {
        q_id: null,
        q_progress: null,
    };
    document.querySelector('nav').style = 'display: none';
}

document.querySelector('#home').addEventListener('click', function() {
    reset();
    loadInitial();
});


//Swipe distance calculation (basic trig for hypot...)
