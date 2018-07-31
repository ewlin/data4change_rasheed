let state = 0; //state = id

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
    {id: 0, question_text: "Question 1 Text. Have you been...?", image: "image1.png", data_viz_page: {title: "Data Viz 1", image: "data_image1.svg"}},
    {id: 1, question_text: "Question 2 Text. Have you been...?", image: "imageA.png", data_viz_page: {title: "Data Viz 2", image: "data_image1.svg"}},
    {id: 2, question_text: "Question 3 Text. Have you been...?", image: "imageB.png", data_viz_page: {title: "Data Viz 3", image: "data_image1.svg"}},

];

document.querySelector('#question').innerHTML = contentFlow[state]['text'];

document.querySelector('body').addEventListener('touchstart', function(e) {
    touchstartPoint = null;
    touchendPoint = null;
    console.log('test');
    console.log(e.changedTouches[0]['clientX']);
    touchstartPoint = e.changedTouches[0]['clientX']
});


document.querySelector('body').addEventListener('touchend', function(e) {
    console.log('test');
    console.log(e.changedTouches[0]['clientX']);
    touchendPoint = e.changedTouches[0]['clientX'];
    if (contentFlow[state]['children'].length != 0) {
        if (touchendPoint < touchstartPoint) {
            state = contentFlow[state].children[0]['id'];
        } else {
            state = contentFlow[state].children[1]['id'];
        }
        document.querySelector('#question').innerHTML = contentFlow[state]['text'];
    }
});

//Swipe distance calculation (basic trig for hypot...)
