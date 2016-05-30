<?php
        include('../conexion.php');
	session_start();
	
		//If not isset -> set with dumy value so it doesn't complain unexpectedly echoing  HTML full of "Notice: Undefined index"
		if (!isset($_POST['PID']))
		{$_POST['PID'] = "";} 
		if (!isset($_POST['SPID']))
		{$_POST['SPID'] = "";} 
		if (!isset($_POST['nombre_producto']))
		{$_POST['nombre_producto'] = "";}
		if (!isset($_POST['empaque']))
		{$_POST['empaque'] = "";}		
		if (!isset($_POST['unidades_tamano']))
		{$_POST['unidades_tamano'] = "";}
		if (!isset($_POST['precio_unitario']))
		{$_POST['precio_unitario'] = "";}
		if (!isset($_POST['precio_venta']))
		{$_POST['precio_venta'] = "";}
		if (!isset($_POST['NTP']))
		{$_POST['NTP'] = "";}
		if (!isset($_POST['NTP2']))
		{$_POST['NTP2'] = "";}
		if (!isset($_POST['status']))
		{$_POST['status'] = "";}
		
        //variables POST
        $PID=$_POST['PID'];
        $SPID=$_POST['SPID'];
        $nombre_producto=trim($_POST['nombre_producto']);
        $empaque=trim($_POST['empaque']);
        $unidades_tamaño=trim($_POST['unidades_tamano']);
        $precio_unitario=trim($_POST['precio_unitario']);
        $precio_venta=trim($_POST['precio_venta']);
        $NTP=trim($_POST['NTP']);
		$NTP2=trim($_POST['NTP2']);
		$status=trim($_POST['status']);

        $tipo_am=$_POST['tipo_am'];
		
switch ($tipo_am) {
    case "alta":
        // GRABAR
$sql="INSERT INTO productos (PID, nombre_producto, empaque, unidades_tamaño, precio_unitario, precio_venta, NTP) VALUES ('$PID','$nombre_producto','$empaque','$unidades_tamaño','$precio_unitario','$precio_venta','$NTP')";             
		mysql_query($sql,$con);
		mysql_close();
		echo 1;
        break;
	case "baja":
       // DAR DE BAJA (NOTE QUE SOLO CAMBIA UN FLAG)
		$sql="UPDATE productos SET status='$status' WHERE PID='$PID'";
		mysql_query($sql,$con);
		mysql_close();
		echo 1;
        break;
    case "modificar":
       // MODIFICAR
		$sql="UPDATE productos SET nombre_producto='$nombre_producto', empaque='$empaque', unidades_tamaño='$unidades_tamaño', precio_unitario='$precio_unitario', precio_venta='$precio_venta', NTP='$NTP' WHERE PID='$PID'";
		mysql_query($sql,$con);
		mysql_close();
		echo 1;
        break;
    case "buscar":
         // BUSCAR
		 $sql = "SELECT * FROM productos WHERE status='OK' &&( PID='$SPID' || (nombre_producto like '%".$SPID."%' && NTP='$NTP2') )ORDER BY PID";//";
		 
	     $resultID = @mysql_query($sql, $con);
		 $numfilas= @mysql_num_rows($resultID);
		    
			$xml_output = "<?xml version=\"1.0\"?>\n";
			$xml_output .= "<entries>\n";
			
			for($x = 0 ; $x < @mysql_num_rows($resultID) ; $x++){
				$row = @mysql_fetch_assoc($resultID); 
				$xml_output .= "\t<entry>\n";
				$xml_output .= "\t\t<PID>" . $row['PID'] . "</PID>\n";
				$xml_output .= "\t\t<nombre_producto>" . $row['nombre_producto'] . "</nombre_producto>\n";
				$xml_output .= "\t\t<empaque>" . $row['empaque'] . "</empaque>\n";
				$xml_output .= "\t\t<unidades_tamano>" . $row['unidades_tamaño'] . "</unidades_tamano>\n";
				$xml_output .= "\t\t<precio_unitario>" . $row['precio_unitario'] . "</precio_unitario>\n";
				$xml_output .= "\t\t<precio_venta>" . $row['precio_venta'] . "</precio_venta>\n";
				$xml_output .= "\t\t<NTP>" . $row['NTP'] . "</NTP>\n";
				$xml_output .= "\t\t<NombreImagen>" . $row['NombreImagen'] . "</NombreImagen>\n";
				$xml_output .= "\t</entry>\n";
			}
			
			$xml_output .= "</entries>";
			
			echo $xml_output; 

		mysql_close();
		break;
}
        
?>

