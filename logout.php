
<?php
	session_start();
	session_destroy();
	//header('Location: ./');
	exit(0);
?>

<!DOCTYPE HTML>
<html class="ui-mobile">

<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8"> 
 

	<meta charset="utf-8">
	<title>My Page</title>

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />

	<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>
	<script type="text/javascript" src="LoginFunctions.js"></script>


</head> 

<body class="ui-mobile-viewport" onload> 

<!-- Start of first page -->
<div data-role="page" id="LogOut">

        <!-- start header -->
	<div data-role="header" data-nobackbtn="true">
		<h1>Sistema de control</h1>
	</div>
	<!-- /header -->

	<div data-role="content">
		<p>
		<br>	
		Cerrando sesi&oacute;n
		<br>	
		</p>
	</div><!-- /content -->

	<div data-role="footer">
		<h4>My Mobile App</h4>
	</div><!-- /footer -->
</div><!-- /page -->





<div style="top: 273px;" class="ui-loader ui-body-a ui-corner-all"><span class="ui-icon ui-icon-loading spin"></span><h1>loading</h1></div>

</body>

</html>