var myVideo = document.getElementById('video');
if (typeof myVideo.loop == 'boolean') { 
  myVideo.loop = true;
} 
else {
  myVideo.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
  }, false);
}
myVideo.play();