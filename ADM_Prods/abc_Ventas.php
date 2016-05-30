<?php
        include('../conexion.php');
	session_start();
	
  		 //If not isset -> set with dumy value so it doesn't complain unexpectedly echoing  HTML full of "Notice: Undefined index"
		if (!isset($_POST['PID']))
		{$_POST['PID'] = "";} 
		if (!isset($_POST['latitud']))
		{$_POST['latitud'] = "";}
		if (!isset($_POST['longitud']))
		{$_POST['longitud'] = "";}		
		if (!isset($_POST['nombre_lugar']))
		{$_POST['nombre_lugar'] = "";}
		if (!isset($_POST['precio_unitario']))
		{$_POST['precio_unitario'] = "";}
		if (!isset($_POST['precio_venta']))
		{$_POST['precio_venta'] = "";}
		if (!isset($_POST['NTP']))
		{$_POST['NTP'] = "";}
		if (!isset($_POST['userCI']))
		{$_POST['userCI'] = "";}
		if (!isset($_POST['gpos']))
		{$_POST['gpos'] = "";}
		if (!isset($_POST['customerID']))
		{$_POST['customerID'] = "";}
		if (!isset($_POST['customer']))
		{$_POST['customer'] = "";}
		if (!isset($_POST['matrix_sell']))
		{$_POST['matrix_sell'] = "";}
		
        //variables POST
        $PID=$_POST['PID'];
        $latitud=trim($_POST['latitud']);
        $longitud=trim($_POST['longitud']);
        $nombre_lugar=trim($_POST['nombre_lugar']);
        $precio_unitario=trim($_POST['precio_unitario']);
        $precio_venta=trim($_POST['precio_venta']);
        $NTP=trim($_POST['NTP']);
		$userCI=trim($_POST['userCI']);
		$gpos=trim($_POST['gpos']);
		$customerID=trim($_POST['customerID']);

        $tipo_am=$_POST['tipo_am'];
		
switch ($tipo_am) {
	
	case "alta_geoloc":
        // GRABAR
		//$nombre_lugar=addslashes($nombre_lugar);
		//primero verificamos si ya exixte en la base de datos
		$sql="SELECT * FROM geolocalizacion where  latitud = '$latitud' && longitud ='$longitud'"; 
		$result = mysql_query($sql, $con) or die(mysql_error());
		if(is_resource($result)&&mysql_num_rows($result)!=0)
		{
					$xml_output = "<?xml version=\"1.0\"?>\n";
					$xml_output .= "<entries>\n";
					
					//si existe, devolvemos el valor del ID de la posición
					$row = @mysql_fetch_assoc($result); 
					$xml_output .= "\t<gposID>\n";
					$xml_output .= "\t\t<gpos>" . $row['gpos'] . "</gpos>\n";
					$xml_output .= "\t</gposID>\n";
					
					session_start();
					$xml_output .= "\t<getuserID>\n";
					$xml_output .= "\t\t<userID>" .$_SESSION['userid']. "</userID>\n";
					$xml_output .= "\t</getuserID>\n";					
					
					//ahora a llenar los puntos de venta 
					$sql="SELECT * FROM geolocalizacion"; 
					$result = mysql_query($sql, $con) or die(mysql_error());
					for($x = 0 ; $x < @mysql_num_rows($result) ; $x++){
						$row = @mysql_fetch_assoc($result); 
						$xml_output .= "\t<lugares>\n";
						$xml_output .= "\t\t<nombre_lugar>" . $row['nombre_lugar'] . "</nombre_lugar>\n";
						$xml_output .= "\t</lugares>\n";
					}
					
					$xml_output .= "</entries>";
		}
	   	else
		{//si no exste lo insertamos
		$sql="INSERT INTO geolocalizacion (latitud, longitud, nombre_lugar) VALUES ('$latitud','$longitud','$nombre_lugar')";             
		mysql_query($sql, $con) or die(mysql_error());
		//y buscamos su ID de posición para devolverlo
		$sql="SELECT * FROM geolocalizacion where latitud = '$latitud' && longitud ='$longitud' && nombre_lugar='$nombre_lugar'"; 
		$result = mysql_query($sql, $con) or die(mysql_error());
		$row = @mysql_fetch_assoc($result); 
					$xml_output = "<?xml version=\"1.0\"?>\n";
					$xml_output .= "<entries>\n";
					
					//si existe, devolvemos el valor del ID de la posición
					$row = @mysql_fetch_assoc($result); 
					$xml_output .= "\t<gposID>\n";
					$xml_output .= "\t\t<gpos>" . $row['gpos'] . "</gpos>\n";
					$xml_output .= "\t</gposID>\n";
					
					session_start();
					$xml_output .= "\t<getuserID>\n";
					$xml_output .= "\t\t<userID>" .$_SESSION['userid']. "</userID>\n";
					$xml_output .= "\t</getuserID>\n";
					
					//ahora a llenar los puntos de venta 
					$sql="SELECT DISTINCT nombre_lugar FROM geolocalizacion ORDER BY nombre_lugar";
					$result = mysql_query($sql, $con) or die(mysql_error());
					for($x = 0 ; $x < @mysql_num_rows($result) ; $x++){
						$row = @mysql_fetch_assoc($result); 
						$xml_output .= "\t<lugares>\n";
						$xml_output .= "\t\t<nombre_lugar>" . $row['nombre_lugar'] . "</nombre_lugar>\n";
						$xml_output .= "\t</lugares>\n";
					}
					
					$xml_output .= "</entries>";
		}
  		$xml_output=iconv("ISO-8859-1","UTF-8",$xml_output);
		echo $xml_output; 
		mysql_close();
        break;
    case "alta":
        // GRABAR
		//addslashes($nombre_lugar);
		date_default_timezone_set("America/La_Paz");
		$date=date('Y-m-d');
		$time=date("H:i:s");
		$sql="INSERT INTO venta (CI, NCL, gpos, fecha, hora) VALUES ('$userCI','$customerID','$gpos','$date','$time')";             
		mysql_query($sql,$con) or die(mysql_error());
		$sql="SELECT * FROM venta where fecha = '$date' && hora ='$time' "; 
		$result = mysql_query($sql, $con) or die(mysql_error());
		$row = @mysql_fetch_assoc($result); 
		$NV=$row['NV'];
		 $json = json_decode($_POST['matrix_sell'],true);
		//echo print_r($json);
		
/* //OK foreach is beautiful, but we can't use it here
		foreach ($json as $v1) {
			foreach ($v1 as $v2) {
				echo "$v2\n";
			}
		}*/
		
		$array_size = count($json);
		for($i = 0; $i < $array_size; $i++)
		{
 $sql="INSERT INTO venta_productos (NV, PID, cantidad, precio_venta) VALUES ('$NV','".$json[$i]['PID']."','".$json[$i]['Cantidad']."','".$json[$i]['Precio']."')";             
		mysql_query($sql,$con) or die(mysql_error());

		}
		mysql_close();
		echo 1;
        break;
    case "modificar":
       // MODIFICAR
		$sql="UPDATE productos SET c2='$nom' WHERE PID='$PID'";
		mysql_query($sql,$con);
		mysql_close();
		echo 0;
        break;
    case "buscar":
         // BUSCAR
		 $sql = "SELECT * FROM productos WHERE PID='$PID' ORDER BY PID";
	     $result = mysql_query($sql, $con);
         $numfilas= mysql_num_rows($result);
         if ($numfilas==0 )
         {
			//echo json_encode(array("a" => "valueA", "b" => "valueB"));
            mysql_close();
         }
         else
         {
		mysql_close();
		echo 0;
         }
        break;
}
        
?>

