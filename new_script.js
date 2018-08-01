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
    {id: 0, slide_text: "Have you had to bribe someone for a service?", image: "assets/bribe.svg"},
    {id: 1, slide_text: "Has anyone paid you to vote for them?", image: "assets/election.svg"},
    {id: 2, slide_text: "Have you had to resort to wasta?", image: "assets/wasta.svg"},
    {id: 3, slide_text: "Other", input: true, input_type: 'textbox'}
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
            containerListItem.innerHTML =
                e.image
                    ? `<div class='q-wrapper'><img class='q-img' src=${e.image} /><p>${e.slide_text}</p></div>`
                    : `<div class='q-wrapper'><div class='q-img'></div><p>${e.slide_text}</p></div>`;
            //bind id with google analytics to track question #
            containerListItem.addEventListener('click', () => {
                state.q_id = e.id;
                state.q_progress = 0;
                document.getElementById('container').removeChild(document.querySelector('ul'));
                document.getElementById('container').removeChild(document.querySelector('#centerCircle'));

                //update();
                generateSlides();


                //generate navigation buttons

                let nav = document.createElement('nav');
                nav.innerHTML = `<span id='home'>HOME</span> | <span>TEST</span>`;
                document.getElementById('container').appendChild(nav);

                document.querySelector('#home').addEventListener('click', function() {
                    reset();
                    loadInitial();
                });

                console.log(state);
                gtag('event', 'first screen', {'event_category': `question-${e.id}`})
                //loadNavigation
            });
            document.querySelector('#container ul').appendChild(containerListItem);
        });

        //circle text
        const circleText = document.createElement('div');
        circleText.setAttribute('id', 'centerCircle');
        circleText.innerHTML = "<p>Have you experienced corruption?</p><p class='small_blue'>Select one</p>"
        document.querySelector('#container').appendChild(circleText);
    }


}

loadInitial();


//New function to generate slides
function generateSlides() {
    const parentEle = document.querySelector('#container');
    currentQContent = [dataVizPage[state.q_id], ...sharedContent]

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
    document.querySelector('#container').querySelectorAll('.slide').forEach(slide => document.querySelector('#container').removeChild(slide));
    document.querySelector('#container').removeChild(document.querySelector('#container').querySelector('nav'));
    state = {
        q_id: null,
        q_progress: null,
    };

}




//Swipe distance calculation (basic trig for hypot...)
