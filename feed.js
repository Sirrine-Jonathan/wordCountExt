  var words; 
  var min = 100;
  var max = 150;
  var remembered = false;

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
  
	//run storage
	store();
}

function updateSweet(){
  $('#spot').text(min+' - '+max+' words');
}


$(document).ready(function(){
	
  //retrieve storage
    retrieve();
  
  $('#words').on('keydown keypress', function(e){
		//console.log(e.keyCode);
		//Enter            //Space            //Backspace       //Delete
	if(e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 8 || e.keyCode == 46){
		updateCount();
    }
  });
  
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
  })
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

  function retrieve(){
  chrome.storage.sync.get(['min','max','words'], function(items){
	if(!jQuery.isEmptyObject(items)){
		if(items.words != undefined){
			$('#words').val(items.words);
		}
		if(items.min != undefined){
			min = items.min;
			$('#minimum').val(min);
		}
		else{
			$('#minimum').val(min);
		}
		if(items.max != undefined){
			max = items.max;
			$('#maximum').val(max);
		}
		else{
			$('#maximum').val(max);
		}
	}
	$('#message').text('-content retrieved-');
  });
}
