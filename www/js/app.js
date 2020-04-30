navigator.serviceWorker.register("/sw.js").then(function(reg){
	console.log("sukses");
}).catch(function(error){
	console.log("galat");
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  //$('abbr').tooltip();
})

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("btn-scroll-top").style.display = "block";
  } else {
    document.getElementById("btn-scroll-top").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}