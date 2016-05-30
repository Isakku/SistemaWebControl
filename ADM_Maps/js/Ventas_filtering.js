// Run the script on DOM ready:
$(function(){
	
	$('table').visualize({type: 'pie', height: '300px', width: '420px', rowFilter: ':not(:last)', colFilter: ':not(:last-child)'});
	
	//filtered chart
 	$('table')
 		.visualize({
	 		rowFilter: ':not(:last)',
	 		colFilter: ':not(:last-child)'
	 	})
/*	 	.before("<h2>B) Charted with filters to exclude totals data</h2><pre><code>$('table').visualize({<strong>rowFilter: ':not(:last)', colFilter: ':not(:last-child)'</strong>});</code></pre>");*/
 			
		
		$('table td')
		.click(function(){
			if( !$(this).is('.input')){
				$(this).addClass('input')
					.html('<input type="text" value="'+ $(this).text() +'" />')
					.find('input').focus()
					.blur(function(){
						//remove td class, remove input
						$(this).parent().removeClass('input').html($(this).val() || 0);
						//update charts	
						$('.visualize').trigger('visualizeRefresh');
					});					
			}
		})
		.hover(function(){ $(this).addClass('hover'); },function(){ $(this).removeClass('hover'); });
});