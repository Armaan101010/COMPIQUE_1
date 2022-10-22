jQuery(document).ready(function($){
	//open/close lateral filter
	$('filter-trigger').on('click', function(){
		triggerFilter(true);
	});
	$('filter close').on('click', function(){
		triggerFilter(false);
	});

	function triggerFilter($bool) {
		var elementsToTrigger = $([$('filter-trigger'), $('filter'), $('tab-filter'), $('gallery')]);
		elementsToTrigger.each(function(){
			$(this).toggleClass('filter-is-visible', $bool);
		});
	}

	//mobile version - detect click event on filters tab
	var filter_tab_placeholder = $('tab-filter .placeholder a'),
		filter_tab_placeholder_default_value = 'Select',
		filter_tab_placeholder_text = filter_tab_placeholder.text();
	
	$('tab-filter li').on('click', function(event){
		//detect which tab filter item was selected
		var selected_filter = $(event.target).data('type');
			
		//check if user has clicked the placeholder item
		if( $(event.target).is(filter_tab_placeholder) ) {
			(filter_tab_placeholder_default_value == filter_tab_placeholder.text()) ? filter_tab_placeholder.text(filter_tab_placeholder_text) : filter_tab_placeholder.text(filter_tab_placeholder_default_value) ;
			$('tab-filter').toggleClass('is-open');

		//check if user has clicked a filter already selected 
		} else if( filter_tab_placeholder.data('type') == selected_filter ) {
			filter_tab_placeholder.text($(event.target).text());
			$('tab-filter').removeClass('is-open');	

		} else {
			//close the dropdown and change placeholder text/data-type value
			$('tab-filter').removeClass('is-open');
			filter_tab_placeholder.text($(event.target).text()).data('type', selected_filter);
			filter_tab_placeholder_text = $(event.target).text();
			
			//add class selected to the selected filter item
			$('tab-filter .selected').removeClass('selected');
			$(event.target).addClass('selected');
		}
	});
	

	/************************************
		MitItUp filter settings
		More details: 
		https://mixitup.kunkalabs.com/
		or:
		http://codepen.io/patrickkunka/
	*************************************/

	buttonFilter.init();
	$('gallery ul').mixItUp({
	    controls: {
	    	enable: false
	    },
	    callbacks: {
	    	onMixStart: function(){
	    		$('fail-message').fadeOut(200);
	    	},
	      	onMixFail: function(){
	      		$('fail-message').fadeIn(200);
	    	}
	    }
	});
    
	var inputText;
	var $matching = $();

	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		};
	})();

	$("filter-content input[type='search']").keyup(function(){
	  	// Delay function invoked to make sure user stopped typing
	  	delay(function(){
	    	inputText = $("filter-content input[type='search']").val().toLowerCase();
	   		// Check to see if input field is empty
	    	if ((inputText.length) > 0) {            
	      		$('.mix').each(function() {
		        	var $this = $(this);
		        
		        	// add item to be filtered out if input text matches items inside the title   
		        	if($this.attr('class').toLowerCase().match(inputText)) {
		          		$matching = $matching.add(this);
		        	} else {
		          		// removes any previously matched item
		          		$matching = $matching.not(this);
		        	}
	      		});
	      		$('gallery ul').mixItUp('filter', $matching);
	    	} else {
	      		// resets the filter to show all item if input is empty
	      		$('gallery ul').mixItUp('filter', 'all');
	    	}
	  	}, 200 );
	});
});

/*****************************************************
	MixItUp - Define a single object literal 
	to contain all filter custom functionality
*****************************************************/
    var buttonFilter = {
        // Declare any variables we will need as properties of the object
        $filters: null,
        groups: [],
        outputArray: [],
        outputString: '',
    
        // The "init" method will run on document ready and cache any jQuery objects we will need.
        init: function(){
            var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.
        
            self.$filters = $('main-content');
            self.$container = $('gallery ul');
        
            self.$filters.find('filters').each(function(){
                var $this = $(this);
            
                self.groups.push({
                    $inputs: $this.find('.filter'),
                    active: '',
                    tracker: false
                });
            });
            
            self.bindHandlers();
        },
    
    };