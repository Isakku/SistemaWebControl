//--------------------------------------------------------------------------------------------
//AJAX-PHP engine javascript functions  

/**=============================================================================
 *
 *	Filename:  functions.js
 *	
 *	(c)Autor: Josue Cortez Zárate
 *	
 *	Description: Contiene mi propia edición de código encontrado en internet
 *	
 *	Originalmente creado por varios autores como ser Arkos Noem Arenom
 *
 *	Licence: GPL|LGPL
 *	
 *===========================================================================**/

//--------------------------------------------------------------------------------------------
//Global variables
var lat_value
var lng_value
var Place_Name
var usr_priv=0;
var LoginTry=0;// saber estos dos valores si cierran la pestaña... cookies?
var USR_CI="";
var HTML="";
var gpos;

console.log();
console.dir();
console.warn();
console.error();
//--------------------------------------------------------------------------------------------
//Map Functions //they execute before the jquery ones

//  

  //if ("geolocation" in navigator) {  
  if ("geolocation" in navigator || navigator.geolocation) {
  alert("geolocation is available");  
} else {  
  alert("I'm sorry, but geolocation services are not supported by your browser.");  
}/* */


				$('#gmap-3').live("pageshow", function() {
					//$('#map_canvas_2').gmap('refresh');
					$('#map_canvas_1').gmap('getCurrentPosition', function(position, status) {
						if ( status === 'OK' ) {
							lat_value= position.coords.latitude;
							lng_value= position.coords.longitude;
							set_map_pos(lat_value,lng_value);
							} else {
							alert('reintentando obtener posición'+status.message+status.code); // se vuelve a intentar obtener la posicion 
									$('#map_canvas_1').gmap('getCurrentPosition', function(position, status) {
									if ( status === 'OK' ) {
										lat_value= position.coords.latitude;
										lng_value= position.coords.longitude;
										set_map_pos(lat_value,lng_value);
										} else {
										alert('Unable to get current position'+status.message+status.code);
									}
								}, { timeout: 15000, enableHighAccuracy: true} );
						}
					}, { maximumAge:Infinity, timeout:30000, enableHighAccuracy: true} );

				});
// error.code can be:
//   0: unknown error
//   1: permission denied
//   2: position unavailable (error response from location provider)
//   3: timed out				
/*
The API function gmap(getCurrentPosition) is a wrapper for navigator.geolocation.getcurrentposition (API function at jquery.ui.map.extensions.js)

The enableHighAccuracy attribute provides a hint that the application would like to receive the best possible results. This may result in slower response times or increased power consumption. The user might also deny this capability, or the device might not be able to provide more accurate results than if the flag wasn't specified. The intended purpose of this attribute is to allow applications to inform the implementation that they do not require high accuracy geolocation fixes and, therefore, the implementation can avoid using geolocation providers that consume a significant amount of power (e.g. GPS). This is especially useful for applications running on battery-powered devices, such as mobile phones.

 By using the maximumAge:300000' option above, the position object is guaranteed to be at most 5 minutes old.
 
 http://www.w3.org/TR/geolocation-API/
*/				
				
function set_map_pos(_lat,_lng){
							lat_value= _lat;
							lng_value= _lng;
							var latlng = new google.maps.LatLng(lat_value, lng_value);
							$("#latitud").val(lat_value);//store value to hidden div in VentasForm
							$("#longitud").val(lng_value);//store value to hidden div in VentasForm
//alert(lat_value); alert(lng_value); 

							$('#map_canvas_1').gmap('addMarker', { 'position': new google.maps.LatLng(lat_value, lng_value), 'bounds': true } );

							$('#map_canvas_1').gmap('get', 'map').panTo(latlng);
							$('#map_canvas_1').gmap('search', { 'location': latlng }, function(results, status) {
								if ( status === 'OK' ) {
									$('#from').val(results[0].formatted_address);
									Place_Name=$('#from').val();
									$("#nombre_lugar").val(Place_Name);//store value to hidden div in VentasForm
//alert($('#from').val());
								}
							});
							
						
	}
				
				// To stop the click from looping into nonsense
				$('#gmap-3').live("pagecreate", function() {
					
					$('#map_canvas_1').gmap({'center': '59.3426606750, 18.0736160278'});
					
					$('#submit').click(function() {
						$('#map_canvas_1').gmap('displayDirections', { 'origin': $('#from').val(), 'destination': $('#to').val(), 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('directions')}, function(success, response) {
							if ( success ) {
								$('#results').show();
							} else {
								$('#results').hide();
							}
						});
						return false;
					});
				});
			
			$('#gmap-3-report').live("pageshow", function() {
						$(function() {
				$('#map_canvas').gmap().bind('init', function() { 
					
/*					$.getJSON( 'json.json', function(data) { 
						$.each( data.markers, function(i, m) {
							$('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(m.lat, m.lng), 'bounds': true } );
						});
					});*/
	
			
					$.ajax({
					  type: 'POST',
					  url: 'xml.php',
					  data: '&tipo_am=chk',
					   dataType:'text',
					  success:function(XMLData){//alert(XMLData); //use dataType:'text' to see it in the alert,
					
						  $(XMLData).find('coordinates').each(function(){		
						  lat_value=$(this).find('lat').text();//alert(lat_value);
						  lng_value=$(this).find('lng').text();//alert(lng_value);
						  gpos=$(this).find('gpos').text();//alert(gpos);
						  $('#map_canvas').gmap('addMarker', { 'position': new google.maps.LatLng(lat_value, lng_value), 'tags':gpos, 'bounds': true } ).click(function() {
							//$('#map_canvas').gmap('openInfoWindow', { 'content': $(this)[0].tags }, this);
						
							var mytags = $(this)[0].tags;
							
							$.ajax({
							  type: 'POST',
							  url: 'xml.php',
							  data: '&tipo_am=rep'+ '&gpos=' + mytags,
							  dataType:'text',
							  success:function(XMLData){//alert(XMLData); //use dataType:'text' to see it in the alert,
							
								  $(XMLData).find('venta_dia').each(function(){		
								  dia=$(this).find('dia').text();//alert(lat_value);
								  prodNombre=$(this).find('nombre_producto').text();//alert(lng_value);
								  cantidad=$(this).find('cantidad').text();//alert(gpos);
								  
								  // solo llega de a un día por ciclo (array de productos por día), armar los restantes dependiendo del día
								   HTML='<tr>'
											+'<th scope="row">'+prodNombre+'</th>'
											+'<td>'+cantidad+'</td>'
											+'<td></td>'
											+'<td></td>'
											+'<td></td>'
											+'<td></td>'
											+'<td></td>'
											+'<td></td>'								
										+'</tr>';
									//alert('"#slider_'+$(this).find('[type=checkbox]').attr("id")+'"');
									//var value = $( ".selector" ).slider( "option", "value" );
									$("#ventas").find('tbody').empty();
									$("#ventas").find('tbody').append(HTML);

								  });
								  
		  
							  },
							  error:function(){
								  alert("Ha ocurrido un error durante la ejecución");//se perdió la conexión con el servidor
							  }
						  });
						});
						  });
						  
  
					  },
					  error:function(){
						  alert("Ha ocurrido un error durante la ejecución");//se perdió la conexión con el servidor
					  }
				  });
					
				});
            });
			});
			

//--------------------------------------------------------------------------------------------
//Other functions

function sumOfColumns(tableID, columnIndex, hasHeader) {
  var tot = 0;
  $("#" + tableID + " tr" + (hasHeader ? ":gt(0)" : ""))
  .children("td:nth-child(" + columnIndex + ")")
  .each(function() {
    tot += parseFloat($(this).html());//parseInt($(this).html());
  });
  return tot;
}

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
//--------------------------------------------------------------------------------------------
//Jquery functions

$(document).ready(function() {        
	// Enter necessary functions here
 $(window).load(function() {
        $('#slider').nivoSlider();
		    });
			
			//alert($.mobile.activePage);

//--------------------------------------------------------------------------------------------
//login functions 

//	function IsLoggedIn()
//       {
		if (usr_priv==0){//Cada vez que el valor de la variable se pierda, consultarlo con el servidor.
		
				$.ajax({
					type: 'POST',
					url: 'log.inout.ajax.php',
					data: '&tipo_am=chk',
					success:function(msjlog){//alert(msjlog);
						if ( msjlog == 1 || msjlog == 3 ){
							usr_priv = msjlog;
									if ( usr_priv == 3 ){									
									$("#bk").attr("href", "../admin_menu.html")
									}
									else{
									$("#bk").attr("href", "../usr_menu.html")
									}
  						return true;
						}
						//else{
     						//alert("Lo sentimos, pero los datos son incorrectos:");
							//talvez debería botarlo a la página de login porque esto significa que la sesión es inexistente 
						//}

					},
					error:function(){
						//alert("Ha ocurrido un error durante la ejecución");//se perdió la conexión con el servidor
						$.ajax({
							type: 'POST',
							url: '../log.inout.ajax.php',//reintentar la petición ajax con URL situada en el directorio superior
							data: '&tipo_am=chk',
							success:function(msjlog){//alert(msjlog);
								if ( msjlog == 1 || msjlog == 3 ){
									usr_priv = msjlog;
									if ( usr_priv == 3 ){									
									$("#bk").attr("href", "../admin_menu.html")
									}
									else{
									$("#bk").attr("href", "../usr_menu.html")
									}
								return true;
								}
								//else{
									//alert("Lo sentimos, pero los datos son incorrectos:");
									//talvez debería botarlo a la página de login porque esto significa que la sesión es inexistente 
								//}
		
							},
							error:function(){
								alert("Ha ocurrido un error durante la ejecución");//se perdió la conexión con el servidor
							}
						});
					}
				});
			
		}
//	   }
	   
var timeSlide = 1000;

    $('#login_ui_btn').click(function(){
	
	setTimeout(function(){
			$('#userci').focus();
	},(300));
    });

/*
    $("#loginform").submit(function() {
      if ($("input:password").val() == "correct") {
        $("#res").text("Validated...").show().fadeOut(1270);
	$("#login_ui").attr({ disabled:true });
	$("#login_ui_btn").attr({ disabled:true, value:"Accediendo..." });
	$("#Submit1").attr({ disabled:true, value:"Accediendo..." });
	$("#Submit1").blur();

							setTimeout(function(){
								window.location.href = "admin_menu.html";//"." goes to root!
							},(timeSlide + 300));
        return true;
      }
      $("#res").text("Not valid!").show().fadeOut(3700);
      return false;
    });
*/


    $("#loginform").submit(function() {

 if ( LoginTry < 5 ){
	if ( $('#login_userci').val() != "" && $('#login_userpass').val() != "" ){
				USR_CI=$('#login_userci').val();
				$.ajax({
					type: 'POST',
					url: 'log.inout.ajax.php',
					data: 'login_userci=' + $('#login_userci').val() + '&login_userpass=' + $('#login_userpass').val()  + '&tipo_am=login',
					success:function(msj){//alert(msj);
						if ( msj == 1 || msj == 3 ){
							$("#res").text("Accediendo...").show().fadeOut(500);
							$("#login_ui_btn").attr({ disabled:true, value:"Accediendo..." });
							$("#Submit1").attr({ disabled:true, value:"Accediendo..." });
							//$("#Submit1").blur();
							$("#login_ui").attr({ disabled:true });
							usr_priv = msj;
							$("#res").text("Un momento por favor").show().fadeOut(timeSlide);
							setTimeout(function(){
								if ( usr_priv == 3 ){
									window.location.href = "admin_menu.html";//"." goes to root!
									$.mobile.showPageLoadingMsg();
/*										$.mobile.changePage( "admin_menu.html", {
										transition: "pop",
										reverse: false
									});*/
								
								
									}
									else{
									window.location.href = "usr_menu.html"
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "usr_menu.html", {
										transition: "pop",
										reverse: false
									});*/
								
									}
							},(timeSlide + 500));
  						return true;
						}
						else{
							//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
							LoginTry=LoginTry+1; 
							//alert(LoginTry);
							$("#res").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(){

						$("#res").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
			return false;
			}
			else{

   			  	$("#res").text("Los campos estan vacios").show().fadeOut(3700);
			return false;
			}
		}
		else{
		LoginDisabled();
	  	$("#res").text("Cantidad de intentos excedidos").show().fadeOut(3700);
		return false;
		}
    });
	
	function LoginDisabled()
       {
		   	$("#login_ui_btn").attr({ disabled:true});
			$("#login_ui").attr({ disabled:true });
			setTimeout(function(){
				LoginTry=0;
				$("#login_ui_btn").attr({ disabled:false});
				$("#login_ui").attr({ disabled:false});
			},(50000));
	   }

//--------------------------------------------------------------------------------------------
//Forms de ADM_Usrs
   $("#NewUsrForm").submit(function() {//alert($('#usertype').val());
	if ( $('#userci').val() != "" && $('#username').val() != "" && $('#userlastname1').val() != "" && $('#userlastname2').val() != "" && $('#password').val() != ""&& $('#password2').val() != ""){
		
			if ($('#password').val() == $('#password2').val()){

					$.ajax({
						type: 'POST',
						url: 'abc_usuarios.php',
						data: 'userci=' + $('#userci').val() + '&username=' + $('#username').val() + '&userlastname1=' + $('#userlastname1').val() + '&userlastname2=' + $('#userlastname2').val() + '&password=' + $('#password').val() + '&usertype=' + $('#usertype').val()  + '&userstatus=OK' + '&tipo_am=alta',
						success:function(NewUsrFormMSJ){//alert(NewUsrFormMSJ);
							if ( NewUsrFormMSJ == 1){
								$("#NewUsrFormRES").text("Un momento por favor").show().fadeOut(timeSlide);
								setTimeout(function(){
									if (usr_priv == 3 ){
										window.location.href = "../admin_menu.html";//"." goes to root!
										$.mobile.showPageLoadingMsg();
/*										$.mobile.changePage( "../admin_menu.html", {
											transition: "pop",
											reverse: false,
											changeHash: false
										});*/
									
										}
										else{
										window.location.href = "../usr_menu.html"
										$.mobile.showPageLoadingMsg();
/*										$.mobile.changePage( "../usr_menu.html", {
											transition: "pop",
											reverse: false,
											changeHash: false
										});
*/									
										}
								},(timeSlide + 500));
							return true;
							}
							else{
								//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
								$("#NewUsrFormRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
								 return false;
							}
	
						},
						error:function(){
	
							$("#NewUsrFormRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
								return false;
						}
					});
				return false;
				
				
			}
			else{
	
			$("#NewUsrFormRES").text("Las contraseñas no coinciden").show().fadeOut(3700);
			return false;
			}
		
		
		}
			else{

   		$("#NewUsrFormRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    });
   
      $("#EditUSRSettFRM").submit(function() {//alert($('#userci').val());
	if ( $('#userci').val() != "" && $('#password').val() != "" && $('#password1').val() != "" && $('#password2').val() != ""){
			if ($('#password1').val() == $('#password2').val()){
					$.ajax({
						type: 'POST',
						url: 'abc_usuarios.php',
						data: 'userci=' + $('#userci').val() + '&password=' + $('#password').val() + '&password1=' + $('#password1').val() + '&tipo_am=CambioPass',
						success:function(EditUSRSetMSJ){alert(EditUSRSetMSJ);
							if ( EditUSRSetMSJ == 3){								
								$("#EditUSRSettingsRES").text("Un momento por favor").show().fadeOut(timeSlide);
								setTimeout(function(){
									if (usr_priv == 3 ){
										window.location.href = "../admin_menu.html";//"." goes to root!
										$.mobile.showPageLoadingMsg();
/*										$.mobile.changePage( "../admin_menu.html", {
											transition: "pop",
											reverse: false,
											changeHash: false
										});*/
										
										}
										else{
										window.location.href = "../usr_menu.html"
										$.mobile.showPageLoadingMsg();
/*										$.mobile.changePage( "../usr_menu.html", {
											transition: "pop",
											reverse: false,
											changeHash: false
										});
*/									
									
										}
								},(timeSlide + 500));
							return true;
								}
							else{								
								if ( EditUSRSetMSJ == 0){
									$("#EditUSRSettingsRES").text("Lo sentimos, pero su CI o su contraseña original son incorrectos:").show().fadeOut(3700);
									return false;
									}
								else{
								$("#EditUSRSettingsRES").text("Hay un error en su CI o su contraseña original:").show().fadeOut(3700);
								return false;
								}
		
							}
	
						},
						error:function(){
	
							$("#EditUSRSettingsRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
								return false;
						}
					});
				return false;
				
			
			}
				else{
	
			$("#EditUSRSettingsRES").text("Las nuevas contraseñas no coinciden").show().fadeOut(3700);
			return false;
			}
		}
			else{

   		$("#EditUSRSettingsRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    });

   $("#EditUsrForm").submit(function() {//alert($('#usertype').val());
													 
	if ( $('#userci').text() != "" && $('#username').val() != "" && $('#userlastname1').val() != "" && $('#userlastname2').val() != ""){

				$.ajax({
					type: 'POST',
					url: 'abc_usuarios.php',
					data: 'userci=' + $('#userci').text() + '&username=' + $('#username').val() + '&userlastname1=' + $('#userlastname1').val() + '&userlastname2=' + $('#userlastname2').val() + '&usertype=' + $('#usertype').val() + '&tipo_am=modificar',
					success:function(NewUsrFormMSJ){//alert(NewUsrFormMSJ);
						if ( NewUsrFormMSJ == 1){
							$("#EditUsrRES").text("Un momento por favor").show().fadeOut(timeSlide);
							setTimeout(function(){
								if (usr_priv == 3 ){
									  window.location.href = "../admin_menu.html";//"." goes to root!
									  $.mobile.showPageLoadingMsg();
/*										$.mobile.changePage( "../admin_menu.html", {
										  transition: "pop",
										  reverse: false,
										  changeHash: false
									  });*/
								
									}
									else{
									window.location.href = "../usr_menu.html"
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../usr_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});
*/								
									}
							},(timeSlide + 500));
  						return true;
						}
						else{
							//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
							$("#EditUsrRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(){

						$("#EditUsrRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
			return false;
			}
			else{

   		$("#EditUsrRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    });

   $("#DisableUsrForm").submit(function() {//alert("whaa");
	if ( $('#userci').text() != ""){

				$.ajax({
					type: 'POST',
					url: 'abc_usuarios.php',
					data: 'userci=' + $('#userci').text() + '&userstatus=DWN' + '&tipo_am=baja',
					success:function(NewUsrFormMSJ){//alert(NewUsrFormMSJ);
						if ( NewUsrFormMSJ == 1){
							$("#DisableUsrRES").text("Un momento por favor").show().fadeOut(timeSlide);
							setTimeout(function(){
								if (usr_priv == 3 ){
									window.location.href = "../admin_menu.html";//"." goes to root!
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../admin_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});
								*/
									}
									else{
									window.location.href = "../usr_menu.html"
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../usr_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
							},(timeSlide + 500));
  						return true;
						}
						else{
							//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
							$("#DisableUsrRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(){

						$("#DisableUsrRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
			return false;
			}
			else{

   		$("#DisableUsrRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    });


function BuscarUsuarioValidCI(elEvento)
         {
              if ( (elEvento.keyCode <= 13) || (elEvento.keyCode >= 48 && elEvento.keyCode <= 57 ))
            	{alert(elEvento);
               //BuscarUsuario(elEvento);
               return true;
				}
              else
              	{
                    return false;
				 }
         }
         
function BuscarUsuario(EventoBusqueda)
         {
		$.ajax({
					type: 'POST',
					url: 'abc_usuarios.php',
					dataType: 'xml',//'text',//
					data: 'SearchData=' + $('#SearchData').val() + '&tipo_am=buscar',
					success:function(XMLData){//alert(XMLData); //use dataType:'text' to see it in the alert,
						if ($(XMLData).find('entry')){
							$("#searchres").text("Un momento por favor").show().fadeOut(timeSlide);
					
							if ($('.ui-page-active').attr('id') == "EditUsr"){	
								$(XMLData).find('entry').each(function(){
								$("#userci").text($(this).find('userci').text());
								$("#username").val($(this).find('username').text());
								$("#userlastname1").val($(this).find('userlastname1').text());
								$("#userlastname2").val($(this).find('userlastname2').text());
																
								var elem = $('#usertype');// Grab a select field
								elem.val($(this).find('usertype').text()).attr('selected', true).siblings('option').removeAttr('selected');// Select the relevant option, de-select any others
								
								elem.selectmenu("refresh", true);// jQM refresh

								});
							}
							else{		
								$(XMLData).find('entry').each(function(){											
								$("#userci").text($(this).find('userci').text());
								$("#username").text($(this).find('username').text());
								$("#userlastname1").text($(this).find('userlastname1').text());
								$("#userlastname2").text($(this).find('userlastname2').text());
								$("#usertype").text($(this).find('usertype').text());
								});
							}
  						return true;
						}
						else{
							$("#searchres").text("No hay resultados:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(jqXHR, textStatus, errorThrown){alert(jqXHR);alert(textStatus);alert(errorThrown);

						$("#searchres").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
		 
			 
		 }
		 
 $("#SearchUsrForm").submit(function() {
	
	if ( $('#SearchData').val() != ""){
		BuscarUsuario($('#SearchData').val());
		return false;
		}
			else{
   		$("#searchres").text("Campo de búsqueda vacio").show().fadeOut(3700);
 		return false;
		}
									  									  
    });									  
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//AddProduct functions 
   $("#NewProductForm").submit(function() {
	if ( $('#PID').val() != "" && $('#nombre_producto').val() != "" && $('#empaque').val() != "" && $('#unidades_tamano').val() != "" && $('#precio_unitario').val() != "" && $('#precio_venta').val() != ""){//alert($('#NTP').val());
	//alert('PID=' + $('#PID').val() + '&nombre_producto=' + $('#nombre_producto').val() + '&empaque=' + $('#empaque').val() + '&unidades_tamano=' + $('#unidades_tamano').val() + '&precio_unitario=' + $('#precio_unitario').val() + '&precio_venta=' + $('#precio_venta').val() + '&NTP=' + $('#NTP').val() + '&tipo_am=alta');
	
				$.ajax({
					type: 'POST',
					url: 'abc_Productos.php',
					data: 'PID=' + $('#PID').val() + '&nombre_producto=' + $('#nombre_producto').val() + '&empaque=' + $('#empaque').val() + '&unidades_tamano=' + $('#unidades_tamano').val() + '&precio_unitario=' + $('#precio_unitario').val() + '&precio_venta=' + $('#precio_venta').val() + '&NTP=' + $('#NTP').val() + '&tipo_am=alta',
					success:function(NewUsrFormMSJ){//alert(NewUsrFormMSJ);
						if ( NewUsrFormMSJ == 1){
							$("#NewProductRES").text("Un momento por favor").show().fadeOut(timeSlide);
							setTimeout(function(){
								if (usr_priv == 3 ){
									window.location.href = "../admin_menu.html";//"." goes to root!
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../admin_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
									else{
									window.location.href = "../usr_menu.html"
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../usr_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
									}
							},(timeSlide + 500));
  						return true;
						}
						else{
							//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
							$("#NewProductRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(){

						$("#NewProductRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
			return false;

			}
			else{
   		$("#NewProductRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    });

   $("#EditProdForm").submit(function() {//alert($('#usertype').val());
													 
	if ( $('#PID').text() != "" && $('#nombre_producto').val() != "" && $('#empaque').val() != "" && $('#unidades_tamano').val() != "" && $('#precio_unitario').val() != "" && $('#precio_venta').val() != ""){

				$.ajax({
					type: 'POST',
					url: 'abc_Productos.php',
					data: 'PID=' + $('#PID').text() + '&nombre_producto=' + $('#nombre_producto').val() + '&empaque=' + $('#empaque').val() + '&unidades_tamano=' + $('#unidades_tamano').val() + '&precio_unitario=' + $('#precio_unitario').val() + '&precio_venta=' + $('#precio_venta').val() + '&NTP=' + $('#NTP').val() + '&tipo_am=modificar',
					success:function(EditProdFormMSJ){//alert(EditProdFormMSJ);
						if ( EditProdFormMSJ == 1){
							$("#EditProdRES").text("Un momento por favor").show().fadeOut(timeSlide);
							setTimeout(function(){
								if (usr_priv == 3 ){
									window.location.href = "../admin_menu.html";//"." goes to root!
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../admin_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
									else{
									window.location.href = "../usr_menu.html"
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../usr_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
							},(timeSlide + 500));
  						return true;
						}
						else{
							//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
							$("#EditProdRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(){

						$("#EditProdRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
			return false;
			}
			else{

   		$("#EditProdRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    });

   $("#DisableProdForm").submit(function() {//alert("whaa");
	if ( $('#PID').text() != ""){

				$.ajax({
					type: 'POST',
					url: 'abc_Productos.php',
					data: 'PID=' + $('#PID').text() + '&status=DWN' + '&tipo_am=baja',
					success:function(DisableProdFormMSJ){//alert(DisableProdFormMSJ);
						if ( DisableProdFormMSJ == 1){
							$("#DisableProdRES").text("Un momento por favor").show().fadeOut(timeSlide);
							setTimeout(function(){
								if (usr_priv == 3 ){
									window.location.href = "../admin_menu.html";//"." goes to root!
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../admin_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
									else{
									window.location.href = "../usr_menu.html"
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../usr_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
							},(timeSlide + 500));
  						return true;
						}
						else{
							//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
							$("#DisableProdRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(){

						$("#DisableProdRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
			return false;
			}
			else{

   		$("#DisableProdRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    });


   function BuscarProducto(EventoBusqueda)
         {
		$.ajax({
					type: 'POST',
					url: 'abc_Productos.php',
					dataType: 'xml',//'text',//
						data: 'SPID=' + $('#SPID').val() + '&NTP2=' + $('#NTP2').val() + '&tipo_am=buscar',
					success:function(XMLData){//alert(XMLData); //use dataType:'text' to see it in the alert,
						if ($(XMLData).find('entry')){
							$("#searchres").text("Un momento por favor").show().fadeOut(timeSlide);
					
							if ($('.ui-page-active').attr('id') == "EditProd"){	
								$(XMLData).find('entry').each(function(){
								$("#PID").text($(this).find('PID').text());
								$("#nombre_producto").val($(this).find('nombre_producto').text());
								$("#empaque").val($(this).find('empaque').text());
								$("#unidades_tamano").val($(this).find('unidades_tamano').text());
								$("#precio_unitario").val($(this).find('precio_unitario').text());
								$("#precio_venta").val($(this).find('precio_venta').text());
																
								var elem = $('#NTP');// Grab a select field
								elem.val($(this).find('NTP').text()).attr('selected', true).siblings('option').removeAttr('selected');// Select the relevant option, de-select any others
								
								elem.selectmenu("refresh", true);// jQM refresh

								});
							}
							else{		
								$(XMLData).find('entry').each(function(){											
								$("#PID").text($(this).find('PID').text());
								$("#nombre_producto").text($(this).find('nombre_producto').text());
								$("#empaque").text($(this).find('empaque').text());
								$("#unidades_tamano").text($(this).find('unidades_tamano').text());
								$("#precio_unitario").text($(this).find('precio_unitario').text());
								$("#precio_venta").text($(this).find('precio_venta').text());
								$("#NTP").text($(this).find('NTP').text());
								});
								
								$("#prod_results").empty();
								$(XMLData).find('entry').each(function(){											
HTML='<li>'
  +'<img src="../IMGProductos/'+$(this).find('NombreImagen').text()+'" id="'+$(this).find('NombreImagen').text()+'" alt="'+$(this).find('NombreImagen').text()+'">'
                        +'<input type="checkbox" name="'+$(this).find('PID').text()+'" id="'+$(this).find('PID').text()+'" class="custom" />'
+'<label for="'+$(this).find('PID').text()+'">'+$(this).find('nombre_producto').text()+' '+$(this).find('empaque').text()+' '+$(this).find('unidades_tamano').text()+'</label>'
                        +'<label for="slider_'+$(this).find('PID').text()+'">Cantidad:</label>'
                     +'<input type="range" name="slider" id="slider_'+$(this).find('PID').text()+'" value="10" min="0" max="500" step="1" data-highlight="true" />'
                        +'<br><label for="precio_'+$(this).find('PID').text()+'" class="ui-input-text">Precio Bs:</label>'
                            +'<select id="precio_'+$(this).find('PID').text()+'" data-native-menu="false">'
                            +'<option value="'+$(this).find('precio_venta').text()+'">'+$(this).find('precio_venta').text()+'</option>'
                            +'<option value="'+$(this).find('precio_unitario').text()+'">'+$(this).find('precio_unitario').text()+'</option>'
                        +'</select>'
					+'</li>';
					$("#prod_results").append(HTML);
								});
					$("#prod_results").trigger('create');
								
								
  
								
								

								
							}
  						return true;
						}
						else{
							$("#searchres").text("No hay resultados:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(jqXHR, textStatus, errorThrown){alert(jqXHR);alert(textStatus);alert(errorThrown);

						$("#searchres").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
		 
			 
		 }
		 
 $("#SearchProdForm").submit(function() {
	
	if ( $('#SPID').val() != ""){
		BuscarProducto($('#SPID').val(),$('#NTP2').val());
		return false;
		}
			else{
   		$("#searchres").text("Campo de búsqueda vacio").show().fadeOut(3700);
 		return false;
		}
									  									  
    });
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//Selling_ui functions 

   $("#AddVentasForm").submit(function() {//alert($("#latitud").text()); alert($("#longitud").text()); alert($("#nombre_lugar").text()); alert($("#SellME").text());
   
   
   if ( $('#latitud').val() != "" && $('#longitud').val() != "" && $('#nombre_lugar').val() != ""){
//alert('latitud=' + $('#latitud').text() + '&longitud=' + $('#longitud').text() + '&nombre_lugar=' + $('#nombre_lugar').text() + '&tipo_am=alta');

		$.ajax({
			type: 'POST',
			url: 'abc_Ventas.php',
			data: 'latitud=' + $('#latitud').val() + '&longitud=' + $('#longitud').val() + '&nombre_lugar=' + $('#nombre_lugar').val() + '&tipo_am=alta_geoloc',
			success:function(VentasFormMSJ){//alert(VentasFormMSJ);
				if (VentasFormMSJ){
					
						$(VentasFormMSJ).find('gposID').each(function(){		
						var TXT=$(this).find('gpos').html();
						$("#gpos").val(TXT);						
						});
						$("#userCI").empty();
						$(VentasFormMSJ).find('getuserID').each(function(){		
						var TXT=$(this).find('userID').text();
						$("#userCI").val(TXT);									
						});
						$("#lugares").empty();
						$(VentasFormMSJ).find('lugares').each(function(){		
						var TXT=$(this).find('nombre_lugar').text();
						$("#lugares").append('<option value="'+TXT+'">'+TXT+'</option>');									
						});
						$('#lugares').change(function(){
							$("#to").val($('#lugares').val());
						});	
						
							
						var loops=0;
				
						$("#prod_results").find('li').each(function(){
							
								var prodID=$(this).find('[type=checkbox]').attr("id");
								var prodNombre=$(this).find('label[for="'+prodID+'"]').text();
								var precio=$(this).find('select').val();
								var cantidad=$('#slider_'+$(this).find('[type=checkbox]').attr("id")).val();//este costó descubrirlo pero lo logré gracias a Dios.

							if($(this).find('[type=checkbox]').get(0).checked && eval(cantidad)!=0)
							{loops++;
							
								//$("input[type=range]").val()
								//alert($(this).find('input[type=range]').attr("id"));
								//alert($("#slider_F04552").val());
								var repeated=0;	
									$("#SellME").find('tr').each(function(){											
									if($(this).find('td:eq(1)').text()==prodID)
									{repeated++;
									} 
									});
								if(repeated>0)
								{$("#AddVentasFormRES").text("Se excluyó al menos un producto que ya está en la factura").show().fadeOut(3700);
								} 
								else	
								{	 HTML='<tr rowID="'+prodID+'">'
											+'<td style="font-weight:bold;">'+prodNombre+'</th>'
											+'<td style="visibility:hidden;">'+prodID+'</td>'
											+'<td>'+precio+'</td>'
											+'<td>'+cantidad+'</td>'
											+'<td>'+eval(precio*cantidad)+'</td>'
											+'<td><div data-role="button" data-icon="delete"></div></td>'								
										+'</tr>';
									//alert('"#slider_'+$(this).find('[type=checkbox]').attr("id")+'"');
									//var value = $( ".selector" ).slider( "option", "value" );
									$("#SellME").find('tbody').append(HTML);

									$("#Total_Factura").text(sumOfColumns('SellME', 5, false));// 
									
									
								}
							 }
								$('table td div').click(function(){//clever code to delete table rows on click
									$(this).parent().parent().remove();
									$("#Total_Factura").text(sumOfColumns('SellME', 5, false));
								});		
									
						  });
				  if (loops==0){
				  $("#AddVentasFormRES").text("Elija al menos un producto, la cantidad no debe ser cero").show().fadeOut(3700);//$("#SellME").find('tbody').append(HTML);
				  }
									  
									  $("#SellME").trigger('create');

							
				}
			else{
				//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
				$("#AddVentasFormRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
				//return false;
			}

		},
		error:function(){

			$("#AddVentasFormRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
			//return false;
		}
	});
//return false;
}
else{

$("#AddVentasFormRES").text("No se pudo establecer su posición global").show().fadeOut(3700);
//return false;
}


return false;   							
	});

//--------------------------------------
//Vender

   $("#VentasForm").submit(function() {//alert($("#latitud").text()); alert($("#longitud").text()); alert($("#nombre_lugar").text()); alert($("#SellME").text());
   
								
	  $('#hf').empty();
	  
	  $(function () {
	  $("#SellME").tabletojson({
		  //supply headers you want to include plus column position 0 based.
		  headers: "{'1':'PID', '2':'Precio', '3':'Cantidad'}",  
		  //supply attributes you wan to include, attribute name and then how you want it to appear in JSON string.
		  attributes: "{'rowID':'rowID'}", 

		  dumpElement: "#hf",
		  onComplete: null/*function (x) {
			  alert(x);
		  }*/
	  });

  });
//JSON.stringify(JSON.parse($('#hf').val()))
alert('gpos='+$('#gpos').val()+'customerID='+$('#customerID').val()+'&customer='+$('#customer').val()+'&matrix_sell='+$('#hf').val()+ '&tipo_am=alta');
	if ( $('#gpos').val() != "" && $('#userCI').val() != "" && $('#customerID').val() != "" && $('#customer').val() != "" && $('#hf').val()!=""){
//

				$.ajax({
				  type: 'POST',
				  url: 'abc_Ventas.php',
				  data: 'gpos='+$('#gpos').val()+'&userCI='+$('#userCI').val()+'&customerID='+$('#customerID').val()+'&customer='+$('#customer').val()+'&matrix_sell='+$('#hf').val()+ '&tipo_am=alta',
					success:function(VentasFormMSJ){alert(VentasFormMSJ);
						if ( VentasFormMSJ == 1){
							$("#VentasFormRES").text("Un momento por favor").show().fadeOut(timeSlide);
							setTimeout(function(){
								if (usr_priv == 3 ){
									window.location.href = "../admin_menu.html";//"." goes to root!
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../admin_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
									else{
									window.location.href = "../usr_menu.html"
									$.mobile.showPageLoadingMsg();
/*									$.mobile.changePage( "../usr_menu.html", {
										transition: "pop",
										reverse: false,
										changeHash: false
									});*/
								
									}
							},(timeSlide + 500));
  						return true;
						}
						else{
							//$('.box-error').hide(0).html('Lo sentimos, pero los datos son incorrectos: ' + msj);
							$("#VentasFormRES").text("Lo sentimos, pero los datos son incorrectos:").show().fadeOut(3700);
     						 return false;
						}

					},
					error:function(){

						$("#VentasFormRES").text("Ha ocurrido un error durante la ejecución").show().fadeOut(3700);
      						return false;
					}
				});
			return false;
			}
			else{

   		$("#VentasFormRES").text("Los campos estan vacios").show().fadeOut(3700);
 		return false;
		}


    							
	});


//--------------------------------------------------------------------------------------------

});