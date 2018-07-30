let state = 0; //state = id

let touchstartPoint;
let touchendPoint;

let contentFlow = [
    {id: 0, text: 'Here is a sample question. Have you experienced ... before?', children: [{answer: 0, id: 1}, {answer: 1, id: 2}]},
    {id: 1, text: 'You haven\t? Here are some resources: ...', children: []},
    {id: 2, text: 'Share your story. Here\'s what you can do', children: []},
];

document.querySelector('#question').innerHTML = contentFlow[state]['text'];

document.querySelector('body').addEventListener('touchstart', function(e) {
    touchstartPoint = null;
    touchendPoint = null;
    console.log('test');
    console.log(e.changedTouches[0]['clientX']);
    touchstartPoint = e.changedTouches[0]['clientX']
})


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
})
