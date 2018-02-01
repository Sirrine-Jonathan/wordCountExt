var words, 
    min = 100,
    max = 150,
    remembered = false;

function updateCount(){
  words = $('#words').val();
  var array = words.split(/\s+|\r/);
  var count = array.length;
  if(array.join('') === ''){
    count = 'Word Count';
  }
  
  $('#count').text(count);

  if(count < min){
    $('#count').css('color','blue');
    var remainder = min - count;  
	$('#goal').text(remainder+' words');
  }
  else if(count > max){
    $('#count')
      .css('color','red');
  }
  else if(count > min){
    $('#count')
      .css('color','black');
  }
}

function updateSweet(){
  $('#spot').text(min+' - '+max+' words');
}



/*
main: This runs when the html page (drop down) is opened.
*/
$(document).ready(function(){

  //retrieve storage
    retrieve();
  
  /*
	updates the wordcount with specific events on the html body
  */
  $('#words').on('keydown keypress', function(e){

		//Enter            //Space            //Backspace       //Delete
	if(e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 8 || e.keyCode == 46){
		updateCount();
		store();
    }
	if($('#clear')[0].innerHTML == 'Undo')
		$('#clear')[0].innerHTML = 'Clear';
  });
  
  /*
	Event handler for the Max
  */
  $('#maximum').on('change',function(){
    max = parseInt($('#maximum').val());
    $('#minimum').attr('maximum',max);
    if(min >= max){
      $('#minimum').val(max - 1);
      min = $('#minimum').val();
    }
    updateSweet();
    updateCount();
	store();
  });
  
  /*
	Event handler for the Min
  */
  $('#minimum').on('change',function(){
    min = parseInt($('#minimum').val());
    $('#maximum').attr('min',min);
    if(max <= min){
      $('#maximum').val(min + 1);
      max = $('#maximum').val();
    }
    updateSweet();
    updateCount();
	store();
  });
  
  $('#clear').on('click', function(){
	if(this.innerHTML == 'Clear')
	{
		store();
		words = ''; 
		min = 0;
		max = 1;
		$('#minimum').val(max - 1);
		$('#maximum').val(min + 1);
		$('#words').val(words);
		this.innerHTML = 'Undo';
		updateSweet();
		updateCount();
	}
	else
	{
		retrieve();
		this.innerHTML = 'Clear';
	}
  });
  
});

function store() {
    chrome.storage.sync.set({
		'min': min,
		'max': max,
		'words': words
	}, function(storage) {
		if(!remembered){
			$('#message').text('_min:'+min+'_max:'+max);
			remembered = true;
		}
		else{
			$('#message').text('-min:'+min+'-max:'+max);
			remembered = false;
		}
    });
}

/*
	retrieve: 
	remembers the min, max, and the words on the page from local storage
	updates all the fields or sets defaults
	displays a message in bottom right hand corner that storage has been found
*/
function retrieve(){
	chrome.storage.sync.get(['min','max','words'], function(items){
		
		//runs if the object in local storage is not empty
		if(!jQuery.isEmptyObject(items)){
			
			//if words is not empty, populates the body
			if(items.words != undefined){
				$('#words').val(items.words);
			}
			
			//if a min is recorded in storage
			if(items.min != undefined){
				min = items.min;
				$('#minimum').val(min);
			}
			//sets default min
			else{
				$('#minimum').val(min);
			}
			
			//if max is recorded in storage
			if(items.max != undefined){
				max = items.max;
				$('#maximum').val(max);
			}
			//sets default max
			else{
				$('#maximum').val(max);
			}
		}
		$('#message').text('-content retrieved-');
	
		//update count displays
		updateSweet();
		updateCount();
	});
}
