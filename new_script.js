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
        document.getElementById('question-container').appendChild(document.createElement('ul'));

        contentFlow.forEach((e,i) => {

            //document.getElementByID('question-container').
            let containerListItem = document.createElement('li');
            containerListItem.innerHTML = e.slide_text;
            //bind id with google analytics to track question #
            containerListItem.addEventListener('click', () => {
                state.q_id = e.id;
                state.q_progress = 0;
                document.getElementById('question-container').removeChild(document.querySelector('ul'));
                update();
                document.querySelector('nav').style = 'display: block';

                console.log(state);
                gtag('event', `question-${e.id}`, {'event_category': 'first screen'})
                //loadNavigation
            });
            document.querySelector('#question-container ul').appendChild(containerListItem);
        });
    }


}

loadInitial();


function update() {
    //state.q_id = state.q_id || 0;
    //state.q_progress = state.q_progress || 0;
    console.log(state.q_id, state.q_progress)
    currentQContent = [contentFlow[state.q_id], dataVizPage[state.q_id], ...sharedContent]

    document.querySelector('#question').innerHTML = currentQContent[state.q_progress]['slide_text'];

}

//update();

/**
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

        if (touchendPoint < touchstartPoint) {
            state.q_progress > 0 ? state.q_progress-- : 0;
        } else {
            state.q_progress < currentQContent.length - 1 ? state.q_progress++ : currentQContent.length - 1;
        }
        console.log(state);

        update();
    }

});

**/


document.querySelector('#back').addEventListener('click', function(e) {
    if (state.q_id != null) {
        state.q_progress > 0 ? state.q_progress-- : 0;
    }
    console.log(state);

    update();
});

document.querySelector('#next').addEventListener('click', function(e) {
    if (state.q_id != null) {
        state.q_progress < currentQContent.length - 1 ? state.q_progress++ : currentQContent.length - 1;
    }
    console.log(state);
    gtag('event', `question-${state.q_id}`, `screen-number-${state.q_progress}`);

    update();
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
